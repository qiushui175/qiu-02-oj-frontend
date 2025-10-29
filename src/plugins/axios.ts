import axios, {AxiosResponse } from 'axios'

// 定义响应数据类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8101";


// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)