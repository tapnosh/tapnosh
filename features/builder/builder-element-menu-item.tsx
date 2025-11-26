import { useFormContext, useWatch } from "react-hook-form";

import { CategoryMultiSelect } from "@/components/ui/forms/category-multiselect";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import ImageUploadDropzone from "@/components/ui/forms/image-upload-drop-zone";
import { Input } from "@/components/ui/forms/input";
import PriceInput from "@/components/ui/forms/price-input";
import { Textarea } from "@/components/ui/forms/textarea";
import { useBuilder } from "@/context/BuilderContext";
import { MenuItemCard } from "@/features/menu/menu-item";
import { Builder } from "@/types/builder/BuilderSchema";
import { MenuItem } from "@/types/menu/Menu";

import {
  BuilderElementProps,
  withBuilderElementWrapper,
} from "./builder-element-wrapper";

interface BuilderElementMenuItemProps extends BuilderElementProps {
  elementKey: `menu.${number}.items.${number}`;
}

function BuilderElementMenuItemBase({
  elementKey,
}: BuilderElementMenuItemProps) {
  const data = useWatch<Builder>({ name: elementKey });
  const { control } = useFormContext<Builder>();
  const { previewMode } = useBuilder();

  if (previewMode) {
    return <MenuItemCard item={data as MenuItem} isAvailable />;
  }

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`${elementKey}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Item name</FormLabel>
            <FormControl>
              <Input placeholder="Food" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.price`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <PriceInput {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.allergens`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allergens</FormLabel>
            <FormControl>
              <CategoryMultiSelect
                value={field.value || []}
                onChange={field.onChange}
                type="allergens"
                placeholder="Select allergens..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.food_types`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Food Types</FormLabel>
            <FormControl>
              <CategoryMultiSelect
                value={field.value || []}
                onChange={field.onChange}
                type="food_type"
                placeholder="Select food types..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.image`}
        render={() => (
          <FormItem>
            <div className="space-y-2">
              <FormLabel>Item image</FormLabel>
              <ImageUploadDropzone />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export const BuilderElementMenuItem = withBuilderElementWrapper(
  BuilderElementMenuItemBase,
);
