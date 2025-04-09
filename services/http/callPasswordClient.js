const axios = require('axios')
const { CALL_PASSWORD_API_ID } = require('../../config/config')

const axiosInstance = axios.create({
  baseURL: 'https://api3.greensms.ru',
  headers: {
    'Authorization': `Bearer ${CALL_PASSWORD_API_ID}`
  }
})

module.exports = axiosInstance
