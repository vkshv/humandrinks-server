const puppeteer = require('puppeteer')

let browser = null

module.exports = class BrowserManager {
  static async getBrowser() {
    try {
      if (!browser || !browser.isConnected()) {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      }
      browser.on('disconnected', () => {
        browser = null
      })
      return browser
    } catch (error) {
      return null
    }
  }
}
