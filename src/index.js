require('dotenv').config('./.env');
const { Client, IntentsBitField, Events, EmbedBuilder, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Online...'));

app.listen(port, () =>
console.log(`Logging in...`)
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
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();

client.on(Events.InteractionCreate, async interaction => {

  client.user.setActivity("by SIUBSI - Staff", {
    type: ActivityType.Watching,
  });

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
  client.channels.cache.get('ChannelID').send({ embeds: [embednya] });
  console.log(`Saran dari - ${name}`);

})
