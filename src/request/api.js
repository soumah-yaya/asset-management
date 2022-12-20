import axios from 'axios'
import {baseURL} from '../util/constant'
import NProgress from 'nprogress'

axios.defaults.baseURL = baseURL;
axios.interceptors.request.use((config)=>{
    NProgress.start()
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})
axios.interceptors.response.use((config)=>{
    NProgress.done()
    return config
})
export default axios