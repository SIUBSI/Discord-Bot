const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('target-user').value;
    const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
    const reason = interaction.options.get('reason')?.value || '-';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("Pengguna tersebut tidak ditemukan di server ini.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("Tidak dapat menjalankan perintah ini kepada Bot.");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply('Berikan format yang benar.');
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply('Durasi waktu TimeOut tidak boleh kurang dari 5 detik atau lebih dari 28 hari.');
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("Anda tidak dapat mengatur durasi timeout pengguna tersebut karena mereka memiliki peran yang sama/lebih tinggi dari Anda.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("Bot tidak dapat mengatur durasi timeout pengguna tersebut karena mereka memiliki peran yang sama/lebih tinggi dari Bot.");
      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import('pretty-ms');

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`Durasi TimeOut pada Pengguna ${targetUser} telah diperbarui menjadi ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`);
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`Durasi TimeOut pada pengguna ${targetUser} selesai pada ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`);
    } catch (error) {
      console.log(`Terjadi kesalahan saat menjalankan perintah TimeOut: ${error}`);
    }
  },

  name: 'timeout',
  description: 'Timeout a user.',
  options: [
    {
      name: 'target-user',
      description: 'Pengguna yang ingin anda TimeOut.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'duration',
      description: 'Durasi TimeOut (30m, 1h, 1d).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'reason',
      description: 'Alasan mengapa pengguna di-TimeOut.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  devOnly: true, // Ubah ke false jika ingin perintah ini digunakan untuk user selain Pemilik Bot (tetapi user yang memiliki hak Mute User/Member)
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
