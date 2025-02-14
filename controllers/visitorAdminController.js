const FormData = require('form-data')
const fs = require('fs')
const http = require('../services/http/strapiClient')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')

exports.getVisitorItems = async (req, res) => {
  try {
    const response = await http.get('/visitors', { params: { populate: '*' } })
    res.json(response.data)
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.createVisitorItem = async (req, res) => {
  try {
    const data = { data: JSON.parse(req.body.data) }
    const response = await http.post('/visitors', data)
    res.json(response.data)
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.updateVisitorItem = async (req, res) => {
  try {
    const data = { data: JSON.parse(req.body.data) }
    const response = await http.put(`/visitors/${req.params.id}`, data)
    res.json(response.data)
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.deleteVisitorItem = async (req, res) => {
  try {
    const response = await http.delete(`/visitors/${req.params.id}`)
    res.json({})
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}
