const { EmbedBuilder } = require("discord.js");
const bankAccountCreate = require('../../functions/bank/bankAccountCreate');
const bankAccountBalance = require('../../functions/bank/bankAccountBalance');
const bankDaily = require('../../functions/bank/bankDaily');
const bankAccountShow = require('../../functions/bank/bankAccountShow');

const data = {
    name: 'bank',
    description: 'Interact with "Banque Kastovienne"',
    options: [
        {
            name: 'account',
            description: "Interact with bank account",
            type: 2,
            options: [
                {
                    name: 'create',
                    description: "Permet de créer un compte bancaire de la Banque Kastovienne.",
                    type: 1,
                },
                {
                    name: 'balance',
                    description: "Permet de voir l'argent sur son Compte de Dépot",
                    type: 1,
                },
                {
                    name: 'show',
                    description: "Permet de montrer l'argent que l'on possède dans le chat.",
                    type: 1,
                },
            ],
        },
        {
          name: 'daily',
          description: "Récupère ta récompense quotidienne !",
          type: 1,
        },
    ],
};

async function run({ interaction }) {
    if (!interaction.inGuild()) {
        const notInGuildEmbed = new EmbedBuilder()
            .setTitle('Not In Guild Error :')
            .setDescription("Tu ne peux pas exécuter cette commande si tu n'est pas dans un serveur Discord.")
            .setColor("Red");
        await interaction.reply({
            embeds: [notInGuildEmbed],
            ephemeral: true,
        });
        return;
    }

    const grpCommand = interaction.options.getSubcommandGroup();
    const command = interaction.options.getSubcommand();

    switch (grpCommand) {
        case 'account':
            switch (command) {
                case 'create':
                    await bankAccountCreate(interaction);
            } switch (command) {
            case 'balance':
                await bankAccountBalance(interaction);
            } switch (command) {
            case 'show':
                await bankAccountShow(interaction);
            }
    }
    switch (command) {
        case 'daily':
            await bankDaily(interaction);
    }
}

module.exports = { data, run };