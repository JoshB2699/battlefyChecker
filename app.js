const Discord = require('discord.js');
const dotenv = require('dotenv');

const config = require('./config/config.js');

const client = new Discord.Client();
dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith(config.commandPrefix + 'check')) {
    require('./commands/check.js')(msg, config);
  }
});

client.login(process.env.BOT_TOKEN);
