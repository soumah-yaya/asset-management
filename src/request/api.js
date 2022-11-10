import axios from 'axios'
import {baseURL} from '../util/constant'

axios.defaults.baseURL = baseURL;
axios.interceptors.request.use((config)=>{
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})
export default axios