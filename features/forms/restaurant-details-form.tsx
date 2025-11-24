"use client";

import { Loader2 } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

import { AddressAutocomplete } from "@/components/ui/forms/address-autocomplete";
import { Button } from "@/components/ui/forms/button";
import { CategoryMultiSelect } from "@/components/ui/forms/category-multiselect";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import ImageUploadDropzone from "@/components/ui/forms/image-upload-drop-zone";
import { Input } from "@/components/ui/forms/input";
import { Textarea } from "@/components/ui/forms/textarea";
import { ThemePicker } from "@/features/theme/theme-picker";
import { RestaurantFormData } from "@/types/restaurant/Create";

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
  console.log(form.formState.errors);
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

        {/* ADDRESS */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormDescription>
                Search and select your restaurant&apos;s address
              </FormDescription>
              <FormControl>
                <AddressAutocomplete
                  value={field.value}
                  onSelect={(address) => {
                    field.onChange(address);
                  }}
                  placeholder="Search for an address..."
                  debounceMs={300}
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

        {/* CUISINES */}
        <FormField
          control={form.control}
          name="category_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuisines</FormLabel>
              <FormDescription>
                Search and select cuisines that apply to this restaurant
              </FormDescription>
              <FormControl>
                <CategoryMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  type="cuisine"
                  placeholder="Select cuisines..."
                />
              </FormControl>
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
          <Button type="submit" disabled={isPending} className="flex-1">
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
