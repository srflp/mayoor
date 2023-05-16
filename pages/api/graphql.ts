import { ApolloServer } from "apollo-server-micro";
import { PageConfig } from "next";
import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createContext } from "@backend/context";
import { schema } from "@backend/schema";

const apolloServer = new ApolloServer({
  // cache: 'bounded',
  context: createContext,
  schema,
});

const startServer = apolloServer.start();

const handler = async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};

// // Apollo Server Micro takes care of body parsing
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default handler;
