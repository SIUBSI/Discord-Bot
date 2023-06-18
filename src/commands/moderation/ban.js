const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason =
      interaction.options.get('reason')?.value || '-';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("Pengguna tersebut tidak ditemukan di server ini.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Anda tidak dapat kick pengguna tersebut karena dia adalah pemilik server."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "Anda tidak dapat kick pengguna tersebut karena mereka memiliki peran yang sama/lebih tinggi dari Anda."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Bot tidak dapat kick pengguna tersebut karena mereka memiliki peran yang sama/lebih tinggi dari Bot."
      );
      return;
    }

    // Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `Pengguna ${targetUser} telah di ban dari Server\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`Terdapat kesalahan ketika menjalankan perintah Ban: ${error}`);
    }
  },

  name: 'ban',
  description: 'Bans a member from this server.',
  options: [
    {
      name: 'target-user',
      description: 'Siapa yang ingin anda Ban?',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'Alasan mengapa pengguna di Ban.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  devOnly: true, // Ubah ke false jika ingin perintah ini digunakan untuk user selain Pemilik Bot (tetapi user yang memiliki hak Ban User/Member)
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
