const jwt = require('jsonwebtoken')
const { JWT_ADMIN_SECRET } = require('../config/config')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')
const http = require('../services/http/strapiClient')

exports.signIn = async (req, res) => {
  try {
    const response = await http.get('/admins')
    const { username, password } = req.body
    
    const admin = response.data.data.find(u => u.username === username && u.password === password)
    if (!admin) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_TEXT[STATUS_CODE.NOT_FOUND] }) // 404 for security
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_ADMIN_SECRET, { expiresIn: '8h' })
    res.json({ token, id: admin.id, username: admin.username })
  } catch (error) {
    return res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_TEXT[STATUS_CODE.NOT_FOUND] }) // 404 for security
  }
}
