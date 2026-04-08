import { Injectable } from '@nestjs/common';

type Primitive = string | number | boolean | null;

@Injectable()
export class PrismaService {
  user = {
    findUnique: async (_args: unknown) => null,
    create: async ({ data }: { data: any }) => ({ id: data.email || 'user-id', ...data }),
  };

  order = {
    update: async ({ where, data }: { where: any; data: any }) => ({ id: where.paymentIntentId, ...data }),
  };

  auditLog = {
    create: async ({ data }: { data: { action: string; entity: string; userId?: string | null; newData?: Record<string, Primitive | object> } }) => ({
      id: 'audit-id',
      createdAt: new Date(),
      ...data,
    }),
  };
}
