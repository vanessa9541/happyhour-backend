const Order = require('../models/Order');

const deleteOldOrders = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const result = await Order.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } });
    console.log(`🧹 ${result.deletedCount} commandes supprimées automatiquement`);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression automatique :", error);
  }
};

module.exports = deleteOldOrders;
