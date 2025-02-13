const FormData = require('form-data')
const fs = require('fs')
const http = require('../services/http/strapiClient')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')

exports.getFoodItems = async (req, res) => {
  try {
    const response = await http.get('/foods', { params: { populate: '*' } })
    res.json(response.data)
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.createFoodItem = async (req, res) => {
  try {
    if (req.files?.length) {
      const formData = new FormData()
      formData.append('ref', 'foods')
      formData.append('refId', req.params.id)
      formData.append('field', 'picture')
      formData.append('files', fs.createReadStream(req.files[0].path), req.files[0].originalname)
      const responseUpload = await http.post('/upload', formData)
      fs.unlinkSync(req.files[0].path)

      const data = { data: {
        ...JSON.parse(req.body.data),
        picture: responseUpload.data[0].id
      } }
      const response = await http.post('/foods', data)
      res.json(response.data)
    } else {
      const data = { data: JSON.parse(req.body.data) }
      const response = await http.post('/foods', data)
      res.json(response.data)
    }
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.updateFoodItem = async (req, res) => {
  try {
    if (req.files?.length) {
      const formData = new FormData()
      formData.append('ref', 'foods')
      formData.append('refId', req.params.id)
      formData.append('field', 'picture')
      formData.append('files', fs.createReadStream(req.files[0].path), req.files[0].originalname)
      const responseUpload = await http.post('/upload', formData)
      fs.unlinkSync(req.files[0].path)

      const data = { data: {
        ...JSON.parse(req.body.data),
        picture: responseUpload.data[0].id
      } }
      const response = await http.put(`/foods/${req.params.id}`, data)
      res.json(response.data)
    } else {
      const data = { data: JSON.parse(req.body.data) }
      const response = await http.put(`/foods/${req.params.id}`, data)
      res.json(response.data)
    }
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.deleteFoodItem = async (req, res) => {
  try {
    const response = await http.delete(`/foods/${req.params.id}`)
    res.json({})
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.getFoodCategories = async (req, res) => {
  try {
    const response = await http.get('/food-categories')
    res.json(response.data)
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}
