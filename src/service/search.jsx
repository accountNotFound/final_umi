import { http } from './common'

export async function getAbsQueries(data) {
  return http({
    url: '/api/abs_queries',
    data: data,
    method: 'post',
  });
}

export async function getTreeDoc(sourceType, id) {
  return http({
    url: `/api/tree_doc?src_type=${sourceType}&&id=${id}`,
    method: 'get'
  });
}