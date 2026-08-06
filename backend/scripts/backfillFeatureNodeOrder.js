import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const parents = await prisma.feature_nodes.groupBy({
      by: ['parent_id'],
      where: { parent_id: { not: null } },
      _count: { id: true },
    });

    let totalUpdated = 0;

    for (const { parent_id } of parents) {
      const children = await prisma.feature_nodes.findMany({
        where: { parent_id, order: null },
        orderBy: { id: 'asc' },
        select: { id: true },
      });
      if (!children.length) continue;

      const { _max } = await prisma.feature_nodes.aggregate({
        where: { parent_id },
        _max: { order: true },
      });
      let nextOrder = (_max.order ?? -1) + 1;

      await prisma.$transaction(
        children.map(({ id }) => prisma.feature_nodes.update({ where: { id }, data: { order: nextOrder++ } }))
      );
      totalUpdated += children.length;
    }

    console.log(`Backfilled order for ${totalUpdated} feature_nodes across ${parents.length} parents`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
