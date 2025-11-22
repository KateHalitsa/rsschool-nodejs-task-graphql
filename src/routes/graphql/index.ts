import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {execute, graphql, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, parse, validate} from 'graphql';
import { PrismaClient, User } from '@prisma/client';
import {Mutations} from "./types/Mutations.js";
import {RootQuery} from "./types/RootQuery.js";
import depthLimit from "graphql-depth-limit";
import {createSubscribedToLoader, createUserLoader, createUserSubscribedToLoader} from "./loaders/userLoader.js";
import {GraphQLContext} from "./types/GraphQLContext.js";
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

        const { query, variables } = req.body;

        const document = parse(query);

        const errors = validate(schema, document, [depthLimit(5)]);

        if (errors.length > 0) {
            return {
                errors: errors.map(err => ({
                    message: err.message,
                })),
            };
        }

        return execute({
            schema,
            document,
            variableValues: variables,
            contextValue: {
                prisma,
                loaders: {
                    user: createUserLoader(prisma),
                    subscribedTo: createSubscribedToLoader(prisma),
                    userSubscribedTo: createUserSubscribedToLoader(prisma),
                },
            } as GraphQLContext,
        });
    },
  });
};
const schema = new GraphQLSchema({
    query: RootQuery as GraphQLObjectType,
    mutation: Mutations as GraphQLObjectType,
});

export default plugin;
