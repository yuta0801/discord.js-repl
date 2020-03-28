const repl = require('repl')

module.exports = (version, token, prefs) => {
  const Discord = require('discord.js-' + version)
  const client = new Discord.Client()

  console.log(`Node.js ${process.version}, Discord.js ${Discord.version}`)

  const refs = { onMessage: () => {} }

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    prefs[client.user.tag] = token
    const r = repl.start()
    r.context.client = client
    r.context.onMsg = onMsg
    r.context.Discord = Discord
    r.on('exit', () => process.exit())
  })

  client.on('message', message => refs.onMessage(message))

  client.login(token)

  const onMsg = callback => {
    refs.onMessage = callback
  }
}
