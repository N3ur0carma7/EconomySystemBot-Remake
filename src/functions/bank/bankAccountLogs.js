const { EmbedBuilder, User} = require("discord.js");
const UserBankLogs = require('../../models/UserLogs');

module.exports = async (interaction, user, actionFilter) => {
    try {
        if (!interaction.member.roles.cache.some(r => ["Kastov en chef de l'économie", "Banquier"].includes(r.name))) {
            const noPermissionEmbed = new EmbedBuilder()
                .setTitle('No Permission Error :')
                .setDescription("Vous ne possédez pas les permissions nécessaires afin d'exécuter cette commande. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [noPermissionEmbed],
                ephemeral: true,
            });
            return;
        }

        async function obtainLogsWithFilter(userId, guildId, filter) {
            let query = {
                userId,
                guildId,
            }

            if (filter) {
                let query = {
                    userId,
                    guildId,
                    bankLogs: [
                        {
                            actionId: filter,
                        },
                    ],
                };
            }

            let userBankLogs = await UserBankLogs.findOne(query);

            if (!userBankLogs) {
                const noBankLogsEmbed = new EmbedBuilder()
                    .setTitle('No Bank Logs Error :')
                    .setDescription(`Le membre <@${user}> ne possède pas de logs de son compte bancaire. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*`)
                    .setColor("Red");
                await interaction.reply({
                    embeds: [noBankLogsEmbed],
                    ephemeral: true,
                });
                return;
            }

            const bankLogsEmbed = new EmbedBuilder()
                .setTitle('Bank logs :')
                .setDescription(`Voici les logs bancaires de <@${user}> :`)
                .setColor("Blue");

            if (actionFilter) {
                const newArr = userBankLogs.bankLogs.filter(object => {
                    return object.actionId === actionFilter;
                });
                newArr.forEach((log, index) => {
                    bankLogsEmbed.addFields({ name: `${index + 1}. ${log.actionName}`, value: `${log.content} \nTime : ${log.time.toDateString()}` })
                })
            } else {
                userBankLogs.bankLogs.forEach((log, index) => {
                    bankLogsEmbed.addFields({ name: `${index + 1}. ${log.actionName}`, value: `${log.content} \nTime : ${log.time.toDateString()}` })
                });
            }

            await interaction.reply({
                embeds: [bankLogsEmbed],
                ephemeral: true,
            });
        }

        await obtainLogsWithFilter(user, interaction.guild.id, actionFilter);
    } catch (e) {
        const failEmbed = new EmbedBuilder()
            .setTitle("Code Error :")
            .setDescription("Une erreur est survenue dans le code. Veillez contacter <@580160894395219968>")
            .setColor("Red")
        try {
            await interaction.reply({
                embeds: [failEmbed],
                ephemeral: true
            });
        } catch (e) {
            await interaction.followUp({
                embeds: [failEmbed],
                ephemeral: true
            });
        }
        console.log(`Error with /bank account logs: ${e}`);
    }
}