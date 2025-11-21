import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {execute, graphql, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, parse, validate} from 'graphql';
import { PrismaClient, User } from '@prisma/client';
import {Mutations} from "./types/Mutations.js";
import {RootQuery} from "./types/RootQuery.js";
import depthLimit from "graphql-depth-limit";
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

        // 1. Парсим запрос
        const document = parse(query);

        // 2. Применяем правила валидации глубины
        const errors = validate(schema, document, [depthLimit(5)]);

        // 3. Возвращаем ошибки, если глубина превышена
        if (errors.length > 0) {
            return {
                errors: errors.map(err => ({
                    message: err.message,
                })),
            };
        }

        // 4. Выполняем запрос
        return execute({
            schema,
            document,
            variableValues: variables,
            contextValue: { prisma },
        });
    },
  });
};
const schema = new GraphQLSchema({
    query: RootQuery as GraphQLObjectType,
    mutation: Mutations as GraphQLObjectType,
});

export default plugin;
