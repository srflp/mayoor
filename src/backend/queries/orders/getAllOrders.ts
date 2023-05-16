import { queryField, arg, idArg, enumType } from "nexus";

import { paginationArgs, getPaginatedObjectType } from "../../utils/pagination";

import { OrderStatus } from "@backend/types";

export const GetAllOrders = queryField("getAllOrders", {
  type: getPaginatedObjectType("Order"),
  args: {
    ...paginationArgs,
    status: arg({ type: OrderStatus }),
    customerId: idArg(),
    orderByUrgency: enumType({ name: "OrderByArg", members: ["asc", "desc"] }),
  },
  resolve: async (
    _parent,
    { status, orderByUrgency, customerId, ...args },
    ctx
  ) => {
    const where = {
      status: status ?? undefined,
      customerId,
      deleted: false,
    };
    const [totalCount, items] = await ctx.prisma.$transaction(
      [
        ctx.prisma.order.count({
          where,
        }),
        ctx.prisma.order.findMany({
          take: args.first ?? undefined,
          skip: args.skip ?? undefined,
          where,
          orderBy: orderByUrgency
            ? { urgency: orderByUrgency }
            : { createdAt: "desc" },
        }),
      ]
    )

    return {
      totalCount: totalCount ?? 0,
      items,
    };
  },
});
