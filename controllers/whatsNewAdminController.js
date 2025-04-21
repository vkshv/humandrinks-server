const FormData = require('form-data')
const fs = require('fs')
const http = require('../services/http/strapiClient')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')

exports.getWhatsNewItems = async (req, res) => {
  try {
    const response = await http.get('/whats-news', { params: { populate: '*' } })
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.createWhatsNewItem = async (req, res) => {
  try {
    const data = { data: JSON.parse(req.body.data) }
    const response = await http.post('/whats-news', data)
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.updateWhatsNewItem = async (req, res) => {
  try {
    const data = { data: JSON.parse(req.body.data) }
    const response = await http.put(`/whats-news/${req.params.id}`, data)
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.deleteWhatsNewItem = async (req, res) => {
  try {
    const response = await http.delete(`/whats-news/${req.params.id}`)
    return res.json({})
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}
