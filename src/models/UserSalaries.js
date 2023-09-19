const { Schema, model } = require('mongoose');

const userSalariesSchema = new Schema({
        userId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        salaries: [
            {
                id: Number,
                name: String,
                amount: Number,
                cooldown: Number,
            }
        ],
    },
    { timestamps: true }
);

module.exports = model('UserSalaries', userSalariesSchema);