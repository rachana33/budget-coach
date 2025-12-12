import axios from 'axios';
var API_URL = import.meta.env.VITE_API_URL || '/api';
export var api = axios.create({
    baseURL: API_URL,
});
