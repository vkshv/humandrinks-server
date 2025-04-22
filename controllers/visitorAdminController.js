const FormData = require('form-data')
const fs = require('fs')
const http = require('../services/http/strapiClient')
const axios = require('axios')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')
const { BOT_TOKEN } = require('../config/config')

exports.getVisitorItems = async (req, res) => {
  try {
    const response = await http.get('/visitors', { params: { populate: '*' } })
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.createVisitorItem = async (req, res) => {
  try {
    const data = { data: JSON.parse(req.body.data) }
    const response = await http.post('/visitors', data)
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.updateVisitorItem = async (req, res) => {
  try {
    const data = { data: JSON.parse(req.body.data) }
    const response = await http.put(`/visitors/${req.params.id}`, data)
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.deleteVisitorItem = async (req, res) => {
  try {
    const response = await http.delete(`/visitors/${req.params.id}`)
    return res.json({})
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.sendMessage = async (req, res) => {
  const delay = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  const unsuccessfulChatIds = []

  const chatIds = req.body.chatIds
  const text = req.body.text
  if (!Array.isArray(chatIds) || !text) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
  }
  for (const chatId of chatIds) {
    try {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text
      })
    } catch (error) {
      unsuccessfulChatIds.push(chatId)
    }
    await delay(25)
  }
  return res.json({
    fullSuccess: unsuccessfulChatIds.length === 0,
    unsuccessfulChatIds
  })
}
