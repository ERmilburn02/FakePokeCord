//#region Some initial setup
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

//#region Useless stuff, mostly for debugging
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});
//#endregion
