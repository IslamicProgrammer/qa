import { api, HydrateClient } from "@/trpc/server";
import React from "react";
import PlayersClient from "./client";

const Page = async () => {
  await api.players.getAll.prefetch();

  return (
    <HydrateClient>
      <PlayersClient />
    </HydrateClient>
  );
};

export default Page;
