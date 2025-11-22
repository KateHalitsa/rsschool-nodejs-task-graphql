import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLList } from "graphql";
import  { ProfileType } from "./Profile.js";
import { PostType } from "./Post.js";
import { UUIDType } from "./uuid.js";
import { PrismaClient } from "@prisma/client";
import {GraphQLContext} from "./GraphQLContext.js";

export const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        profile: {
            type: ProfileType as unknown as GraphQLObjectType,
            resolve: async (
                parent: { id: string },
                _args: unknown,
                context: GraphQLContext
            ) => context.prisma.profile.findUnique({ where: { userId: parent.id } }),
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (
                parent: { id: string },
                _args: unknown,
                context: GraphQLContext
            ) => {
                return context.prisma.post.findMany({ where: { authorId: parent.id } });
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: async (
                parent: { id: string },
                _args: unknown,
                context: GraphQLContext
            )=> {
                return context.loaders.userSubscribedTo.load(parent.id);
            },
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: async (
                parent: { id: string },
                _args: unknown,
                context: GraphQLContext
            ) => context.loaders.subscribedTo.load(parent.id),
        },
    }),
});
