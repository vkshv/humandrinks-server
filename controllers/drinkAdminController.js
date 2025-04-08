const FormData = require('form-data')
const fs = require('fs')
const http = require('../services/http/strapiClient')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')

exports.getDrinkItems = async (req, res) => {
  try {
    const response = await http.get('/drinks', { params: { populate: '*' } })
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.createDrinkItem = async (req, res) => {
  try {
    if (req.files?.length) {
      const formData = new FormData()
      formData.append('ref', 'drinks')
      formData.append('field', 'picture')
      formData.append('files', fs.createReadStream(req.files[0].path), req.files[0].originalname)
      const responseUpload = await http.post('/upload', formData)
      fs.unlinkSync(req.files[0].path)

      const data = { data: {
        ...JSON.parse(req.body.data),
        picture: responseUpload.data[0].id
      } }
      const response = await http.post('/drinks', data)
      return res.json(response.data)
    } else {
      const data = { data: JSON.parse(req.body.data) }
      const response = await http.post('/drinks', data)
      return res.json(response.data)
    }
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.updateDrinkItem = async (req, res) => {
  try {
    if (req.files?.length) {
      const formData = new FormData()
      formData.append('ref', 'drinks')
      formData.append('refId', req.params.id)
      formData.append('field', 'picture')
      formData.append('files', fs.createReadStream(req.files[0].path), req.files[0].originalname)
      const responseUpload = await http.post('/upload', formData)
      fs.unlinkSync(req.files[0].path)

      const data = { data: {
        ...JSON.parse(req.body.data),
        picture: responseUpload.data[0].id
      } }
      const response = await http.put(`/drinks/${req.params.id}`, data)
      return res.json(response.data)
    } else {
      const data = { data: JSON.parse(req.body.data) }
      const response = await http.put(`/drinks/${req.params.id}`, data)
      return res.json(response.data)
    }
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.deleteDrinkItem = async (req, res) => {
  try {
    const response = await http.delete(`/drinks/${req.params.id}`)
    return res.json({})
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.getDrinkCategories = async (req, res) => {
  try {
    const response = await http.get('/drink-categories')
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.getDrinkSubcategories = async (req, res) => {
  try {
    const response = await http.get('/drink-subcategories', { params: { populate: 'drink_category' } })
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.swapSortWeight = async (req, res) => {
  try {
    const response = await http.post('/drinks/swap-sort-weight', req.body)
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.moveSortWeightOnTop = async (req, res) => {
  try {
    const response = await http.post(`drinks/${req.params.id}/promote-sort-weight`)
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}
