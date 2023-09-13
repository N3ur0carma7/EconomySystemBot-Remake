const { Schema, model } = require('mongoose');

const userBankSchema = new Schema({
        userId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        bankBalance: {
            type: Number,
            default: 0,
        },
        walletBalance: {
            type: Number,
            default: 0,
        },
        lastDaily: {
            type: Date,
            default: 0,
        },
        casinoEnd: {
            type: Date,
            default: 0,
        }
    },
    { timestamps: true }
);

module.exports = model('UserBank', userBankSchema);