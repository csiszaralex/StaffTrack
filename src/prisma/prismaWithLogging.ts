import { DbAction, PrismaClient } from '@prisma/client';

const prismaWithLogging = new PrismaClient().$extends({
  name: 'Logging',
  query: {
    $allModels: {
      $allOperations({ operation, model, args, query }) {
        if (
          model !== 'AuditLog' &&
          Object.values(DbAction).includes(operation.toUpperCase() as DbAction)
        ) {
          const result = query(args);
          //TODO: Adds userId to the audit log
          result.then(async res => {
            let id = -1;
            if (res && typeof res === 'object' && 'id' in res && res.id) id = res.id;
            await prismaWithLogging.auditLog.create({
              data: {
                userId: -1,
                tableName: model,
                recordId: id,
                action: operation.toUpperCase() as DbAction,
                newState: operation === 'delete' ? null : JSON.parse(JSON.stringify(res)),
              },
            });
          });

          return result;
        } else {
          return query(args);
        }
      },
    },
  },
});

export { prismaWithLogging };
