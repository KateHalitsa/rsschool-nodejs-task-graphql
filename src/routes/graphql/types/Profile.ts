import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from "graphql";
import { MemberType } from "./MemberType.js";
import { PrismaClient } from "@prisma/client";
import {UUIDType} from "./uuid.js";
import {GraphQLContext} from "./GraphQLContext.js";

export const ProfileType = new GraphQLObjectType({
    name: "Profile",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberType: {
            type: new GraphQLNonNull(MemberType),
            resolve: async (
                parent: { memberTypeId: string },
                _args: unknown,
                context: GraphQLContext
            ) => {
                return context.prisma.memberType.findUnique({
                    where: { id: parent.memberTypeId },
                });
            },
        },
    }),
});
