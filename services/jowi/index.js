const axios = require('axios')
// const xlsx = require('xlsx')
const cheerio = require('cheerio')
const { decode: decodeHtml } = require('html-entities')
const { JOWI_WEB_URL, JOWI_RESTAURANT_ID, JOWI_USER_EMAIL, JOWI_USER_PASSWORD, BOT_TOKEN, TELEGRAM_ERROR_LOG_CHAT_ID } = require('../../config/config')
const { Telegraf } = require('telegraf')
const FormData = require('form-data')
const BrowserManager = require('../http/browserManager')
const strapiClient = require('../http/strapiClient')

// const signIn = async function() {
//   let browser = null
//   let page = null
//   try {
//     browser = await BrowserManager.getBrowser()
//     page = await browser.newPage()

//     const response = await page.goto(JOWI_WEB_URL + '/ru/users/sign_in', { waitUntil: 'networkidle2' })
//     if (response.status() === 302) return { browser, page }

//     await page.type('#user_email', JOWI_USER_EMAIL)
//     await page.type('#user_password', JOWI_USER_PASSWORD)
//     await Promise.all([
//       page.click('.form_submit button'),
//       page.waitForNavigation({ waitUntil: 'networkidle2' })
//     ])
//     return { browser, page }
//   } catch (error) {
//     try { page.close() } catch (error) {}
//     // try { browser.close() } catch (error) {}
//     return null
//   }
// }

const sendJowiAlert = async function(message) {
  try {
    const bot = new Telegraf(BOT_TOKEN)
    await bot.telegram.sendMessage(TELEGRAM_ERROR_LOG_CHAT_ID, message)
  } catch (error) {}
}

const formatUser = function(user) {
  return `@${user.username}\n${user.name} ${user.patronymic} ${user.surname}\n${user.birth}\n${user.phone}\n${user.address}`
}

