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
  const unsuccessfulChatIds = []

  const chatIds = req.body.chatIds
  const text = req.body.text
  const reply_markup = req.body.reply_markup
  if (!Array.isArray(chatIds) || !text) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
  }

  const sendToChat = async (chatId) => {
    try {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text,
        reply_markup
      })
    } catch (error) {
      unsuccessfulChatIds.push(chatId)
    }
  }

  const batchSize = 50
  for (let i = 0; i < chatIds.length; i += batchSize) {
    const batch = chatIds.slice(i, i + batchSize)
    await Promise.all(batch.map(sendToChat))
    await new Promise(resolve => setTimeout(resolve, 25))
  }

  return res.json({
    fullSuccess: unsuccessfulChatIds.length === 0,
    unsuccessfulChatIds
  })
}

exports.sendPhoto = async (req, res) => {
  const unsuccessfulChatIds = []
  let bodyData = null

  try {
    bodyData = JSON.parse(req.body.data)

    if (!Array.isArray(bodyData.chatIds) || !bodyData.text) {
      throw new Error()
    }
  } catch (error) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })
  }


  const sendToChat = async (chatId) => {
    const form = new FormData()

    form.append('chat_id', chatId)
    form.append('caption', bodyData.text)
    if (req.files[0]) {
      form.append('photo', req.files[0].buffer, req.files[0].originalname)
    }
    form.append('reply_markup', JSON.stringify(bodyData.reply_markup))

    try {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form)
    } catch (error) {
      unsuccessfulChatIds.push(chatId)
    }
  }

  const batchSize = 50
  for (let i = 0; i < bodyData.chatIds.length; i += batchSize) {
    const batch = bodyData.chatIds.slice(i, i + batchSize)
    await Promise.all(batch.map(sendToChat))
    await new Promise(resolve => setTimeout(resolve, 25))
  }

  return res.json({
    fullSuccess: unsuccessfulChatIds.length === 0,
    unsuccessfulChatIds
  })
}
