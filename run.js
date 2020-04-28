const { resolve, join } = require('path')
const { existsSync } = require('fs')

module.exports = (version, token) => {
  require('module-alias').addAlias('discord.js', findModulePath(version))
  process.env.DISCORD_TOKEN = token

  const Discord = require('discord.js')

  if (version === 'v11') {
    const original = Discord.Client.prototype.login
    Discord.Client.prototype.login = function (_) {
      return original.call(this, _ || token)
    }
  }

  console.log(`Node.js ${process.version}, Discord.js ${Discord.version}`)

  const file = process.argv.slice(2).find(arg =>
    arg !== 'run' || arg.startsWith('-'),
  )

  require(resolve(file))
}

// find discord.js installed directory
const findModulePath = version => {
  const subdir = join(__dirname, 'node_modules/discord.js-' + version)
  if (existsSync(subdir)) return subdir

  const samedir = join(__dirname, '../discord.js-' + version)
  if (existsSync(samedir)) return samedir

  throw '[Discord.js REPL] Cannot find module discord.js-' + version
}