const registerUserInJowi = async function(user) {
  // const pup = await signIn()
  // if (!pup || !pup.browser || !pup.page) {
  //   await sendJowiAlert(`Не удалась автоматическая регистрация в Jowi\n${formatUser(user)}\nERR101`)
  //   return
  // }
  // const cookies = await pup.page.cookies()
  // if (!cookies) {
  //   await sendJowiAlert(`Не удалась автоматическая регистрация в Jowi\n${formatUser(user)}\nERR102`)
  //   return
  // }
  const cookieHeader = BrowserManager.getCookieHeader()
  const csrfToken = BrowserManager.getCsrfToken()

  // try { pup.page.close() } catch (error) {}
  // try { pup.browser.close() } catch (error) {}

  const form = new FormData()

  form.append('utf8', '✓')
  form.append('authenticity_token', csrfToken)
  form.append('client[phone]', user.phone)
  form.append('client[email]', '')
  form.append('client[birthday]', user.birth.replace(/\./g, '-'))
  form.append('client[first_name]', user.name)
  form.append('client[last_name]', user.surname)
  form.append('client[sex]', 'true')
  form.append('client[client_restaurants_attributes][0][restaurant_id]', JOWI_RESTAURANT_ID)
  form.append('client[client_cards_attributes][0][restaurant_id]', JOWI_RESTAURANT_ID)
  form.append('client[client_cards_attributes][0][from_restaurant_id]', JOWI_RESTAURANT_ID)
  form.append('client[client_cards_attributes][0][card_code]', user.cardNumber ?? '')
  form.append('client[client_cards_attributes][0][card_number]', '')
  form.append('client[client_cards_attributes][0][discount]', '0')
  form.append('client[client_cards_attributes][0][accumulation_account]', '0')
  form.append('client[client_addresses_attributes][0][address]', user.address)
  form.append('client[client_addresses_attributes][0][restaurant_id]', JOWI_RESTAURANT_ID)
  form.append('client[client_important_dates_attributes][0][date]', '01-01-2025')
  form.append('client[client_important_dates_attributes][0][description]', '')
  form.append('client[client_important_dates_attributes][0][restaurant_id]', JOWI_RESTAURANT_ID)

  try {
    const response = await axios.post(`${JOWI_WEB_URL}/ru/restaurants/${JOWI_RESTAURANT_ID}/clients`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-CSRF-Token': csrfToken,
        Cookie: cookieHeader,
        Origin: JOWI_WEB_URL,
        Referer: `${JOWI_WEB_URL}/ru/restaurants/${JOWI_RESTAURANT_ID}/clients/new`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    return true
  } catch (error) {
    await sendJowiAlert(`Не удалась автоматическая регистрация в Jowi\n${formatUser(user)}\nERR103`)
  }
}

// const syncVisitors = async function() {
//   const pup = await signIn()
//   if (!pup || !pup.browser || !pup.page) {
//     await sendJowiAlert(`Не удалась автоматическая регистрация в Jowi\n${formatUser(user)}\nERR101`)
//     return
//   }
//   const cookies = await pup.page.cookies()
//   if (!cookies) {
//     await sendJowiAlert(`Не удалась автоматическая регистрация в Jowi\n${formatUser(user)}\nERR102`)
//     return
//   }
//   const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')






//   let response
//   try {
//     response = await axios.get(`${JOWI_WEB_URL}/ru/restaurants/${JOWI_RESTAURANT_ID}/clients/export_to_excel`, {
//       headers: { Cookie: cookieHeader },
//       responseType: 'arraybuffer'
//     })
//   } catch (error) {
//     return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Jowi xlsx download error' })
//   }
//   let data
//   try {
//     const workbook = xlsx.read(responseVisitors.data, { type: 'buffer' })
//     const sheetName = workbook.SheetNames[0]
//     data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])
//   } catch (error) {
//   }
// }

function universal_decode(rawStr) {
  if (!rawStr || typeof rawStr !== 'string') return '';

  let jsUnescaped = rawStr
    .replace(/\\\\/g, '\\')    // двойной слэш \\ → \
    .replace(/\\n/g, '\n')     // перенос строки
    .replace(/\\r/g, '\r')     // возврат каретки
    .replace(/\\t/g, '\t')     // табуляция
    .replace(/\\"/g, '"')      // кавычка
    .replace(/\\'/g, "'")      // апостроф
    .replace(/\\\//g, '/');    // слэш

  return decodeHtml(jsUnescaped);
}

// Разработчику стыдно за этот монструозный метод, но по-другому у него не получилось :-(
const syncVisitor = async function(user) {
  // const pup = await signIn()
  // if (!pup || !pup.browser || !pup.page) {
  //   // await sendJowiAlert(`Приложение пользователя не синхронизировалось с Jowi\n${formatUser(user)}\nERR201`)
  //   return
  // }
  // const cookies = await pup.page.cookies()
  // if (!cookies) {
  //   await sendJowiAlert(`Приложение пользователя не синхронизировалось с Jowi\n${formatUser(user)}\nERR202`)
  //   return
  // }
  // const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')
  // const csrfToken = await pup.page.$eval('meta[name="csrf-token"]', element => element.content)

  // try { pup.page.close() } catch (error) {}
  const cookieHeader = BrowserManager.getCookieHeader()
  const csrfToken = BrowserManager.getCsrfToken()

  try {
    const responseJowiAutocomplete = await axios.get(`${JOWI_WEB_URL}/ru/restaurants/${JOWI_RESTAURANT_ID}/clients_autocomplete`, {
      params: {
        type: 'search_by_phone_number',
        format: 'json',
        title: user.phone.slice(1)
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-CSRF-Token': csrfToken,
        Cookie: cookieHeader,
        // Origin: JOWI_WEB_URL,
        Referer: `${JOWI_WEB_URL}/ru/restaurants/${JOWI_RESTAURANT_ID}/clients`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    if (responseJowiAutocomplete.data.clients.length === 0) {
      await registerUserInJowi(user)
      return
    }
    if (responseJowiAutocomplete.data.clients.length > 1) {
      // Это условие не должно быть true: Jowi не позволяет создавать пользователей с одинаковым телефоном
      await sendJowiAlert(`При синхронизации с Jowi обнаружено более одного пользователя с таким телефоном\n${formatUser(user)}\nERR203`)
    }
    const responseJowiClient = await axios.get(`${JOWI_WEB_URL}/ru/restaurants/${JOWI_RESTAURANT_ID}/clients/${responseJowiAutocomplete.data.clients[0].id}`, {
      params: {
        format: 'js',
        from_restaurants_ids: ''
      },
      headers: {
        // 'Content-Type': 'application/json; charset=utf-8',
        'X-CSRF-Token': csrfToken,
        Cookie: cookieHeader,
        // Origin: JOWI_WEB_URL,
        Referer: `${JOWI_WEB_URL}/ru/restaurants/${JOWI_RESTAURANT_ID}/copy_courses`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    const htmlStart = responseJowiClient.data.indexOf('<table class=')
    const htmlEnd = responseJowiClient.data.indexOf('<\\/table>') + 9
    const cleanHtml = responseJowiClient.data.slice(htmlStart, htmlEnd)

    const $ = cheerio.load(universal_decode(cleanHtml))
    const secondRow = $('table.data_table.details_table tr').eq(1)
    const cardNumber = secondRow.find('td').eq(2).text()
    const bonus_dirty = secondRow.find('td').eq(6).text()
    const bonus = parseInt(bonus_dirty.replace(/\s/g, ''), 10)

    if (`${cardNumber}` !== `${user.cardNumber}` || `${bonus}` !== `${user.bonus}`) {
      await strapiClient.put(`/visitors/${user.documentId}`, { data: { cardNumber, bonus } })
      return { cardNumber, bonus }
    }
  } catch (error) {
    await sendJowiAlert(`Приложение пользователя не синхронизировалось с Jowi\n${formatUser(user)}\nERR203`)
  }
}

module.exports = {
  registerUserInJowi,
  syncVisitor
}
