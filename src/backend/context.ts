import { Prisma, PrismaClient } from "@prisma/client";
import { VercelRequest } from "@vercel/node";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";

import { getUserContext } from "./auth";

const redis = new Redis(); // Uses default options for Redis connection

const prisma = new PrismaClient({ log: ["warn"] });

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  // models: [
  //   { model: "User", excludeMethods: ["findMany"] },
  //   { model: "Post", cacheTime: 180, cacheKey: "article" },
  // ],
  storage: { type: "redis", options: { client: redis, invalidation: { referencesTTL: 1 } } },
  cacheTime: 1,
  // excludeModels: ["Product", "Cart"],
  // excludeMethods: ["count", "groupBy"],
  // onHit: (key) => {
  //   console.log("hit", key);
  // },
  // onMiss: (key) => {
  //   console.log("miss", key);
  // },
  // onError: (key) => {
  //   console.log("error", key);
  // },
});

prisma.$use(cacheMiddleware);


export type UserDetails = {
  id: string;
  email: string;
};

export type UserContext = {
  getCurrentUser: () => Promise<UserDetails>;
};
export interface Context {
  prisma: PrismaClient;
  user: UserContext;
}

export function createContext({ req }: { req: VercelRequest }): Context {
  return { prisma, user: getUserContext(req) };
}
