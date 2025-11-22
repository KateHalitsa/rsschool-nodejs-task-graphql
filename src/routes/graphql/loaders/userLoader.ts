import DataLoader from 'dataloader';
import { PrismaClient, User } from '@prisma/client';
// DataLoader для пользователей по ID
export const createUserLoader = (prisma: PrismaClient) =>
    new DataLoader<string, User>(async (ids) => {
        const users = await prisma.user.findMany({
            where: { id: { in: ids as string[] } },
        });
        // сортируем пользователей по переданным id
        const usersMap = Object.fromEntries(users.map(u => [u.id, u]));
        return ids.map(id => usersMap[id]);
    });

// DataLoader для подписок
export const createSubscribedToLoader = (prisma: PrismaClient) =>
    new DataLoader<string, User[]>(async (authorIds) => {
        const subs = await prisma.subscribersOnAuthors.findMany({
            where: { authorId: { in: authorIds as string[] } },
            include: { subscriber: true },
        });

        const map = authorIds.reduce<Record<string, User[]>>((acc, id) => {
            acc[id] = [];
            return acc;
        }, {});

        for (const s of subs) {
            map[s.authorId].push(s.subscriber);
        }

        return authorIds.map(id => map[id]);
    });

// DataLoader для авторов, на которых подписан пользователь
export const createUserSubscribedToLoader = (prisma: PrismaClient) =>
    new DataLoader<string, User[]>(async (subscriberIds) => {
        const subs = await prisma.subscribersOnAuthors.findMany({
            where: { subscriberId: { in: subscriberIds as string[] } },
            include: { author: true },
        });

        const map = subscriberIds.reduce<Record<string, User[]>>((acc, id) => {
            acc[id] = [];
            return acc;
        }, {});
        for (const s of subs) {
            map[s.subscriberId].push(s.author);
        }

        return subscriberIds.map(id => map[id]);
    });
/*export function createUserLoader(prisma: PrismaClient) {
    return new DataLoader<string, User | null>(async (ids: readonly string[]) => {
        const users = await prisma.user.findMany({
            where: { id: { in: ids as string[] } }
        });

        const map = new Map<string, User>();
        users.forEach(u => map.set(u.id, u));

        return ids.map(id => map.get(id) ?? null);
    });
}*/
