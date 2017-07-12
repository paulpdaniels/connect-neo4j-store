/**
 * Created by paulp on 7/11/2017.
 */

const neo4j = require('neo4j');
const P = require('bluebird');
const session = require('express-session');
const Neo4jStore = require('../')(session);

const url = 'http://neo4j:admin@localhost:7474';

let db;

beforeAll(() => {
  db = new neo4j.GraphDatabase(url);
});

test('defaults', () => {
  const store = new Neo4jStore(url);
  expect(store.ttl).toBeUndefined();
  expect(store.disableTTL).toBeUndefined();
  expect(store.client.url).toEqual(url);
});

test('user defined client', () => {
  const store = new Neo4jStore(db);
  expect(store.client.url).toBe(url);
});


