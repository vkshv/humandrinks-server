const codes = []

const setCode = function(phone, code) {
  codes.push({
    phone,
    code,
    canBeResent: false
  })
  setTimeout(() => {
    const i = codes.findIndex(e => e.phone === phone)
    if (i !== -1) codes.splice(i, 1)
  }, 60 * 60 * 1000) // 1 hour
  setTimeout(() => {
    const code = codes.find(e => e.phone === phone)
    if (code) code.canBeResent = true
  }, 60 * 1000) // 1 min
}

const getCode = function(phone) {
  return codes.find(e => e.phone === phone)
}

module.exports = {
  setCode,
  getCode
}
