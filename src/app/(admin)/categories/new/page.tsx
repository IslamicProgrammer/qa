"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  LinkIcon,
  ImageIcon,
  Save,
  X,
  Eye,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";

// Zod schema for form validation
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),
  image: z.string().url("Invalid image URL").or(z.literal("")),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// Image preview component
function ImagePreview({ url, name }: { url: string; name: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!url || imageError) {
    return (
      <div className="border-muted-foreground/25 bg-muted/50 flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed">
        <div className="text-center">
          <ImageIcon className="text-muted-foreground/50 mx-auto h-8 w-8" />
          <p className="text-muted-foreground mt-2 text-xs">No preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-muted h-32 w-32 overflow-hidden rounded-lg border">
        {imageLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url || "/placeholder.svg"}
          alt={name || "Category preview"}
          className={`h-full w-full object-cover transition-opacity ${imageLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
      </div>
      {!imageLoading && !imageError && (
        <Badge
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          variant="secondary"
        >
          <Eye className="h-3 w-3" />
        </Badge>
      )}
    </div>
  );
}

export default function NewCategoryPage() {
  const router = useRouter();

  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  // Watch form values for real-time updates
  const watchedName = form.watch("name");
  const watchedImage = form.watch("image");

  // Update preview URL when image field changes
  useState(() => {
    setImagePreviewUrl(watchedImage);
  });

  // tRPC mutation for creating a category
  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      toast.success("Category created successfully.");
      router.push("/dashboard/categories");
    },
    onError: () => {
      toast.success("Failed.");
    },
  });

  // Form submission handler
  const onSubmit = async (data: CategoryFormValues) => {
    await createCategory.mutateAsync({
      name: data.name,
      image: data.image || undefined,
    });
  };

  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        router.push("/dashboard/categories");
      }
    } else {
      router.push("/dashboard/categories");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/categories">
              Categories
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/categories">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to categories</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Category
          </h1>
          <p className="text-muted-foreground">
            Add a new category to organize your Q&A content
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Category Details
              </CardTitle>
              <CardDescription>
                Enter the basic information for your new category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Category Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Category Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Prayer, Fasting, Charity..."
                            className="text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Choose a clear, descriptive name for your category (
                          {field.value.length}/50 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Image Section */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-medium">Category Image</h3>
                      <p className="text-muted-foreground text-sm">
                        Add an image to make your category more visually
                        appealing
                      </p>
                    </div>

                    <Tabs defaultValue="url" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="url"
                          className="flex items-center gap-2"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Image URL
                        </TabsTrigger>
                        <TabsTrigger
                          value="upload"
                          className="flex items-center gap-2"
                          disabled
                        >
                          <Upload className="h-4 w-4" />
                          Upload File
                          <Badge variant="secondary" className="ml-1 text-xs">
                            Soon
                          </Badge>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="url" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setImagePreviewUrl(e.target.value);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a valid image URL. The image will be
                                displayed as a preview.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="upload">
                        <Alert>
                          <Upload className="h-4 w-4" />
                          <AlertDescription>
                            File upload functionality is coming soon. For now,
                            please use an image URL.
                          </AlertDescription>
                        </Alert>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={createCategory.isPending}
                      className="min-w-32"
                    >
                      {createCategory.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Create Category
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>
                See how your category will appear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <ImagePreview url={imagePreviewUrl} name={watchedName} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium">
                    {watchedName || "Category Name"}
                  </h3>
                  <p className="text-muted-foreground text-sm">Category</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Category Naming</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Use clear, descriptive names</li>
                  <li>• Keep it concise (2-50 characters)</li>
                  <li>• Consider Islamic terminology</li>
                </ul>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Image Guidelines</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Use high-quality images</li>
                  <li>• Recommended: 400x400px</li>
                  <li>• Ensure appropriate content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
