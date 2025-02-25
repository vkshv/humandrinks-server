const axios = require('../services/http/strapiClient')

exports.getFoodItems = async (req, res) => {
  try {
    const response = await axios.get('/menu-items')
    return res.json(response.data)
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении меню' })
  }
}
