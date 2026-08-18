export function Pagination(
  page: number | undefined,
  limit: number | undefined,
) {
  const safeLimit = limit ?? 20;
  const safePage = page ?? 1;
  const skip = (safePage - 1) * safeLimit;
  return { skip, limit: safeLimit, page: safePage };
}
