import prisma from "@/lib/prisma";

type AnyWhere = Record<string, any>;

/**
 * Get count of records for any Prisma model.
 * Optionally pass a `where` filter for scoped counts.
 *
 * Example: await getModelCount("movie");
 * Example: await getModelCount("career", { categoryId: "abc" });
 */
export async function getModelCount(
    modelKey: keyof typeof prisma,
    where?: AnyWhere
): Promise<number> {
    const delegate = (prisma as any)[modelKey];

    if (!delegate?.count) {
        throw new Error(`Invalid model key: ${String(modelKey)}`);
    }

    return delegate.count({ where });
}

/**
 * Get the next order value for any model by doing count + 1.
 * Example: await getNextOrder("movie");
 */
export async function getNextOrder(
    modelKey: keyof typeof prisma,
    where?: AnyWhere
): Promise<number> {
    const count = await getModelCount(modelKey, where);
    return count + 1;
}
