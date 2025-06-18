"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNotification } from "@/context/NotificationBar";
import { BasicNotificationBody } from "@/components/ui/basic-notification";
import {
  RestaurantFormData,
  RestaurantFormSchema,
} from "@/types/restaurant/Create";
import { ThemePicker } from "@/components/theme/theme-picker";
import { useCategoriesQuery } from "@/hooks/api/categories/useCategories";
import { useCreateRestaurant } from "@/hooks/api/restaurant/useCreateRestaurant";
import ImageUploadDropzone from "@/components/ui/image-upload-drop-zone";

export function RestaurantForm() {
  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync, isPending } = useCreateRestaurant();
  const { openNotification } = useNotification();

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useCategoriesQuery();

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(RestaurantFormSchema),
    defaultValues: {
      name: "",
      description: "",
      theme_id: "",
      //   address: "",
      images: [],
      category_ids: [],
    },
  });

  useEffect(() => {
    form.setValue("images", files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      await mutateAsync(data);

      openNotification(
        <BasicNotificationBody
          title="Success"
          description="Restaurant created successfully!"
          variant="success"
        />,
      );
      form.reset();
      setFiles([]);
    } catch {
      openNotification(
        <BasicNotificationBody
          title="Error"
          description="An unexpected error occurred"
          variant="error"
        />,
      );
    }
  };

  const retryLoadCategories = () => {
    refetchCategories();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter restaurant name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your restaurant..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <div className="space-y-2">
                <FormLabel>Restaurant Images</FormLabel>
                <ImageUploadDropzone files={files} setFiles={setFiles} />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_ids"
          render={() => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormDescription>
                Select the categories that apply to this restaurant
              </FormDescription>
              {isLoadingCategories ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    Loading categories...
                  </span>
                </div>
              ) : categoriesError ? (
                <div className="space-y-2 py-4">
                  <p className="text-destructive text-sm">
                    Failed to load categories
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={retryLoadCategories}
                  >
                    Retry
                  </Button>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-muted-foreground py-4 text-sm">
                  No categories available
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
                  {categories.map((category) => (
                    <FormField
                      key={category.id}
                      control={form.control}
                      name="category_ids"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={category.id}
                            className="flex flex-row items-start space-y-0 space-x-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        category.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== category.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {category.name}
                              {category.description && (
                                <span className="text-muted-foreground block text-xs">
                                  {category.description}
                                </span>
                              )}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme_id"
          render={() => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <ThemePicker
                  onChange={({ id }) =>
                    form.setValue("theme_id", id, { shouldValidate: true })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setFiles([]);
            }}
            className="flex-1"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={isPending || isLoadingCategories}
            className="flex-1"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Restaurant"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
