"use client";

import {
  Facebook,
  Instagram,
  Loader2,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
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
        {/* GENERAL INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Information</h3>

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

          {/* PRICE RANGE */}
          <FormField
            control={form.control}
            name="priceRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Range</FormLabel>
                <FormDescription>
                  Select the typical price range for this restaurant
                </FormDescription>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <DollarSign className="text-muted-foreground h-4 w-4" />
                      <SelectValue placeholder="Select a price range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">$ - Budget Friendly</SelectItem>
                    <SelectItem value="mid">$$ - Moderate</SelectItem>
                    <SelectItem value="high">$$$ - Fine Dining</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* MEDIA & STYLING */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Media & Styling</h3>

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
        </div>

        {/* LOCATION & CONTACT */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location & Contact</h3>

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

          {/* CONTACT INFORMATION */}

          {/* PHONE NUMBER */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      placeholder="+48 555 123 123"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* FACEBOOK URL */}
          <FormField
            control={form.control}
            name="facebookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Facebook className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      placeholder="https://facebook.com/restaurant"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* INSTAGRAM URL */}
          <FormField
            control={form.control}
            name="instagramUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Instagram className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      placeholder="https://instagram.com/restaurant"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* RESERVATION URL */}
          <FormField
            control={form.control}
            name="reservationUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reservation Link</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      placeholder="https://opentable.com/restaurant"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
