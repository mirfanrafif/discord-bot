const discord = require("discord.js");
const client = new discord.Client();

const prefix = ".";

client.on("ready", () => {
  console.log("I am ready");
});

//message
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content === `${prefix}ping`) {
  } else {
    const args = message.content.slice(prefix.length).split(" ");
    const command = args.shift().toLowerCase();

    if (command === "say") {
      message.channel.send(args);
    }
  }
});

//autoroles
client.on("guildMemberAdd", async (member) => {
  var role = member.guild.roles.cache.find((r) => r.name === "numpang lewat");
  await member.roles.add(role.id);
});

client.login("NzIxMDIyNDU4NTA0Njc1NDE4.XuOeyg.sEeXOjKDGZi_hovH0VyXei9ubkM");
