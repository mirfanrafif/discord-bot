const ytdl = require("ytdl-core");
const { Util } = require("discord.js");

module.exports = {
  async MusicPlay(message, args) {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send("Kamu belum gabung voice channel, nak...");

    const serverQueue = message.client.queue.get(message.guild.id);
    const songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, "$1"));
    const song = {
      id: songInfo.videoDetails.videoId,
      title: Util.escapeMarkdown(songInfo.videoDetails.title),
      url: songInfo.videoDetails.video_url,
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      console.log(serverQueue.songs);
      return message.channel.send(
        `✅ **${song.title}** uda ditambahin ke playlistmu`
      );
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        queue.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", (error) => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      queue.textChannel.send(`🎶 Mulai nyetel **${song.title}**`);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`gabisa join ke voice channel kamu karena : ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(
        `gabisa join ke voice channel kamu karena : ${error}`
      );
    }
  },
  queue(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("Playlist kamu kosong.");
    return message.channel.send(`
      Playlist kamu : \n
      ${serverQueue.songs.map((song) => `**-** ${song.title}`).join("\n")}
      Yang kamu setel sekarang : ${serverQueue.songs[0].title}
		`);
  },
  skip(message) {
    if (serverQueue && serverQueue.playing) {
      serverQueue.connection.dispatcher.end();
      return message.channel.send("⏩ Lagumu di skip");
    }
  },
  stop(message) {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send("Kamu belum gabung voice channel, nak...");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("Mau nyetop apa aku...");
    serverQueue.songs = [];
  },
};
