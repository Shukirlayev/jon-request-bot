// Statistika va admin sozlamalari (Tugmalar orqali boshqariladi)
const state = {
    stats: {
        totalRequests: 0,
        approved: 0,
        rejected: 0,
        spamBlocked: 0
    },
    settings: {
        autoApprove: false,   // Avtomatik qabul qilish
        forceSubscribe: true  // Kanalga majburiy a'zolik
    },
    // So'rovlarni vaqtincha saqlab turuvchi xotira
    pendingRequests: new Map() 
};

module.exports = state;
