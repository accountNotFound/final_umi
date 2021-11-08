import { http } from './common';

export async function getTopRefs(k) {
  return http({
    url: `/api/top_refs?k=${k}`,
    method: 'get',
  });
}

export async function postGraphQueries(data) {
  return http({
    url: `/api/graph_queries`,
    data,
    method: 'post',
  });
}

export async function getCenterQueries(node_id) {
  return http({
    url: `/api/center_queries?node_id=${node_id}`,
    method: 'get',
  });
}

export async function postCypherQueries(data) {
  return http({
    url: `/api/cypher_queries`,
    data,
    method: 'post',
  });
}