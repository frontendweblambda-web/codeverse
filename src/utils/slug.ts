export const slugify = (name: string) =>
  name.replace(/\s+/, "-").toLowerCase().trim();
