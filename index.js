const { Telegraf } = require('telegraf');
const express = require('express');
const config = require('./config');
const joinRequestHandler = require('./handlers/joinRequest');
const adminActionsHandler = require('./handlers/adminActions');

// 1. Bot Initsializatsiyasi
const bot = new Telegraf(config.BOT_TOKEN);

// 2. Render uxlab qolmasligi uchun Express Health Check Server
const app = express();
app.get('/', (req, res) => res.send('Bot is running and listening to join requests! 🚀'));
app.listen(config.PORT, () => console.log(`[Server] Health check port ${config.PORT} da ishga tushdi.`));

// 3. Event Listenerlar
// Chatga qo'shilish so'rovini ushlash
bot.on('chat_join_request', joinRequestHandler);

// Admin bosgan tugmalarni ushlash (Regex orqali faqat accept va reject ni ushlaydi)
bot.action(/^(accept|reject):.+:.+$/, adminActionsHandler);

// 4. Global Error Handling (Bot qulab tushmasligi uchun)
bot.catch((err, ctx) => {
    console.error(`[Global Error] ${ctx.updateType} update'da xatolik:`, err);
});

// 5. Botni ishga tushirish
bot.launch().then(() => {
    console.log('[Bot] Muvaffaqiyatli ishga tushdi va kutyapti...');
});

// 6. Graceful Stop (Restart bo'lganda to'g'ri o'chishi uchun)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
