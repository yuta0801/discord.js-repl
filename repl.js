const util = require('util')
const repl = require('repl')

module.exports = (version, token, prefs) => {
  const Discord = require('discord.js-' + version)
  const client = new Discord.Client()

  console.log(`Node.js ${process.version}, Discord.js ${Discord.version}`)

  const refs = { onceMessage: null, onMessage: null }

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    prefs.tokens[token] = client.user.tag
    const r = repl.start({ writer: makeWriter(Discord) })
    r.context.client = client
    r.context.onceMsg = onceMsg
    r.context.onMsg = onMsg
    r.context.offMsg = offMsg
    r.context.Discord = Discord
    r.on('exit', () => process.exit())
  })

  client.on('message', message => {
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

// custom repl writer
const makeWriter = Discord => {
  // check a object is Discord.js' class instance
  const classes = Object.values(Discord)
    .filter(val => typeof val === 'function' && val.prototype)

  const isDiscordInstance = obj =>
    obj.constructor && classes.some(_class => obj instanceof _class)

  const inspect = (obj, colors) => {
    const options = { ...util.inspect.replDefaults, colors }
    let str = util.inspect(obj, options)
    if (!isDiscordInstance(obj)) return str
    // if output is too long, do not expand nested objects
    if (str.split('\n').length > 6)
      str = util.inspect(obj, { ...options, depth: 0 })
    // if still too long, just output the class name
    if (str.split('\n').length > 10)
      str = stylize(`<${obj.constructor.name}>`, colors)
    return str
  }

  return function (obj) { return inspect(obj, this.useColors) }
}

const stylize = (str, colors) => {
  if (!colors) return str
  const style = util.inspect.styles['special']
  const color = util.inspect.colors[style]
  return `\u001b[${color[0]}m${str}\u001b[${color[1]}m`
}
