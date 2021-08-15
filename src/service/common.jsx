import axios from 'axios'

export async function http(data) {
  const res = await axios(data);
  return res.data;
}