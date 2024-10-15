import axios from 'axios'

const axiosConfig = axios.create({
  // baseURL: `http://localhost:3000/api`

  baseURL: `https://express-spp-api.sppapp.com/api`
})
export default axiosConfig
