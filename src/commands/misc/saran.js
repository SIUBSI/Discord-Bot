const { 
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
 } = require('discord.js');

 module.exports = {

    callback: async(client, interaction) => {

        const modal = new ModalBuilder()
            .setTitle("Saran")
            .setCustomId('modal')

        const name = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Nama")
            .setPlaceholder("Masukkan nama anda jika ingin")
            .setStyle(TextInputStyle.Short);

        const pesan = new TextInputBuilder()
            .setCustomId("pesan")
            .setRequired(true)
            .setLabel("Pesan")
            .setPlaceholder("Min, Tambahkan fitur bla bla bla...")
            .setStyle(TextInputStyle.Paragraph);


        const firstActionRow = new ActionRowBuilder().addComponents(name);
        const secondActionRow = new ActionRowBuilder().addComponents(pesan);

        modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal);
    },

    name: 'saran',
    description: 'Berikan saran anda untuk Komunitas SIUBSI ini',

 }