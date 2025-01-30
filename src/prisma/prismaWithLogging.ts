import { DbAction, Prisma, PrismaClient } from '@prisma/client';

const prismaWithLogging = new PrismaClient().$extends({
  name: 'Logging',
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        //BUG: If we call update method and the id is not exist it will drop an error
        if (
          model !== 'AuditLog' &&
          Object.values(DbAction).includes(operation.toUpperCase() as DbAction)
        ) {
          const result = query(args);
          //TODO: Adds userId to the audit log
          await result.then(async res => {
            if (!res) return;
            let id = -1;
            if (res && typeof res === 'object' && 'id' in res && res.id) id = res.id;
            await prismaWithLogging.auditLog.create({
              data: {
                userId: -1,
                tableName: model,
                recordId: id,
                action: operation.toUpperCase() as DbAction,
                newState: operation === 'delete' ? Prisma.DbNull : JSON.stringify(res),
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
