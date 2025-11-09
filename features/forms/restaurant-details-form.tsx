"use client";

import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { Textarea } from "@/components/ui/forms/textarea";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { Button } from "@/components/ui/forms/button";
import { ThemePicker } from "@/features/theme/theme-picker";
import ImageUploadDropzone from "@/components/ui/forms/image-upload-drop-zone";
import { useCategoriesQuery } from "@/hooks/api/categories/useCategories";
import { RestaurantFormData } from "@/types/restaurant/Create";
import { UseFormReturn } from "react-hook-form";

interface RestaurantFormFieldsProps {
  form: UseFormReturn<RestaurantFormData>;
  onSubmit: (data: RestaurantFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function RestaurantDetailsForm({
  form,
  onSubmit,
  isPending,
  submitLabel = "Submit",
}: RestaurantFormFieldsProps) {
  const {
    data: categories = [],
    error: categoriesError,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useCategoriesQuery();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* NAME */}
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

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your restaurant..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IMAGES */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Restaurant Images</FormLabel>
              <ImageUploadDropzone />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CATEGORIES */}
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
                    onClick={() => refetchCategories()}
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
                      render={({ field }) => (
                        <FormItem
                          className="flex flex-row items-start space-y-0 space-x-3"
                          key={category.id}
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
                      )}
                    />
                  ))}
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        {/* THEME PICKER */}
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

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
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
                Processing...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
