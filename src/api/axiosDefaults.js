import axios from 'axios';

axios.defaults.baseURL = 'https://drf---api-65413badfaf5.herokuapp.com';
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
