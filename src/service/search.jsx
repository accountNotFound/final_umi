import { http } from './common'

export async function getAbsQueries(data) {
  return http({
    'url': '/api/abs_queries',
    'data': data,
    'method': 'post',
  });
}