import {GraphQLObjectType, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLList} from "graphql";
import { ProfileType } from "./Profile.js";
import {PrismaClient} from "@prisma/client";


export const MemberTypeIdEnum = new GraphQLEnumType({
    name: "MemberTypeId",
    values: {
        BASIC: { value: "BASIC" },
        BUSINESS: { value: "BUSINESS" }
    }
});


export const MemberType = new GraphQLObjectType({
    name: "MemberType",
    fields: () => ({
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
        discount: { type: new GraphQLNonNull(GraphQLFloat) },
        postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
        profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async (
                parent: { id: string },
                _args: unknown,
                context: { prisma: PrismaClient }
            ) => {
                return context.prisma.profile.findMany({
                    where: { memberTypeId: parent.id },
                });
            },
        },
    }),
});
