require('dotenv').config()

module.exports = {
  STRAPI_API_URL: process.env.STRAPI_API_URL,
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
  JWT_USER_SECRET: process.env.JWT_USER_SECRET,
  BOT_TOKEN: process.env.BOT_TOKEN
}
