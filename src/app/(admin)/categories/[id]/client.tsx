"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import { useEffect } from "react";

// Zod schema for validation
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.string().url("Invalid image URL").or(z.literal("")),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function EditCategoryPage({
  categoryId,
}: {
  categoryId: string;
}) {
  const router = useRouter();
  const params = useParams();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const utils = api.useUtils();

  const { data } = api.category.getById.useQuery(
    { id: Number(categoryId) },
    {
      enabled: !!categoryId,
    },
  );

  useEffect(() => {
    console.log("categoruyDat: ", data);
    if (data) {
      form.setValue("name", data.name);
      form.setValue("image", data.image || "");
    }
  }, [data]);

  const updateCategory = api.category.update.useMutation({
    onSuccess: () => {
      toast.success("Category updated successfully!");
      utils.category.invalidate();
      router.push("/categories");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    await updateCategory.mutateAsync({
      id: +categoryId,
      name: data.name,
      image: data.image,
    });
  };

  return (
    <div className="bg-background rounded-xl p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Edit Category</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4">
            <Button type="submit" disabled={updateCategory.isPending}>
              Update Category
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/categories")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
