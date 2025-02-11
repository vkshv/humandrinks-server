const axios = require('axios')
const { STRAPI_API_URL, STRAPI_API_TOKEN } = require('../../config/config')

const axiosInstance = axios.create({
  baseURL: STRAPI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `bearer ${STRAPI_API_TOKEN}`
  }
})

module.exports = axiosInstance
