import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUploadDropzone from "@/components/ui/image-upload-drop-zone";
import { useBuilder } from "@/context/BuilderContext";
import { MenuItemCard } from "@/components/menu/menu-item";
import {
  BuilderElementProps,
  withBuilderElementWrapper,
} from "./builder-element-wrapper";
import PriceInput from "@/components/ui/price-input";
import MultiChipInput from "../ui/multi-chip-input";

function BuilderElementMenuItemBase({ elementKey }: BuilderElementProps) {
  const data = useWatch({ name: elementKey });
  const { control, setValue } = useFormContext();
  const { previewMode } = useBuilder();

  if (previewMode) {
    return <MenuItemCard item={data} isAvailable />;
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
        name={`${elementKey}.ingredients`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ingredients</FormLabel>
            <FormControl>
              <MultiChipInput
                fields={field.value}
                append={(value) =>
                  setValue(`${elementKey}.ingredients`, [
                    ...[...field.value, value],
                  ])
                }
                remove={(value) =>
                  setValue(
                    `${elementKey}.ingredients`,
                    field.value.filter((item: string) => item !== value),
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.categories`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categories</FormLabel>
            <FormControl>
              <MultiChipInput
                fields={field.value}
                append={(value) =>
                  setValue(`${elementKey}.categories`, [
                    ...[...field.value, value],
                  ])
                }
                remove={(value) =>
                  setValue(
                    `${elementKey}.categories`,
                    field.value.filter((item: string) => item !== value),
                  )
                }
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
