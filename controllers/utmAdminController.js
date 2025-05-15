const http = require('../services/http/strapiClient')
const { STATUS_CODE } = require('../const/http')

exports.getUTMStatistics = async (req, res) => {
  try {
    const response = await http.get('/utm?fields=Statistics')
    return res.json(response.data.data.Statistics)
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error?.message ?? 'Strapi error' })
  }
}
