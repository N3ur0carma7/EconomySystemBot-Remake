const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const bankAccountCreate = require('../../functions/bank/bankAccountCreate');
const bankAccountBalance = require('../../functions/bank/bankAccountBalance');
const bankDaily = require('../../functions/bank/bankDaily');
const bankAccountShow = require('../../functions/bank/bankAccountShow');
const bankAccountDelete = require('../../functions/bank/bankAccountDelete');
const bankAccountLogs = require('../../functions/bank/bankAccountLogs');

const data = {
    name: 'bank',
    description: 'Interact with "Banque Kastovienne"',
    options: [
        {
            name: 'account',
            description: "Interact with Bank Accounts account",
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
                {
                    name: 'delete',
                    description: "Permet de supprimer son compte bancaire sous acceptation d'un banquier.",
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: "La personne à qui il faut supprimer le compte bancaire.",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'logs',
                    description: "Permet de voir les logs bancaires d'une personne.",
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: "Le personne à qui il faut vérifier les logs.",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: 'action-filter',
                            description: "Le filtre à appliquer pour les actions.",
                            type: ApplicationCommandOptionType.Number,
                            choices: [
                                {
                                    name: 'Account Create',
                                    value: 0,
                                },
                                {
                                    name: 'Account Add Money',
                                    value: 1,
                                },
                                {
                                    name: 'Account Remove Money',
                                    value: 2,
                                },
                                {
                                    name: 'Account Money Share',
                                    value: 3,
                                },
                                {
                                    name: 'Account Delete',
                                    value: 4,
                                },
                            ],
                        },
                    ]
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
            } switch (command) {
            case 'delete':
                const user = interaction.options.get('user').value;
                await bankAccountDelete(interaction, user);
            } switch (command) {
            case 'logs':
                const user = interaction.options.get('user').value;
                const actionFilter = interaction.options.get('action-filter')?.value;
                await bankAccountLogs(interaction, user, actionFilter)
            }
    }
    switch (command) {
        case 'daily':
            await bankDaily(interaction);
    }
}

module.exports = { data, run };