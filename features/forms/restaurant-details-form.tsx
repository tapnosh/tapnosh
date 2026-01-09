"use client";

import {
  Facebook,
  Instagram,
  Loader2,
  Phone,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { useTranslations } from "next-intl";
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
import { TranslatedFormMessage } from "@/components/ui/forms/translated-form-message";
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
  const tSections = useTranslations("restaurants.form.fields.sections");
  const tFields = useTranslations("restaurants.form.fields.fields");
  const tActions = useTranslations("restaurants.form.fields.actions");
  const tPriceRange = useTranslations("common.priceRange");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* GENERAL INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {tSections("generalInformation")}
          </h3>

          {/* NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("restaurantName.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tFields("restaurantName.placeholder")}
                    {...field}
                  />
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* DESCRIPTION */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={tFields("description.placeholder")}
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* CUISINES */}
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("cuisines.label")}</FormLabel>
                <FormDescription>{tFields("cuisines.helper")}</FormDescription>
                <FormControl>
                  <CategoryMultiSelect
                    value={field.value}
                    onChange={field.onChange}
                    type="cuisine"
                    placeholder={tFields("cuisines.placeholder")}
                  />
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* PRICE RANGE */}
          <FormField
            control={form.control}
            name="priceRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("priceRange.label")}</FormLabel>
                <FormDescription>
                  {tFields("priceRange.helper")}
                </FormDescription>
                <Select
                  key={field.value}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <DollarSign className="text-muted-foreground h-4 w-4" />
                      <SelectValue
                        placeholder={tFields("priceRange.placeholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">
                      $ - {tPriceRange("budgetFriendly")}
                    </SelectItem>
                    <SelectItem value="mid">
                      $$ - {tPriceRange("moderate")}
                    </SelectItem>
                    <SelectItem value="high">
                      $$$ - {tPriceRange("fineDining")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* MEDIA & STYLING */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{tSections("mediaStyling")}</h3>

          {/* IMAGES */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>{tFields("restaurantImages.label")}</FormLabel>
                <ImageUploadDropzone />
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* THEME PICKER */}
          <FormField
            control={form.control}
            name="theme_id"
            render={() => (
              <FormItem>
                <FormLabel>{tFields("theme.label")}</FormLabel>
                <FormControl>
                  <ThemePicker
                    onChange={({ id }) =>
                      form.setValue("theme_id", id, { shouldValidate: true })
                    }
                  />
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* LOCATION & CONTACT */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {tSections("locationContact")}
          </h3>

          {/* ADDRESS */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("address.label")}</FormLabel>
                <FormDescription>{tFields("address.helper")}</FormDescription>
                <FormControl>
                  <AddressAutocomplete
                    value={field.value}
                    onSelect={(address) => {
                      field.onChange(address);
                    }}
                    placeholder={tFields("address.searchPlaceholder")}
                    debounceMs={300}
                  />
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* OPERATING HOURS */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="openFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open From</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                      <Input type="time" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="openUntil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Until</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                      <Input type="time" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CONTACT INFORMATION */}

          {/* PHONE NUMBER */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("phoneNumber.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      placeholder={tFields("phoneNumber.placeholder")}
                      className="pl-9"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* FACEBOOK URL */}
          <FormField
            control={form.control}
            name="facebookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("facebook.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Facebook className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      placeholder={tFields("facebook.placeholder")}
                      className="pl-9"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* INSTAGRAM URL */}
          <FormField
            control={form.control}
            name="instagramUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("instagram.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Instagram className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      placeholder={tFields("instagram.placeholder")}
                      className="pl-9"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>
                <TranslatedFormMessage />
              </FormItem>
            )}
          />

          {/* RESERVATION URL */}
          <FormField
            control={form.control}
            name="reservationUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields("reservationLink.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      placeholder={tFields("reservationLink.placeholder")}
                      className="pl-9"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </div>
                </FormControl>
                <TranslatedFormMessage />
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
            {tActions("resetForm")}
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tActions("processing")}
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
