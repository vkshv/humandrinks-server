const axios = require('axios')
const xlsx = require('xlsx')
const { JOWI_WEB_URL, JOWI_RESTAURANT_ID, JOWI_USER_EMAIL, JOWI_USER_PASSWORD, BOT_TOKEN, TELEGRAM_CHAT_ID } = require('../../config/config')
const { Telegraf } = require('telegraf')
const FormData = require('form-data')
const puppeteer = require('puppeteer')

const signIn = async function() {
  let browser = null
  let page = null
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    page = await browser.newPage()

    const response = await page.goto(JOWI_WEB_URL + '/ru/users/sign_in', { waitUntil: 'networkidle2' })
    if (response.status() === 302) return { browser, page }

    await page.type('#user_email', JOWI_USER_EMAIL)
    await page.type('#user_password', JOWI_USER_PASSWORD)
    await Promise.all([
      page.click('.form_submit button'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ])
    return { browser, page }
  } catch (error) {
    // try { page.close() } catch (error) {}
    try { browser.close() } catch (error) {}
    return null
  }
}

const sendJowiAlert = async function(message) {
  try {
    const bot = new Telegraf(BOT_TOKEN)
    await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message)
  } catch (error) {}
}

const formatUser = function(user) {
  return `@${user.username}\n${user.name} ${user.patronymic} ${user.surname}\n${user.birth}\n${user.phone}\n${user.address}`
}

const registerUserInJowi = async function(user) {
  const pup = await signIn()
  if (!pup || !pup.browser || !pup.page) {
    await sendJowiAlert(`Не удалась автоматическая регистрация в Jowi\n${formatUser(user)}\nERR101`)
    return
  }
  const cookies = await pup.page.cookies()
  if (!cookies) {
    await sendJowiAlert(`Не удалась автоматическая регистрация в Jowi\n${formatUser(user)}\nERR102`)
    return
  }
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')
  const csrfToken = await pup.page.$eval('meta[name="csrf-token"]', element => element.content)

  // try { pup.page.close() } catch (error) {}
  try { pup.browser.close() } catch (error) {}

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
  form.append('client[client_cards_attributes][0][card_code]', '')
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

module.exports = {
  registerUserInJowi
}
