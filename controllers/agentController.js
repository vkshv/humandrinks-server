const { STATUS_CODE, STATUS_TEXT } = require('../const/http')
const http = require('../services/http/strapiClient')
// const {  } = require('../services/jowi')

exports.activateReferralProgram = async (req, res) => {
  const isAdmin = req.user?.isAdmin
  if (!isAdmin) return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: STATUS_TEXT[STATUS_CODE.UNAUTHORIZED] })

  const referralTelegramId = req.body.referralTelegramId
  if (!+referralTelegramId) return res.status(STATUS_CODE.BAD_REQUEST).json({ message: STATUS_TEXT[STATUS_CODE.BAD_REQUEST] })

  let referralUser = null
  let referrerUser = null
  let referralProgram = null
  try {
    const response_referral = await http.get(`/visitors?filters[telegramId]=${referralTelegramId}`)
    if (!response_referral.data.data.length) return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Пользователь не найден' })

    referralUser = response_referral.data.data[0]
    if (!referralUser.referralProgram) return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Пользователь не является рефералом' })
    if (referralUser.referralProgram.activated === true) return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Реферальная программа уже активирована' })

    const response_referrer = await http.get(`/visitors?filters[telegramId]=${referralUser.referralProgram.referrerTelegramId}`)
    if (!response_referrer.data.data.length) return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Реферер пользователя не найден' })

    referrerUser = response_referrer.data.data[0]
    const response_program = await http.get(`/referral-programs?filters[slug]=${referralUser.referralProgram.programSlug}`)
    if (!response_program.data.data.length) return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Реферальная программа не найдена' })

    referralProgram = response_program.data.data[0]
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
  }

  // Пока что существует только один вид реф программы - defautl. В дальнейшем возможно 
  // существование различных реф программ с условиями, определенными в настройках и нужно будет
  // реализовать логику действий согласно настройкам

  try {
    const referral_data = {
      data: {
        referralProgram: {
          ...referralUser.referralProgram,
          activated: true
        }
      }
    }
    await http.put(`/visitors/${referralUser.documentId}`, referral_data)

    const referrer_data = {
      data: {
        bonus: (referrerUser.bonus ?? 0) + +referralProgram.referrer_bonus_value
      }
    }
    await http.put(`/visitors/${referrerUser.documentId}`, referrer_data)

    return res.json({})
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: STATUS_TEXT[STATUS_CODE.INTERNAL_SERVER_ERROR] })
  }
}
