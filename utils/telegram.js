// Duplicate requestlarni saqlash uchun cache
const requestCache = new Map();

// Tasdiqdan o'tmagan foydalanuvchilarni vaqtincha saqlash uchun cache
const pendingVerifications = new Map();

module.exports = {
    requestCache,
    pendingVerifications
};
