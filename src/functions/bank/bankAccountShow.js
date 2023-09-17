const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require('discord.js');
const UserBank = require('../../models/UserBank');
const loggingBankAccount = require("../log/loggingBankAccount");

module.exports = async (interaction) => {
    try {
        let userBank = await UserBank.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id,
        })

        if (!userBank) {
            const noAccountEmbed = new EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription("Tu ne peux pas montrer l'argent que tu possèdes sans compte bancaire *(/Bank Accounts account create)*. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
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
            .setDescription("Êtes-vous sûr de vouloir montrer l'argent de votre compte bancaire en public ?")
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

        let trigger = 0;
        collector.on('collect', async (interaction) => {
            if (trigger === 1) {
                return;
            }
            if (interaction.customId === 'confirm') {
                const balanceShareEmbed = new EmbedBuilder()
                    .setTitle('Balance Share :')
                    .setDescription(`<@${interaction.user.id}> a partagé son solde bancaire. \nIl possède : **$${userBank.bankBalance}**`)
                    .setColor("DarkGreen");
                interaction.reply({
                    embeds: [balanceShareEmbed],
                });

                const actionId = 3;
                const actionName = "Account Balance Share :";
                const content = `User <@${interaction.member.id}> shared his account balance in <#${interaction.channel.id}>.`;
                const logUserId = interaction.member.id;

                await loggingBankAccount(actionId, actionName, content, interaction, logUserId);
                trigger = 1;
                return;
            }
            if (interaction.customId === 'cancel') {
                const balanceShareCancelEmbed = new EmbedBuilder()
                    .setTitle('Cancellation :')
                    .setDescription("L'action a bien été annulée.")
                    .setColor("DarkRed");
                interaction.reply({
                    embeds: [balanceShareCancelEmbed],
                    ephemeral: true,
                });
                trigger = 1;
            }
        })
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
            console.log(`Failed to process interaction.reply: ${e}`)
        }
        console.log(`Error with /bank daily: ${e}`);
    }
}