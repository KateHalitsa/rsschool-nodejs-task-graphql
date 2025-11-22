import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";

export const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        /*
        author: {
          type: UserType,
          resolve: async (parent: { authorId: string }, _args: unknown, context: { prisma: PrismaClient }) => {
            return context.prisma.user.findUnique({ where: { id: parent.authorId } });
          },
        }
        */
    }),
});
