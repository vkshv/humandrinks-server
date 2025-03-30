const axios = require('axios')
const { ADDRESS_SUGGESTION_API_ID } = require('../../config/config')

const axiosInstance = axios.create({
  baseURL: 'http://suggestions.dadata.ru',
  headers: {
    'Authorization': `Token ${ADDRESS_SUGGESTION_API_ID}`
  }
})

module.exports = axiosInstance
