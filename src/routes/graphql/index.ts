import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {graphql, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';
import { PrismaClient, User } from '@prisma/client';
import {Mutations} from "./types/Mutations.js";
import {RootQuery} from "./types/RootQuery.js";
const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
       return graphql({
           schema,
           source: req.body.query,
           variableValues: req.body.variables,
           contextValue: { prisma: prisma }}
       );
    },
  });
};
const schema = new GraphQLSchema({
    query: RootQuery as GraphQLObjectType,
    mutation: Mutations as GraphQLObjectType,
});

export default plugin;
