import prisma from '../prisma/client.js';

export const injectRemainingQuota = (req, res, next) => {
  const wrap = (original) => async function (body) {
    try {
      const userId = req.user?.id;
      if (userId) {
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId },
          select: { balance: true }
        });
        res.setHeader("X-Remaining-Quota", userCredit?.balance ?? 0);
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