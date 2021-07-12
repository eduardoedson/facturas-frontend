import axios from 'axios'
const Backend = axios.create({ baseURL: 'http://127.0.0.1:3333' })
// const Backend = axios.create({ baseURL: 'https://facturas-backend.herokuapp.com' })
export default Backend