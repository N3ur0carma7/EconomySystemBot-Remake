const { Schema, model } = require('mongoose');

const userLogsSchema = new Schema({
        userId: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        bankLogs: [
            {
                actionId: {
                    type: Number,
                },
                content: {
                    type: String,
                },
                actionName: {
                    type: String,
                },
                time: {
                    type: Date,
                },
            },
        ],
        companyLogs: [
            {
                actionId: {
                    type: Number,
                },
                content: {
                    type: String,
                },
                actionName: {
                    type: String,
                },
                time: {
                    type: Date,
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = model('UserLogs', userLogsSchema);