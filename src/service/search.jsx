import { http } from './common'

export async function postAbsQueries(data) {
  return http({
    url: '/api/abs_queries',
    data: data,
    method: 'post',
  });
}

export async function getTreeDoc(sourceType, prefix) {
  return http({
    url: `/api/tree_doc?src_type=${sourceType}&&prefix=${prefix}`,
    method: 'get'
  });
}