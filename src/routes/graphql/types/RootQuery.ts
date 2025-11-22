import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from "graphql";
import { UserType } from "./User.js";
import { PostType } from "./Post.js";
import { ProfileType } from "./Profile.js";
import { MemberType, MemberTypeIdEnum } from "./MemberType.js";
import { UUIDType } from "./uuid.js";
import { PrismaClient } from "@prisma/client";
import {GraphQLContext} from "./GraphQLContext.js";

export const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async (_parent, _args, context: GraphQLContext) => {
                return context.prisma.memberType.findMany();
            }
        },
        memberType: {
            type: MemberType as unknown as GraphQLObjectType,
            args: {
                id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
            },
            resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
                return context.prisma.memberType.findUnique({ where: { id: args.id } });
            },
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: async (_parent, _args, context: GraphQLContext) => {
                return context.prisma.user.findMany();

            },
        },
        user: {
            type: UserType as unknown as GraphQLObjectType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
                return context.prisma.user.findUnique({ where: { id: args.id } });
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (_parent, _args, context: GraphQLContext) => {
                return context.prisma.post.findMany();
            },
        },
        post: {
            type: PostType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
                return context.prisma.post.findUnique({ where: { id: args.id } });
            },
        },
        profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async (_parent, _args, context: GraphQLContext) => {
                return context.prisma.profile.findMany();
            },
        },
        profile: {
            type: ProfileType as unknown as GraphQLObjectType,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_parent, args: { id: string }, context: GraphQLContext) => {
                return context.prisma.profile.findUnique({ where: { id: args.id } });

            },
        },
    }),
});
