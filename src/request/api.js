import axios from 'axios'
import {baseURL} from '../util/constant'

axios.defaults.baseURL = baseURL;

export default axios