
const neo4j = require('neo4j');
const Promise = require('bluebird');
const queries = require('./queries');

const oneDay = 86400;

function getTTL(store, session, sid) {
  if (typeof store.ttl === 'number') return store.ttl;
  if (typeof store.ttl === 'function') return store.ttl(store, session, sid);
  if (store.ttl) throw new TypeError('`store.ttl` must be a number or function');

  const maxAge = session.cookie && session.cookie.maxAge;

  return (typeof maxAge === 'number' ?
      Math.floor(maxAge / 1000) : oneDay
  );
}

module.exports = function (session) {

  const Store = session.Store;

  class Neo4jStore extends Store {
    constructor(options = {}) {
      super(options);
      if (typeof options === 'string') {
        options = {url: options};
      }
      // Shallow copy the options
      this.options = Object.assign({}, options);

      this.serializer = options.serializer || JSON;

      if (this.options.url) {
        this.client = new neo4j.GraphDatabase(this.options.url);
      } else if (this.options.createClient) {
        this.client = this.createClient();
      } else if (this.options.client) {
        this.client = this.options.client;
      } else {
        throw new Error('Must specify a client!');
      }

      // Promisify the client
      this.client.cypherAsync =
        Promise.promisify(this.client.cypher, {context: this.client});

      this.ttl = this.options.ttl;
      this.disableTTL = this.options.disableTTL;
    }

    get(sid, fn) {

      return Promise.resolve(queries.get(sid))
        .then(query => this.client.cypherAsync(query))
        .then(data => data[0] && this.serializer.parse(data[0]['u.session']))
        .asCallback(fn);

    }

    set(sid, session, fn) {

      let ttl;

      if (!this.disableTTL) {
        ttl = getTTL(this, session, sid);
      }

      return Promise.resolve(session)
        .then(s => this.serializer.stringify(s))
        .then(serialized => this.client.cypherAsync(queries.set(sid, serialized, ttl)))
        .asCallback(fn);

    }

    destroy(sid, fn) {
      return Promise.resolve(queries.destroy(sid))
        .then(query => this.client.cypherAsync(query))
        .asCallback(fn);
    }

    touch(sid, session, fn) {
      if (this.disableTTL) return fn();

      const ttl = getTTL(this, session);

      return Promise.resolve(queries.touch(sid, ttl))
        .then(query => this.client.cypherAsync(query))
        .asCallback(fn);
    }

    ids(fn) {
      return Promise.resolve(queries.ids())
        .then(query => this.client.cypherAsync(query))
        .then(results => results.map(res => res['s.id']))
        .asCallback(fn);
    }

    all(fn) {
      return Promise.resolve(queries.all())
        .then(query => this.client.cypherAsync(query))
        .then(results => results.map(res => {
          let data = this.serializer.parse(res['s.session']);
          data.id = res['s.id'];
          return data;
        }))
        .asCallback(fn);
    }
  }


  return Neo4jStore;
};