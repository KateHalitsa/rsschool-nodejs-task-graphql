import DataLoader from 'dataloader';
import { PrismaClient, User } from '@prisma/client';

export interface GraphQLLoaders {
    user: DataLoader<string, User>;
    subscribedTo: DataLoader<string, User[]>;
    userSubscribedTo: DataLoader<string, User[]>;
}

export interface GraphQLContext {
    prisma: PrismaClient;
    loaders: GraphQLLoaders;
}
