//#region Some initial setup
const Config = require('./config.json');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const pokemonAdapter = new FileSync('pokemon-db.json');
const pokemonDB = low(pokemonAdapter);
const usersAdapter = new FileSync('users-db.json');
const usersDB = low(usersAdapter);
const serverAdapter = new FileSync('server-db.json');
const serverDB = low(serverAdapter);
const client = new Discord.Client();
client.login(process.env.test_bot); // Using my test bot's token from my env variables, will move it to a config file for release
//#endregion

//#region Handle the message event
client.on('message', (message) => {
  if (message.system || message.author.bot) return;
  message.isDM = message.guild ? false : true;
  if (message.isDM == false) {
    const cfg = serverDB.get('config').find({ ID: message.guild.id }).value();
    if (message.content.startsWith(Config.prefix)) {
      if (message.content.substring(Config.prefix.length) == 'setChannel') {
        addWebhook(message);
      }
    } else if (message.content.startsWith(cfg.prefix)) {
      if (message.content.substring(cfg.prefix.length) == 'setChannel') {
        addWebhook(message);
      }
    }
  }
});
//#endregion

//#region Setup a webhook
async function addWebhook(message) {
  let x = await message.channel.createWebhook('FakePokécord', {
    avatar: 'https://i.imgur.com/aC7tBFU.png',
    reason: 'FakePokécord',
  });
  serverDB
    .get('config')
    .find({ ID: message.guild.id })
    .assign({ url: x.url })
    .write();
  const embed = new Discord.MessageEmbed()
    .setTitle('ALL SET')
    .setDescription('This channel is now setup to recieve Pokémon!')
    .setThumbnail('https://i.imgur.com/aC7tBFU.png')
    .setTimestamp();
  x.send(embed);
}
//#endregion

//#region Send to webhook
async function sendWebhook(url, input) {
  let x;
  fetch(url)
    .then((res) => res.json())
    .then((json) => (x = json));
  new Discord.WebhookClient(x.id, x.token).send(input);
}
//#endregion

//#region Create server config on joining server
client.on('guildCreate', (guild) => {
  serverDB
    .get('config')
    .push({ ID: guild.id, prefix: 'p!', url: '', latest: '' })
    .write();
  console.log(
    `Config created for Guild ${guild.name} (${guild.id}). Reason: Joined Guild.`
  );
});
//#endregion

//#region Delete server config on leaving server
client.on('guildDelete', (guild) => {
  serverDB.get('config').remove({ ID: guild.id }).write();
  console.log(
    `Config deleted for Guild ${guild.name} (${guild.id}). Reason: Left Guild.`
  );
});
//#endregion

//#region Useless stuff, mostly for debugging
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity('Pokémon', { type: 'WATCHING' });
});
//#endregion
