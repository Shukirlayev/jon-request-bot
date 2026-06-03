const { ADMIN_ID } = require('../config');
const { requestCache } = require('../utils/telegram');

module.exports = async (ctx) => {
    try {
        // 1. Security Check: Faqat admin bosa oladi
        if (ctx.from.id !== ADMIN_ID) {
            return ctx.answerCbQuery('Sizda bu tugmani bosish huquqi yo\'q 🚫', { show_alert: true });
        }

        const data = ctx.callbackQuery.data;
        const [action, userId, chatId] = data.split(':');
        const cacheKey = `${userId}:${chatId}`;

        // 2. Action Logic
        if (action === 'accept') {
            await ctx.telegram.approveChatJoinRequest(chatId, userId);
            
            // Xabarni yangilash (tugmalarni olib tashlab, status yozamiz)
            const updatedText = `${ctx.callbackQuery.message.text}\n\n<b>Status:</b> Approved ✅`;
            await ctx.editMessageText(updatedText, { parse_mode: 'HTML' });
            
            console.log(`[Log] User ${userId} accepted for chat ${chatId}`);
            
        } else if (action === 'reject') {
            await ctx.telegram.declineChatJoinRequest(chatId, userId);
            
            const updatedText = `${ctx.callbackQuery.message.text}\n\n<b>Status:</b> Rejected ❌`;
            await ctx.editMessageText(updatedText, { parse_mode: 'HTML' });
            
            console.log(`[Log] User ${userId} rejected for chat ${chatId}`);
        }

        // Cache'dan tozalaymiz (agar foydalanuvchi keyin yana so'rov yuborsa, qabul qilishi uchun)
        requestCache.delete(cacheKey);

        // Loading aylanib qolmasligi uchun javob qaytaramiz
        await ctx.answerCbQuery(`Muvaffaqiyatli: ${action === 'accept' ? 'Qabul qilindi' : 'Rad etildi'}`);

    } catch (error) {
        console.error('[Error] adminActions handler xatosi:', error);
        
        // Agar so'rov allaqachon approve/reject bo'lgan bo'lsa yoki telegram API error bersa
        await ctx.answerCbQuery('Xatolik yuz berdi! (Balki foydalanuvchi so\'rovni bekor qilgandir)', { show_alert: true });
    }
};
