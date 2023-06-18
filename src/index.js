require('dotenv').config('./.env');
const { Client, IntentsBitField, Events, EmbedBuilder, ActivityType } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Bot Aktif!'));

app.listen(port, () =>
console.log(`Memulai mengaktifkan Bot...`)
);

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Terdapat kesalahan: ${error}`);
  }
})();

client.on(Events.InteractionCreate, async interaction => {

  // Bot Activity (for now, type of activity set with Watching)
  client.user.setActivity("by SIUBSI - Staff", {
    type: ActivityType.Watching,
  });

  // Modal untuk Perintah 'Saran'
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'modal') {
    await interaction.reply({
      content: "Masukkan anda telah terkirim!\nTerimakasih sudah mengirimkan saran demi keberlangsungan fungsionalitas server ini.",
      ephemeral: true
    })
  };

  const name = interaction.fields.getTextInputValue('name');
  const pesan = interaction.fields.getTextInputValue('pesan');

  const embednya = new EmbedBuilder()
        .setTitle("Notifikasi Saran")
        .setDescription(`Pengirim: **${name}**\n\n${pesan}`)
        .setColor(0x808080)
        .setTimestamp()

  // console.log(`Name: ${name}\nPesan: ${pesan}`)
  client.channels.cache.get('ChannelID').send({ embeds: [embednya] }); // Ubah 'ChannelID' menjadi ID Channel pada Server discord anda
  console.log(`Saran dari - ${name}`);

})
