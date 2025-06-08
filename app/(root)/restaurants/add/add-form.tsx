"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { Plus, X, Loader2 } from "lucide-react";
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
import { createRestaurant } from "@/app/actions/restaurant/create";
import { BasicNotificationBody } from "@/components/ui/basic-notification";
import {
  RestaurantFormData,
  RestaurantSchema,
} from "@/types/restaurants/Create";
import { ThemePicker } from "@/components/theme/theme-picker";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export function RestaurantForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInputs, setImageInputs] = useState<string[]>([""]);
  const { openNotification } = useNotification();

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: isLoadingCategories,
    mutate: mutateCategories,
  } = useSWR<Category[]>("restaurants/categories", {
    onError: () => {
      openNotification(
        <BasicNotificationBody
          title="Error"
          description="Failed to load categories. Please try again."
          variant="error"
        />,
      );
    },
  });

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(RestaurantSchema),
    defaultValues: {
      name: "",
      description: "",
      theme_id: "b6c52d55-ddd1-4d2c-a9af-49c0605e7e2e",
      //   address: "",
      images: [],
      category_ids: [],
    },
  });

  const addImageInput = () => {
    setImageInputs([...imageInputs, ""]);
  };

  const removeImageInput = (index: number) => {
    if (imageInputs.length > 1) {
      const newInputs = imageInputs.filter((_, i) => i !== index);
      setImageInputs(newInputs);

      // Update form values
      const currentImages = form.getValues("images");
      const newImages = currentImages.filter((_, i) => i !== index);
      form.setValue("images", newImages);
    }
  };

  const updateImageInput = (index: number, value: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = value;
    setImageInputs(newInputs);

    // Update form values
    const validImages = newInputs.filter((img) => img.trim() !== "");
    form.setValue("images", validImages);
  };

  const onSubmit = async (data: RestaurantFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createRestaurant(data);

      if (result.success) {
        openNotification(
          <BasicNotificationBody
            title="Success"
            description="Restaurant created successfully!"
            variant="success"
          />,
        );
        form.reset();
        setImageInputs([""]);
      } else {
        openNotification(
          <BasicNotificationBody
            title="Error"
            description={result.error || "Failed to create restaurant"}
            variant="error"
          />,
        );
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      openNotification(
        <BasicNotificationBody
          title="Error"
          description="An unexpected error occurred"
          variant="error"
        />,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryLoadCategories = () => {
    mutateCategories();
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

        {/* <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter restaurant address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <FormField
          control={form.control}
          name="theme_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter theme UUID (e.g., 20260cfc-d1b6-47c0-8946-01f0f238eaeb)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the UUID of the theme for this restaurant
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="space-y-4">
          <FormLabel>Restaurant Images</FormLabel>
          <FormDescription>Add URLs for restaurant images</FormDescription>
          {imageInputs.map((imageUrl, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => updateImageInput(index, e.target.value)}
                className="flex-1"
              />
              {imageInputs.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeImageInput(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addImageInput}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Image
          </Button>
          {form.formState.errors.images && (
            <p className="text-destructive text-sm font-medium">
              {form.formState.errors.images.message}
            </p>
          )}
        </div>

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

        <ThemePicker />

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setImageInputs([""]);
            }}
            className="flex-1"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoadingCategories}
            className="flex-1"
          >
            {isSubmitting ? (
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
