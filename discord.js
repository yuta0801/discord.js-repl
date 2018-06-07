const repl = require('repl')

const Discord = require('discord.js')
const client = new Discord.Client()

let onMessage = () => {}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  const r = repl.start()
  r.context.client = client
  r.context.onMsg = onMsg
  r.on('exit', () => process.exit())
})

client.on('message', onMessage)

client.login(process.env.TOKEN)

function onMsg(callback) {
  onMessage = callback
}
