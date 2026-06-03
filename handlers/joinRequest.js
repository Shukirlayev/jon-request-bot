const { Markup } = require('telegraf');
const { ADMIN_ID } = require('../config');
const { requestCache } = require('../utils/telegram');

module.exports = async (ctx) => {
    try {
        const request = ctx.chatJoinRequest;
        const userId = request.from.id;
        const chatId = request.chat.id;
        const cacheKey = `${userId}:${chatId}`;

        // Duplicate requestni tekshirish
        if (requestCache.has(cacheKey)) {
            console.log(`[Cache] Duplicate request ignored: User ${userId}`);
            return;
        }
        
        // Cachega yozish (keyinroq xotira to'lib ketmasligi uchun vaqti bilan)
        requestCache.set(cacheKey, Date.now());

        const firstName = request.from.first_name || '';
        const lastName = request.from.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const username = request.from.username ? `@${request.from.username}` : 'Mavjud emas';
        const chatTitle = request.chat.title;

        // Adminga boradigan xabar
        const message = `🔔 <b>Yangi qo'shilish so'rovi!</b>\n\n` +
                        `👤 <b>Ism:</b> ${fullName}\n` +
                        `🔗 <b>Username:</b> ${username}\n` +
                        `🆔 <b>User ID:</b> <code>${userId}</code>\n` +
                        `👥 <b>Guruh:</b> ${chatTitle}`;

        // Tugmalar
        const buttons = [
            [
                Markup.button.callback('✅ Accept', `accept:${userId}:${chatId}`),
                Markup.button.callback('❌ Reject', `reject:${userId}:${chatId}`)
            ]
        ];

        // Agar username bo'lsa, profilga ssilka qo'shamiz
        if (request.from.username) {
            buttons.push([Markup.button.url('👤 View Profile', `https://t.me/${request.from.username}`)]);
        }

        const keyboard = Markup.inlineKeyboard(buttons);

        // Adminga yuborish
        await ctx.telegram.sendMessage(ADMIN_ID, message, {
            parse_mode: 'HTML',
            ...keyboard
        });

        console.log(`[Log] Join request sent to admin for User ID: ${userId}`);
    } catch (error) {
        console.error('[Error] joinRequest handler xatosi:', error);
    }
};
