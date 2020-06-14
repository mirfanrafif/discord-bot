const path = require("path");
const MusicClient = require("./MusicClient");
const { CommandoClient } = require("discord.js-commando");

const client = new MusicClient({
  commandPrefix: ".",
  owner: "523031781373640714",
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["common", "Common used commands"],
    ["music", "Music commands"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity("with Commando");
});

//autoroles
client.on("guildMemberAdd", async (member) => {
  var role = member.guild.roles.cache.find((r) => r.name === "numpang lewat");
  await member.roles.add(role.id);
});

client.on("error", console.error);

client.login("NzIxMDIyNDU4NTA0Njc1NDE4.XuOeyg.sEeXOjKDGZi_hovH0VyXei9ubkM");
