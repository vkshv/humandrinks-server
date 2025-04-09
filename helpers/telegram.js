const crypto = require('crypto')
const { BOT_TOKEN } = require('../config/config')

const verifyTelegramAuth = function(data) {
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
  const params = new URLSearchParams(data)
  const hash = params.get('hash')
  params.delete('hash')

  const sortedParams = [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n')

  const computedHash = crypto.createHmac('sha256', secretKey).update(sortedParams).digest('hex')

  return computedHash === hash
}

module.exports = {
  verifyTelegramAuth
}
