const discord = require('discord.js');
const client = discord.Client();

client.on('ready', () => {
  console.log('I am ready');
});

client.on('message', (message) => {
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
});

client.login('NzIxMDIyNDU4NTA0Njc1NDE4.XuOeyg.sEeXOjKDGZi_hovH0VyXei9ubkM');