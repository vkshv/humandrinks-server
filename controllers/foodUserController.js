const axios = require('../services/http/strapiClient')

exports.getFoodItems = async (req, res) => {
  try {
    const response = await axios.get('/menu-items')
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении меню' })
  }
}
