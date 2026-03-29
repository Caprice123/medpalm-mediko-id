import prisma from '../prisma/client.js';

export const injectRemainingQuota = (req, res, next) => {
  const wrap = (original) => async function (body) {
    try {
      const userId = req.user?.id;
      if (userId) {
        const now = new Date();
        const buckets = await prisma.user_credits.findMany({
          where: { user_id: userId }
        });
        const permanentBalance = buckets
          .filter(b => b.credit_type === 'permanent')
          .reduce((sum, b) => sum + parseFloat(b.balance), 0);
        const expiringBalance = buckets
          .filter(b => b.credit_type === 'expiring' && b.balance > 0 && b.expires_at && new Date(b.expires_at) > now)
          .reduce((sum, b) => sum + parseFloat(b.balance), 0);
        res.setHeader("X-Remaining-Quota", permanentBalance + expiringBalance);
        res.setHeader("X-Permanent-Quota", permanentBalance);
        res.setHeader("X-Expiring-Quota", expiringBalance);
      }
    } catch (error) {
      console.error("Error fetching remaining quota:", error);
      res.setHeader("X-Remaining-Quota", "error");
    }
    return original.call(this, body);
  };

  res.json = wrap(res.json.bind(res));
  res.send = wrap(res.send.bind(res));

  next();
};