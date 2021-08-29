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
  })
}