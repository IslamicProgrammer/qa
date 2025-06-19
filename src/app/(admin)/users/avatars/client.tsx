"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
  Users,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

// Zod schema for filter form
const filterSchema = z.object({
  search: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

// Zod schema for create avatar form
const createAvatarSchema = z.object({
  url: z.string().url("Please enter a valid image URL"),
});

type CreateAvatarFormValues = z.infer<typeof createAvatarSchema>;

// Loading skeleton component
function AvatarsTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-3 w-[150px]" />
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
        <Users className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">
        {hasFilter ? "No avatars found" : "No avatars yet"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {hasFilter
          ? "Try adjusting your search criteria to find what you're looking for."
          : "Get started by adding your first avatar for users to choose from."}
      </p>
    </div>
  );
}

// Create Avatar Dialog Component
function CreateAvatarDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  const form = useForm<CreateAvatarFormValues>({
    resolver: zodResolver(createAvatarSchema),
    defaultValues: {
      url: "",
    },
  });

  const createAvatar = api.avatars.create.useMutation({
    onSuccess: () => {
      toast.success("Avatar created successfully.");
      form.reset();
      setPreviewUrl("");
      setImageError(false);
      setOpen(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create avatar.");
    },
  });

  const onSubmit = async (data: CreateAvatarFormValues) => {
    console.log("data: ", data);
    await createAvatar.mutateAsync({
      url: data.url,
    });
  };

  const watchedUrl = form.watch("url");

  // Update preview when URL changes
  useState(() => {
    if (watchedUrl && watchedUrl !== previewUrl) {
      setPreviewUrl(watchedUrl);
      setImageError(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Avatar</DialogTitle>
          <DialogDescription>
            Add a new avatar image that users can choose for their profiles.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/avatar.jpg"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-muted-foreground text-xs">
                    Enter a valid image URL. Recommended size: 400x400px
                  </div>
                </FormItem>
              )}
            />

            {/* Image Preview */}
            {previewUrl && (
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="ring-primary/20 h-20 w-20 ring-2">
                    <AvatarImage
                      src={previewUrl || "/placeholder.svg"}
                      alt="Avatar preview"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                    <AvatarFallback className="bg-muted">
                      {imageError ? (
                        <ImageIcon className="text-muted-foreground h-8 w-8" />
                      ) : (
                        "..."
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {!imageError && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                      variant="secondary"
                    >
                      <Eye className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createAvatar.isPending}>
                {createAvatar.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  "Create Avatar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AvatarsClient() {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Initialize filter form
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
    },
  });

  // Get filter value from form
  const filterSearch = form.watch("search");

  // tRPC query to fetch avatars
  const {
    data: avatars,
    refetch,
    isLoading,
    error,
  } = api.avatars.getAll.useQuery(undefined, {
    select: (avatars) =>
      filterSearch
        ? avatars.filter((avatar) =>
            avatar.url.toLowerCase().includes(filterSearch.toLowerCase()),
          )
        : avatars,
  });

  const deleteAvatar = api.avatars.delete.useMutation({
    onSuccess: async () => {
      await refetch();

      setDeletingId(null);
      toast.success("The avatar has been successfully deleted.");
    },
    onError: (error) => {
      setDeletingId(null);
      toast.error(error.message || "Failed to delete avatar.");
    },
  });

  const handleDelete = (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this avatar? This action cannot be undone.",
      )
    ) {
      setDeletingId(id);
      deleteAvatar.mutate({ id });
    }
  };

  const hasFilter = Boolean(filterSearch?.trim());
  const showEmptyState = !isLoading && (!avatars || avatars.length === 0);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Avatars</h1>
            <p className="text-muted-foreground">Manage user avatar options</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-destructive/10 mb-4 rounded-full p-4">
              <Trash2 className="text-destructive h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Failed to load avatars
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the avatars.
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mb-4"
            >
              Try Again
            </Button>
            <CreateAvatarDialog onSuccess={refetch} />
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
          <h1 className="text-3xl font-bold tracking-tight">Avatars</h1>
          <p className="text-muted-foreground">
            Manage user avatar options and profile images
          </p>
        </div>
        <CreateAvatarDialog onSuccess={refetch} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Avatars</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                avatars?.length || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Available avatar options
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : "24"}
            </div>
            <p className="text-muted-foreground text-xs">Users with avatars</p>
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
              {isLoading ? <Skeleton className="h-8 w-16" /> : "5"}
            </div>
            <p className="text-muted-foreground text-xs">Added this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
          <CardDescription>Search through available avatars</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="mb-6">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Avatars</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          placeholder="Search by image URL..."
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
          {!isLoading && avatars && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                {hasFilter ? (
                  <>
                    Showing {avatars.length} result
                    {avatars.length !== 1 ? "s" : ""}
                    {filterSearch && ` for "${filterSearch}"`}
                  </>
                ) : (
                  `${avatars.length} total avatars`
                )}
              </div>
              {hasFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => form.reset()}
                  className="text-xs"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && <AvatarsTableSkeleton />}

          {/* Empty State */}
          {showEmptyState && <EmptyState hasFilter={hasFilter} />}

          {/* Avatars Table */}
          {!isLoading && avatars && avatars.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Image URL</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avatars.map((avatar) => (
                    <TableRow
                      key={avatar.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        #{avatar.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="ring-primary/10 h-10 w-10 ring-2">
                            <AvatarImage
                              src={avatar.url || "/placeholder.svg"}
                              alt={`Avatar ${avatar.id}`}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {avatar.id}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              Avatar #{avatar.id}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              Profile image
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="bg-muted max-w-xs truncate rounded px-2 py-1 font-mono text-sm">
                          {avatar.url}
                        </div>
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
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => window.open(avatar.url, "_blank")}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Full Size
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(avatar.url)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Copy URL
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(avatar.id)}
                              disabled={deletingId === avatar.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deletingId === avatar.id
                                ? "Deleting..."
                                : "Delete"}
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
