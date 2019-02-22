import axios from 'axios'
import * as baseUrl from '../../static/js/baseUrl'

const ajx = axios.create({
  timeout: 1000 * 20,
  withCredentials: true,
  baseURL: baseUrl.baseUrl
})

ajx.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

ajx.interceptors.response.use(response => {
  return response.data ? response.data : response
}, error => {
  return Promise.reject(error)
})

export default ajx
