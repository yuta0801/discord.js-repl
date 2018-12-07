const repl = require('repl')

const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = (token, prefs) => {
  let onMessage = () => {}

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    prefs[client.user.tag] = token
    const r = repl.start()
    r.context.client = client
    r.context.onMsg = onMsg
    r.on('exit', () => process.exit())
  })

  client.on('message', onMessage)

  client.login(token)

  function onMsg(callback) {
    onMessage = callback
  }
}
