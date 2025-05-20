const encodeBase64ForUrl = function(str, salt) {
  const combined = salt + str
  const base64 = Buffer.from(combined).toString('base64')
  return encodeURIComponent(base64)
}

const decodeBase64ForUrl = function(encoded, salt) {
  const base64 = decodeURIComponent(encoded)
  const decoded = Buffer.from(base64, 'base64').toString()
  if (!decoded.startsWith(salt)) {
    throw new Error('Invalid salt')
  }
  return decoded.slice(salt.length)
}

module.exports = {
  encodeBase64ForUrl,
  decodeBase64ForUrl
}
