export const slugify = (name: string) =>
  name
    .replace(/[^a-z\s:_*-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .trim();
