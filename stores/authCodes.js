const codes = {}

const setCode = function(phone, code) {
  codes[phone] = code
  setTimeout(() => {
    delete codes[phone]
  }, 10 * 60 * 1000) // 10 min
}

const getCode = function(phone) {
  return codes[phone]
}

module.exports = {
  setCode,
  getCode
}
