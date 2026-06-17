/** Bounded-concurrency batch processor for independent async work. */
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];

  // Intentional sequential await-in-loop: each batch must settle before the
  // next starts so concurrency stays bounded to `batchSize` (avoids hammering
  // the API). Parallelizing across batches would defeat the rate limit.
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item, index) => processor(item, i + index)),
    );
    results.push(...batchResults);
  }

  return results;
}
