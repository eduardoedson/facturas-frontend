import axios from 'axios'
const Backend = axios.create({ baseURL: 'https://facturas-backend.herokuapp.com' })
export default Backend