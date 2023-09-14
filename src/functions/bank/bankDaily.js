const { EmbedBuilder } = require('discord.js');
const UserBank = require('./../../models/UserBank');
const dailyAmount = 45;

module.exports = async (interaction) => {
    try {
        let userBank = await UserBank.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id,
        });

        if (!UserBank) {
            const noAccountEmbed = new EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription("Tu ne peux pas récolter l'argent quotidien sans compte bancaire *(/bank account create)*. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [noAccountEmbed],
                ephemeral: true,
            });
            return;
        }

        const lastDailyDate = userBank.lastDaily?.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
            const dailyAlreadyCollectedEmbed = new EmbedBuilder()
                .setTitle('Daily Already Collected Error :')
                .setDescription("Tu as déjà récolté ta récompense quotidienne aujourd'hui. Reviens demain ! \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            await interaction.reply({
                embeds: [dailyAlreadyCollectedEmbed],
                ephemeral: true,
            });
            return;
        }

        userBank.bankBalance += dailyAmount;
        userBank.lastDaily = new Date();

        await userBank.save();

        const dailyCollectedEmbed = new EmbedBuilder()
            .setTitle('Daily Collected:')
            .setDescription(`Tu as récupéré ta récompense quotidienne, tu as obtenu **+$45**.`)
            .setColor("Green");
        await interaction.reply({
            embeds: [dailyCollectedEmbed],
            ephemeral: true,
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
        console.log(`Error with /bank daily: ${e}`);
    }
}