import { api, HydrateClient } from "@/trpc/server";
import CategoriesClient from "./client";

export default async function CategoriesPage() {
  await api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <CategoriesClient />
    </HydrateClient>
  );
}
