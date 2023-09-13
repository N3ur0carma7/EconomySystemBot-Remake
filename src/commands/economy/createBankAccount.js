const {
    EmbedBuilder,
} = require('discord.js');
const UserBank = require('./../../models/UserBank');

const data = {
    name: 'create',
    description: "Permet de créer quelquechose...",
    options: [
        {
            name: 'bank',
            description: "Permet de faire quelquechose avec la Banque Kastovienne",
            type: 2,
            options: [
                {
                    name: 'account',
                    description: "Permet de créer con compte bancaire auprès de la Banque Kastovienne.",
                    type: 1,
                },
            ],
        },
    ],
};

/**
 *
 * @param {Object} param0
 * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
 */
async function run({ interaction }) {
    if (!interaction.inGuild()) {
        const notInGuildEmbed = new EmbedBuilder()
            .setTitle('Not In Guild Error :')
            .setDescription("")
    }
}


module.exports = { data, run };