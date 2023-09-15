const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require("discord.js");
const UserBank = require('../../models/UserBank');

module.exports = async (interaction, user) => {
    let errTrigger;
    try {
        if (!interaction.member.roles.cache.some(r => ["Kastov en chef de l'économie"].includes(r.name))) {
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

        let userBank = await UserBank.findOne({
            userId: user,
            guildId: interaction.guild.id,
        });

        if (!userBank) {
            const noAccountEmbed = new EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription(`<@${user}> ne possède pas de compte bancaire. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*`)
                .setColor("Red");
            await interaction.reply({
                embeds: [noAccountEmbed],
                ephemeral: true,
            });
            return;
        }

        const confirmButton = new ButtonBuilder()
            .setLabel('Oui')
            .setStyle(ButtonStyle.Success)
            .setCustomId('confirm');
        const cancelButton = new ButtonBuilder()
            .setLabel('Non')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('cancel');

        const buttonRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        const confirmationEmbed = new EmbedBuilder()
            .setTitle('Confirmation :')
            .setDescription(`Êtes-vous sûr de vouloir supprimer le compte de <@${user}> ?`)
            .setColor("Yellow");
        const reply = await interaction.reply({
            embeds: [confirmationEmbed],
            components: [buttonRow],
            ephemeral: true,
        });

        const filter = (i) => i.user.id === interaction.user.id;

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter,
            time: 30_000,
        });

        const dUser = interaction.channel.guild.members.cache.get(user);


        let trigger = 0;
        collector.on('collect', async (interaction) => {
            if (trigger === 1) {
                return;
            }
            if (interaction.customId === 'confirm') {
                await UserBank.findOneAndDelete({
                    userId: user,
                    guildId: interaction.guild.id,
                });

                const userDMEmbed = new EmbedBuilder()
                    .setTitle('Bank Critical Notification :')
                    .setDescription("Votre compte bancaire auprès de la Banque Kastovienne vient d'être **supprimé** --> <#1151562817770635284> \n\n*Si la demande ne viens pas de vous, veillez contacter le Kastov en chef de l'économie*")
                    .setColor("DarkRed");
                errTrigger = 0;
                await dUser.send({
                    embeds: [userDMEmbed],
                }).catch(async (err) => {
                    console.log(`An error occured while trying to DM user from command /bank account delete: ${err}`)

                    errTrigger = 1;
                });

                if (errTrigger === 1) {
                    const failedDMEmbed = new EmbedBuilder()
                        .setTitle('Failed DM Error :')
                        .setDescription(`Le compte bancaire de <@${user}> a bien été supprimé mais une erreur est survenue lors de la tentative de DM du membre. Merci de DM manuellement le membre et contacter <@580160894395219968>`)
                        .setColor("DarkOrange");
                    await interaction.reply({
                        embeds: [failedDMEmbed],
                        ephemeral: true,
                    });
                } else {
                    const accountDeletedEmbed = new EmbedBuilder()
                        .setTitle('Account Deleted :')
                        .setDescription(`Le compte bancaire de <@${user}> a été supprimé avec succès. Son propriétaire en a été notifié.`)
                        .setColor("Green");
                    await interaction.reply({
                        embeds: [accountDeletedEmbed],
                        ephemeral: true,
                    });
                }

                trigger = 1;
                return;
            }
            if (interaction.customId === 'cancel') {
                const accountDeleteCancelEmbed = new EmbedBuilder()
                    .setTitle('Cancellation :')
                    .setDescription("L'action a bien été annulée.")
                    .setColor("DarkRed");
                await interaction.reply({
                    embeds: [accountDeleteCancelEmbed],
                    ephemeral: true,
                });
                trigger = 1;
            }
        });
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
        console.log(`Error with /bank account delete: ${e}`);
    }
}