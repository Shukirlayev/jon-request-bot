require('dotenv').config();

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    ADMIN_ID: parseInt(process.env.ADMIN_ID, 10),
    GROUP_ID: process.env.GROUP_ID,
    CHANNEL_ID: process.env.CHANNEL_ID, // Majburiy a'zolik uchun kanal
    PORT: process.env.PORT || 3000
};
