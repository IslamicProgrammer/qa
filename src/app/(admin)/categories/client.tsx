"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ImageIcon,
  Filter,
  MoreHorizontal,
  Eye,
} from "lucide-react";

import { api } from "@/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delate-confirmatin";
import Image from "next/image";
import { toast } from "react-toastify";

// Zod schema for filter form
const filterSchema = z.object({
  name: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

// Loading skeleton component
function CategoriesTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
          <Skeleton className="h-8 w-[80px]" />
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <ImageIcon className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">
        {hasFilter ? "No categories found" : "No categories yet"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {hasFilter
          ? "Try adjusting your search criteria to find what you're looking for."
          : "Get started by creating your first category to organize your Q&A content."}
      </p>
      {!hasFilter && (
        <Link href="/dashboard/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add First Category
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const router = useRouter();

  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: "",
    },
  });

  // Get filter value from form
  const filterName = form.watch("name");

  // tRPC query to fetch categories
  const {
    data: categories,
    refetch,
    isLoading,
    error,
  } = api.category.getAll.useQuery(undefined, {
    select: (categories) =>
      filterName
        ? categories.filter((category) =>
            category.name.toLowerCase().includes(filterName.toLowerCase()),
          )
        : categories,
  });

  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeletingId(null);
      toast.success("The category has been successfully deleted.");
    },
    onError: (error) => {
      setDeletingId(null);
      toast.error(error.message || "Failed to delete category.");
    },
  });

  // Handle row click for navigation
  const handleRowClick = (categoryId: number) => {
    router.push(`/dashboard/categories/${categoryId}`);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteCategory.mutate({ id });
  };

  const hasFilter = Boolean(filterName?.trim());
  const showEmptyState = !isLoading && (!categories || categories.length === 0);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage your Q&A categories</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-destructive/10 mb-4 rounded-full p-4">
              <Trash2 className="text-destructive h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Failed to load categories
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the categories.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your Q&A categories and organize content
          </p>
        </div>
        <Link href="/categories/new">
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <ImageIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                categories?.length || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Active categories in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Images</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                categories?.filter((cat) => cat.image).length || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Categories with images
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recently Added
            </CardTitle>
            <Plus className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : "3"}
            </div>
            <p className="text-muted-foreground text-xs">Added this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
          <CardDescription>
            Search and filter categories to find what you're looking for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="mb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Categories</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          placeholder="Search by category name..."
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Results Summary */}
          {!isLoading && categories && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                {hasFilter ? (
                  <>
                    Showing {categories.length} result
                    {categories.length !== 1 ? "s" : ""}
                    {filterName && ` for "${filterName}"`}
                  </>
                ) : (
                  `${categories.length} total categories`
                )}
              </div>
              {hasFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => form.reset()}
                  className="text-xs"
                >
                  Clear filter
                </Button>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && <CategoriesTableSkeleton />}

          {/* Empty State */}
          {showEmptyState && <EmptyState hasFilter={hasFilter} />}

          {/* Categories Table */}
          {!isLoading && categories && categories.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-32">Image</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(category.id)}
                    >
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        #{category.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={category.image || ""}
                              alt={category.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {category.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-muted-foreground text-sm">
                              Category • Created recently
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {category.image ? (
                          <div className="relative">
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              className="h-10 w-10 rounded-md border object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed">
                            <ImageIcon className="text-muted-foreground h-4 w-4" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(category.id);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/dashboard/categories/${category.id}/edit`,
                                );
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DeleteConfirmationDialog
                                title={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                                onConfirm={() => handleDelete(category.id)}
                                trigger={
                                  <span className="flex w-full items-center">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </span>
                                }
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
