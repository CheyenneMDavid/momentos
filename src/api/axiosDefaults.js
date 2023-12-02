import axios from 'axios';

axios.defaults.baseURL = 'https://drf---api-65413badfaf5.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;
