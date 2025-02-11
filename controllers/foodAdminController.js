const http = require('../services/http/strapiClient')
const { STATUS_CODE, STATUS_TEXT } = require('../const/http')

exports.getFoodItems = async (req, res) => {
  try {
    const response = await http.get('/foods')
    res.json(response.data)
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.createFoodItems = async (req, res) => {
  try {
    const response = await http.post('/foods', { data: req.body })
    res.json(response.data)
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.updateFoodItems = async (req, res) => {
  try {
    const response = await http.put(`/foods/${req.params.id}`, { data: req.body })
    res.json(response.data)
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}

exports.deleteFoodItems = async (req, res) => {
  try {
    const response = await http.delete(`/foods/${req.params.id}`)
    res.json({})
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}
