const {
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
} = require('discord.js');
const UserBank = require('./../../models/UserBank');
const dailyAmount = 250;


const data = {
    name: 'bank',
    description: "Permet d'accéder aux commandes reliés à la Banque Kastovienne",
};

/**
 *
 * @param {Object} param0
 * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
    if (!interaction.inGuild()) {
        interaction.reply({
           content: "Tu ne peux que exécuter cette commande dans un serveur Discord.",
           ephemeral: true,
        });
        return;
    }
    try {
        const userBank = await UserBank.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id
        });

        if (!userBank) {
            const noAccountEmbed = new EmbedBuilder()
                .setTitle('No Account Error :')
                .setDescription("Tu ne peux pas exécuter cette commande **sans compte bancaire**. \n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                .setColor("Red");
            interaction.reply({
                embeds: [noAccountEmbed],
                ephemeral: true
            });
            return;
        }

        const bankCommands = [
            {
                label: 'Daily Login',
                description: "Récupère ta récompense quotidienne",
                value: 'daily-login',
                emoji: '📆'
            },
            {
                label: 'Another (fake) Daily Login',
                description: "Récupère ta récompense quotidienne ?",
                value: 'fake-daily-login',
                emoji: '⛔'
            },
        ];

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setPlaceholder('Choisisez une commande à exécuter...')
            .setMinValues(0)
            .setMaxValues(1)
            .addOptions(
                bankCommands.map((command) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(command.label)
                        .setDescription(command.description)
                        .setValue(command.value)
                        .setEmoji(command.emoji)
                )
            );

        const actionRow = new ActionRowBuilder().addComponents(selectMenu);

        const reply = await interaction.reply({ components: [actionRow] });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
            time: 60_00,
        });

        collector.on('collect', async (interaction) => {
            if (!interaction.values.length) {
                interaction.reply("This feature is not enabled yet.");
                return;
            }

            if (interaction.values === 'daily-login') {
                const lastDailyDate = userBank.lastDaily?.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    const dailyAlreadyCollectedEmbed = new EmbedBuilder()
                        .setTitle('Daily Already Collected Error :')
                        .setDescription("Tu as déjà récupéré ta récompense quotidienne aujourd'hui.\n\n*Si vous pensez que cela est une erreur, veillez contacter <@580160894395219968>*")
                        .setColor("Red");
                    interaction.reply({
                        embeds: [dailyAlreadyCollectedEmbed],
                        ephemeral: true
                    });
                    return;
                }

                userBank.bankBalance += dailyAmount;
                userBank.lastDaily = new Date();

                await userBank.save();

                const dailyCollectedEmbed = new EmbedBuilder()
                    .setTitle('Daily Collected :')
                    .setDescription(`Tu as récupéré ta récompense quotidienne. Tu as maintenant **$${userBank.bankBalance}** !`)
                    .setColor("Green")
                interaction.reply({
                    embeds: [dailyCollectedEmbed],
                    ephemeral: true
                });
            }
        });
    } catch (e) {
        const failEmbed = new EmbedBuilder()
            .setTitle("Erreur code :")
            .setDescription("Une erreur est survenue dans le code. Veillez contacter <@580160894395219968>")
            .setColor("Red")
        try {
            interaction.reply({
                embeds: [failEmbed],
                ephemeral: true
            });
        } catch (e) {
            interaction.followUp({
                embeds: [failEmbed],
                ephemeral: true
            });
        }
        console.log(`Error with /bank: ${e}`);
    }

}

module.exports = { data, run };