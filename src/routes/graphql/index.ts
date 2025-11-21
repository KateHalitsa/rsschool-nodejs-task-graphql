import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {graphql, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';
import { PrismaClient, User } from '@prisma/client';
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
           contextValue: { prisma: fastify.prisma }}
       );
    },
  });
};
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name:'RootQuery',
    fields: {
        users: {
            type: new GraphQLList(GraphQLString), // упрощённо: список строк
            resolve: async (
                _parent: unknown,
                _args: unknown,
                context: { prisma: PrismaClient }
            ) => {
                const users = await context.prisma.user.findMany();
                return users.map((u) => u.name);
            }
        },
      testString: {
        type: GraphQLString,
        resolve: async ()=>{
          return "Hello world";
        }
      }
    }
  })
})
export default plugin;
