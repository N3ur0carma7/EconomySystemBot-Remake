const UserBankLogs = require('../../models/UserBankLogs');
const { EmbedBuilder } = require('discord.js');

module.exports = async (actionId, actionName, content, interaction, logUserId) => {
    try {
        let userBankLogs = await UserBankLogs.findOne({
            userId: logUserId,
            guildId: interaction.guild.id,
        });

        if (!userBankLogs) {
            userBankLogs = await new UserBankLogs({
                userId: logUserId,
                guildId: interaction.guild.id,
            });
        }

        await userBankLogs.bankLogs.push({
            actionId: actionId,
            content: content,
            actionName: actionName,
            time: new Date(),
        });

        userBankLogs.save();
    } catch (e) {
        console.log(`A critical error occurred while trying to log Bank action : ${e}`);

        const failBankLogError = new EmbedBuilder()
            .setTitle('Log Error :')
            .setDescription(`Une erreur est survenue lors de la tentative de log bancaire. Veillez contacter <@580160894395219968> **immédiatement !**`)
            .setColor("Red");
        try {
            await interaction.reply({
                embeds: [failBankLogError],
                ephemeral: true
            });
        } catch (e) {
            await interaction.followUp({
                embeds: [failBankLogError],
                ephemeral: true
            });
        }
    }
}