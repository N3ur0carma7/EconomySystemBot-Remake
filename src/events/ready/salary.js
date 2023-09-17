const cron = require('node-cron');

module.exports = (client) => {
    cron.schedule('0 0 * * *', () => {
        client.guilds.cache.forEach((guild) => {

        });
    });
};