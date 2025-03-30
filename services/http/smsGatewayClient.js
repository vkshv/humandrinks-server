const axios = require('axios')
const { SMS_GATEWAY_API_ID } = require('../../config/config')

const axiosInstance = axios.create({
  baseURL: 'https://sms.ru',
  params: {
    api_id: SMS_GATEWAY_API_ID
  }
})

module.exports = axiosInstance
