const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { STATUS_CODE, STATUS_TEXT } = require('./const/http')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/admin/auth', require('./routes/authAdminRoutes'))
app.use('/api/admin/food', require('./routes/foodAdminRoutes'))

app.use((req, res) => {
  res.status(STATUS_CODE.NOT_FOUND).json({ message: STATUS_TEXT[STATUS_CODE.NOT_FOUND] })
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
