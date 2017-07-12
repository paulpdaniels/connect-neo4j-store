# connect-neo4j-store
A Neo4j store middleware adapter

[![CircleCI](https://img.shields.io/circleci/project/github/paulpdaniels/connect-neo4j-store.svg)](https://github.com/paulpdaniels/connect-neo4j-store)
[![Codecov](https://img.shields.io/codecov/c/github/paulpdaniels/connect-neo4j-store.svg)](https://github.com/paulpdaniels/connect-neo4j-store)

A simple neo4j based store adapter for sessions.

### Warning: Experimental (You have been warned)

Currently I only have very primitive support for sessions, there is no way through this library to link a session to any other nodes or create external relationships. However, this should support the minimum API for a connect session `Store`.

Again proceed at your own risk.


### Usage

```javascript
const session = require('express-session');
const Neo4jStore = require('connect-neo4j-store')(session);


app.use(session({
  secret: 'foo',
  store: new Neo4jStore(options)
})


```

#### Connection to a Neo4jDB

**Through a url**

```javascript

const store = new Neo4jStore('http://username:password@localhost:7474');
// Or with an object bag
const store = new Neo4jStore({url: 'http://username:password@localhost:7474'});

```

**Reuse and existing client**

```javascript
const db = new neo4j.GraphDatabase(url)
const store = new Neo4jStore({client: db});

```
