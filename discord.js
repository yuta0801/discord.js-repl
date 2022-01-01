const repl = require('repl')

module.exports = (version, token, prefs) => {
  const Discord = require('discord.js-' + version)
  const client = new Discord.Client({
    intents: Object.keys(Discord.Intents.FLAGS),
  })

  console.log(`Node.js ${process.version}, Discord.js ${Discord.version}`)

  const refs = { onceMessage: null, onMessage: null }

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    prefs.tokens[token] = client.user.tag
    const r = repl.start()
    r.context.client = client
    r.context.onceMsg = onceMsg
    r.context.onMsg = onMsg
    r.context.offMsg = offMsg
    r.context.Discord = Discord
    r.on('exit', () => process.exit())
  })

  client.on(version === 'v12' ? 'message' : 'messageCreate', message => {
    if (refs.onMessage) refs.onMessage(message)
    if (refs.onceMessage) {
      refs.onceMessage(message)
      refs.onceMessage = null
    }
  })

  client.login(token)

  const onceMsg = callback => refs.onceMessage = callback
  const onMsg = callback => refs.onMessage = callback
  const offMsg = () => refs.onMessage = null
}
