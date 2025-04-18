const FormData = require('form-data')
const fs = require('fs')
const http = require('../services/http/strapiClient')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')

exports.getMerchItems = async (req, res) => {
  try {
    const response = await http.get('/merches', { params: { populate: '*' } })
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.createMerchItem = async (req, res) => {
  try {
    if (req.files?.length) {
      const formData = new FormData()
      formData.append('ref', 'merchs')
      formData.append('field', 'picture')
      formData.append('files', fs.createReadStream(req.files[0].path), req.files[0].originalname)
      const responseUpload = await http.post('/upload', formData)
      fs.unlinkSync(req.files[0].path)

      const data = { data: {
        ...JSON.parse(req.body.data),
        picture: responseUpload.data[0].id
      } }
      const response = await http.post('/merches', data)
      return res.json(response.data)
    } else {
      const data = { data: JSON.parse(req.body.data) }
      const response = await http.post('/merches', data)
      return res.json(response.data)
    }
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.updateMerchItem = async (req, res) => {
  try {
    if (req.files?.length) {
      const formData = new FormData()
      formData.append('ref', 'merchs')
      formData.append('refId', req.params.id)
      formData.append('field', 'picture')
      formData.append('files', fs.createReadStream(req.files[0].path), req.files[0].originalname)
      const responseUpload = await http.post('/upload', formData)
      fs.unlinkSync(req.files[0].path)

      const data = { data: {
        ...JSON.parse(req.body.data),
        picture: responseUpload.data[0].id
      } }
      const response = await http.put(`/merches/${req.params.id}`, data)
      return res.json(response.data)
    } else {
      const data = { data: JSON.parse(req.body.data) }
      const response = await http.put(`/merches/${req.params.id}`, data)
      return res.json(response.data)
    }
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.deleteMerchItem = async (req, res) => {
  try {
    const response = await http.delete(`/merches/${req.params.id}`)
    return res.json({})
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.swapSortWeight = async (req, res) => {
  try {
    const response = await http.post('/merchs/swap-sort-weight', req.body)
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.moveSortWeightOnTop = async (req, res) => {
  try {
    const response = await http.post(`merchs/${req.params.id}/promote-sort-weight`)
    return res.json(response.data)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}
