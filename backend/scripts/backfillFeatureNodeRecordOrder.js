import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const RECORD_TYPES = ['3d_atlas', 'anatomy_quiz'];

async function main() {
  try {
    let totalUpdated = 0;

    for (const recordType of RECORD_TYPES) {
      const groups = await prisma.feature_node_records.groupBy({
        by: ['node_id'],
        where: { record_type: recordType },
        _count: { id: true },
      });

      for (const { node_id } of groups) {
        const records = await prisma.feature_node_records.findMany({
          where: { node_id, record_type: recordType, order: null },
          orderBy: { id: 'asc' },
          select: { id: true },
        });
        if (!records.length) continue;

        const { _max } = await prisma.feature_node_records.aggregate({
          where: { node_id, record_type: recordType },
          _max: { order: true },
        });
        let nextOrder = (_max.order ?? -1) + 1;

        await prisma.$transaction(
          records.map(({ id }) => prisma.feature_node_records.update({ where: { id }, data: { order: nextOrder++ } }))
        );
        totalUpdated += records.length;
      }
    }

    console.log(`Backfilled order for ${totalUpdated} feature_node_records rows (3d_atlas + anatomy_quiz)`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
