/**
 * Created by paulp on 7/11/2017.
 */

const session = require('express-session');
const Neo4jStore = require('../')(session);

test('create get session query', () => {

  const client = {
    cypher: jest.fn((query, cb) => cb(null, {'u.session': '123'}))
  };

  const store = new Neo4jStore({client});

  return store.get('abc', () => {})
    .then(() => {

      expect(client.cypher.mock.calls[0][0])
        .toEqual({
          params: {sid: 'abc'},
          query: 'MATCH (s:Session {id: {sid}})\nRETURN s\nLIMIT 1'
        });

    });
});

test('create set session query', () => {

  const client = {
    cypher: jest.fn((query, cb) => cb(null, {}))
  };

  const store = new Neo4jStore({client});

  return store.set('abc', {id: '123'}, () => {})
    .then(() => {
      expect(client.cypher.mock.calls[0][0])
        .toEqual({
          params: {sid: 'abc', session: "{\"id\":\"123\"}", ttl: 86400},
          query: 'MERGE (s:Session {id: {sid}, session: {session} , ttl: {ttl}})'
        });
    });
});

test('create destroy session query', () => {
  const client = {
    cypher: jest.fn((query, cb) => cb(null, {}))
  };

  const store = new Neo4jStore({client});

  return store.destroy('abc', () => {})
    .then(() => {
      expect(client.cypher.mock.calls[0][0])
        .toEqual({
          params: {sid: 'abc'},
          query: 'MATCH (s:Session {id: {sid}})\nDETACH DELETE s'
        });
    });

});

test('create touch session query', () => {
  const client = {
    cypher: jest.fn((query, cb) => cb(null, {}))
  };

  const store = new Neo4jStore({client});

  return store.touch('abc', {id: '123'}, () => {})
    .then(() => {
      expect(client.cypher.mock.calls[0][0])
        .toEqual({
          params: {sid: 'abc', ttl: 86400},
          query: 'MATCH (s:Session {id: {sid}})\nSET s.ttl = {ttl}\nRETURN s\nLIMIT 1'
        });

    });
});

test('create id session query', () => {
  const client = {
    cypher: jest.fn((query, cb) => cb(null, []))
  };

  const store = new Neo4jStore({client});

  return store.ids('abc', {id: '123'}, () => {})
    .then(() => {
      expect(client.cypher.mock.calls[0][0])
        .toEqual({
          query: 'MATCH (s:Session)\nRETURN s.id'
        });

    });
});

test('create all session query', () => {
  const client = {
    cypher: jest.fn((query, cb) => cb(null, []))
  };

  const store = new Neo4jStore({client});

  return store.all('abc', {id: '123'}, () => {})
    .then(() => {
      expect(client.cypher.mock.calls[0][0])
        .toEqual({
          query: 'MATCH (s:Session)\nRETURN s.id, s.session'
        });

    });
});