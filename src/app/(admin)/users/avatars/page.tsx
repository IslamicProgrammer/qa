import { api, HydrateClient } from "@/trpc/server";
import React from "react";
import AvatarsClient from "./client";

const Page = async () => {
  await api.avatars.getAll.prefetch();

  return (
    <HydrateClient>
      <AvatarsClient />
    </HydrateClient>
  );
};

export default Page;
