const puppeteer = require('puppeteer')
const { JOWI_WEB_URL, JOWI_USER_EMAIL, JOWI_USER_PASSWORD } = require('../../config/config')

let browser = null
let cookieHeader = null
let csrfToken = null

module.exports = class BrowserManager {
  static async signInJowi() {
    try {
      if (browser) {
        await browser.close()
      }
    } catch (error) {}
    try {
      browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      console.log(`[${new Date().toISOString()}] browser launched`)
      const page = await browser.newPage()
      const response = await page.goto(JOWI_WEB_URL + '/ru/users/sign_in', { waitUntil: 'networkidle2' })
      if (response.status() !== 302) {
        await page.type('#user_email', JOWI_USER_EMAIL)
        await page.type('#user_password', JOWI_USER_PASSWORD)
        await Promise.all([
          page.click('.form_submit button'),
          page.waitForNavigation({ waitUntil: 'networkidle2' })
        ])
      }
      const cookies = await page.cookies()
      cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')
      csrfToken = await page.$eval('meta[name="csrf-token"]', element => element.content)
      await browser.close()
      browser = null
    } catch (error) {
      
    }
    setTimeout(() => {
      BrowserManager.signInJowi()
    }, 1000 * 60 * 60)
  }

  static getCookieHeader() {
    return cookieHeader
  }

  static getCsrfToken() {
    return csrfToken
  }
}
