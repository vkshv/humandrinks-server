const http = require('../services/http/strapiClient')
const { STATUS_CODE } = require('../const/http')

exports.getFoodItems = async (req, res) => {
  try {
    const response = await http.get('/foods', { params: { populate: '*' } })
    return res.json(response.data.data.map((e) => {
      const { createdAt, updatedAt, publishedAt, picture, category, food_subcategory, ...data } = e
      return {
        ...data,
        picture: picture?.url,
        category: category?.name,
        subcategory: food_subcategory?.name ?? null
      }
    }))
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Упс! Список еды не загрузился.' })
  }
}

exports.getFoodCategories = async (req, res) => {
  try {
    const response = await http.get('/food-categories', { params: { populate: '*' } })
    return res.json(response.data.data.map((e) => ({ name: e.name, subcategories: e.food_subcategories.map((s) => s.name) })))
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Упс! Категории еды не загрузились.' })
  }
}

exports.getDrinkItems = async (req, res) => {
  try {
    const response = await http.get('/drinks', { params: { populate: '*' } })
    return res.json(response.data.data.map((e) => {
      const { createdAt, updatedAt, publishedAt, picture, category, drink_subcategory, ...data } = e
      return {
        ...data,
        picture: picture?.url,
        category: category?.name,
        subcategory: drink_subcategory?.name ?? null
      }
    }))
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Упс! Список напитков не загрузился.' })
  }
}

exports.getDrinkCategories = async (req, res) => {
  try {
    const response = await http.get('/drink-categories', { params: { populate: '*' } })
    return res.json(response.data.data.map((e) => ({ name: e.name, subcategories: e.drink_subcategories.map((s) => s.name) })))
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Упс! Категории напитков не загрузились.' })
  }
}

exports.getEventItems = async (req, res) => {
  try {
    const response = await http.get('/events', { params: { populate: '*' } })
    return res.json(response.data.data.map((e) => {
      const { createdAt, updatedAt, publishedAt, picture, category, ...data } = e
      return {
        ...data,
        picture: picture?.url,
        category: category?.name
      }
    }))
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Упс! Список ивентов не загрузился.' })
  }
}

exports.getEventCategories = async (req, res) => {
  try {
    const response = await http.get('/event-categories')
    return res.json(response.data.data.map((e) => e.name))
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Упс! Категории ивентов не загрузились.' })
  }
}

exports.getMerchItems = async (req, res) => {
  try {
    const response = await http.get('/merches', { params: { populate: '*' } })
    return res.json(response.data.data.map((e) => {
      const { createdAt, updatedAt, publishedAt, picture, ...data } = e
      return {
        ...data,
        picture: picture?.url
      }
    }))
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Упс! Список мерча не загрузился.' })
  }
}

exports.getWhatsnewItems = async (req, res) => {
  try {
    const response = await http.get('/whats-news')
    return res.json(response.data.data.map((e) => ({
      documentId: e.documentId,
      title: e.title,
      text: e.text,
      date: e.date
    })))
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Упс! Категории еды не загрузились.' })
  }
}
