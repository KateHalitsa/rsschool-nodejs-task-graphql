import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "./User.js";
import { ProfileType } from "./Profile.js";
import { PostType } from "./Post.js";
import {
    CreateUserInput,
    ChangeUserInput,
    CreateProfileInput,
    ChangeProfileInput,
    CreatePostInput,
    ChangePostInput,
} from "./Inputs.js";
import { UUIDType } from "./uuid.js";
import { PrismaClient, Prisma } from "@prisma/client";
interface CreateProfileArgs {
    dto: Prisma.ProfileCreateInput;
}
interface ChangeProfileArgs {
    id: string;
    dto: Prisma.ProfileUpdateInput;
}

interface ChangePostArgs {
    id: string;
    dto: Prisma.PostUpdateInput;
}
export const Mutations = new GraphQLObjectType({
    name: "Mutations",
    fields: () => ({
        createUser: {
            type: UserType as unknown as GraphQLObjectType,
            args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
            resolve: async (_parent, args: { dto: { name: string; balance: number } }, context: { prisma: PrismaClient }) => {
                return context.prisma.user.create({ data: args.dto });
            },
        },
        changeUser: {
            type: UserType as unknown as GraphQLObjectType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeUserInput) },
            },
            resolve: async (_parent, args: { id: string; dto: { name?: string; balance?: number } }, context: { prisma: PrismaClient }) => {
                return context.prisma.user.update({ where: { id: args.id }, data: args.dto });
            },
        },
        deleteUser: {
            type: GraphQLString,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_parent, args: { id: string }, context: { prisma: PrismaClient }) => {
                await context.prisma.user.delete({ where: { id: args.id } });
                return "User deleted";
            },
        },

        createProfile: {
            type: ProfileType as unknown as GraphQLObjectType,
            args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
            resolve: async (
                _parent,
                args: CreateProfileArgs,
                context: { prisma: PrismaClient }
            ) => {
                return context.prisma.profile.create({ data: args.dto });
            },
        },
        changeProfile: {
            type: ProfileType as unknown as GraphQLObjectType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeProfileInput) }
            },
            resolve: async (_parent, args: ChangeProfileArgs, context: { prisma: PrismaClient }) => {
                return context.prisma.profile.update({ where: { id: args.id }, data: args.dto });
            },
        },
        deleteProfile: {
            type: GraphQLString,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_parent, args: { id: string }, context: { prisma: PrismaClient }) => {
                await context.prisma.profile.delete({ where: { id: args.id } });
                return "Profile deleted";
            },
        },

        createPost: {
            type: PostType,
            args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
            resolve: async (_parent, args: { dto: Prisma.PostCreateInput }, context: { prisma: PrismaClient }) => {
                return context.prisma.post.create({ data: args.dto });
            },
        },
        changePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangePostInput) }
            },
            resolve: async (_parent, args: ChangePostArgs, context: { prisma: PrismaClient }) => {
                return context.prisma.post.update({ where: { id: args.id }, data: args.dto });
            },
        },
        deletePost: {
            type: GraphQLString,
            args: { id: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_parent, args: { id: string }, context: { prisma: PrismaClient }) => {
                await context.prisma.post.delete({ where: { id: args.id } });
                return "Post deleted";
            },
        },

        subscribeTo: {
            type: GraphQLString,
            args: { userId: { type: new GraphQLNonNull(UUIDType) }, authorId: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_parent, args: { userId: string; authorId: string }, context: { prisma: PrismaClient }) => {
                await context.prisma.subscribersOnAuthors.create({ data: { subscriberId: args.userId, authorId: args.authorId } });
                return "Subscribed";
            },
        },
        unsubscribeFrom: {
            type: GraphQLString,
            args: { userId: { type: new GraphQLNonNull(UUIDType) }, authorId: { type: new GraphQLNonNull(UUIDType) } },
            resolve: async (_parent, args: { userId: string; authorId: string }, context: { prisma: PrismaClient }) => {
                await context.prisma.subscribersOnAuthors.delete({ where: { subscriberId_authorId: { subscriberId: args.userId, authorId: args.authorId } } });
                return "Unsubscribed";
            },
        },
    }),
});
