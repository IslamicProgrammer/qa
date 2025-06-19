import { api } from "@/trpc/server";
import React from "react";
import EditCategoryClient from "./client";

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await api.category.getById({ id: Number(id) });

  return <EditCategoryClient categoryId={id} />;
};

export default EditPage;
