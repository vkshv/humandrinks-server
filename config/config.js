require('dotenv').config()

module.exports = {
  STRAPI_API_URL: process.env.STRAPI_API_URL,
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
  JWT_USER_SECRET: process.env.JWT_USER_SECRET,
  JWT_USER_AUTH_SECRET: process.env.JWT_USER_AUTH_SECRET,
  BOT_TOKEN: process.env.BOT_TOKEN,
  SMS_GATEWAY_API_ID: process.env.SMS_GATEWAY_API_ID,
  CALL_PASSWORD_API_ID: process.env.CALL_PASSWORD_API_ID,
  ADDRESS_SUGGESTION_API_ID: process.env.ADDRESS_SUGGESTION_API_ID,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  TELEGRAM_ERROR_LOG_CHAT_ID: process.env.TELEGRAM_ERROR_LOG_CHAT_ID,
  JOWI_WEB_URL: process.env.JOWI_WEB_URL,
  JOWI_RESTAURANT_ID: process.env.JOWI_RESTAURANT_ID,
  JOWI_USER_EMAIL: process.env.JOWI_USER_EMAIL,
  JOWI_USER_PASSWORD: process.env.JOWI_USER_PASSWORD
}
