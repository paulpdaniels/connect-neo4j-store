/**
 * Created by paulp on 7/9/2017.
 */

const destroy = (sid) => ({
  query: [
    'MATCH (s:Session {id: {sid}})',
    'DETACH DELETE s'
  ].join('\n'),
  params: {
    sid
  }
});

const get = (sid) => ({
  query: [
    'MATCH (s:Session {id: {sid}})',
    'RETURN s.session',
    'LIMIT 1'
  ].join('\n'),
  params: {
    sid
  }
});

const set = (sid, session, ttl) => ({
  query: [
    `MERGE (s:Session {id: {sid}, session: {session} ${ttl ? ', ttl: {ttl}' : ''}})`
  ].join('\n'),
  params: {
    sid,
    session,
    ttl
  }
});

const touch = (sid, ttl) => ({
  query: [
    'MATCH (s:Session {id: {sid}})',
    'SET s.ttl = {ttl}',
    'RETURN s',
    'LIMIT 1'
  ].join('\n'),
  params: {
    sid,
    ttl
  }
});

const ids = () => ({
  query: [
    'MATCH (s:Session)',
    'RETURN s.id'
  ].join('\n')
});

const all = () => ({
  query: [
    'MATCH (s:Session)',
    'RETURN s.id, s.session'
  ].join('\n')
});

module.exports = {
  destroy,
  get,
  set,
  touch,
  ids,
  all
};