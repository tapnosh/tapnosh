import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUploadDropzone from "@/components/ui/image-upload-drop-zone";
import { useEffect, useState } from "react";
import { useBuilder } from "@/context/BuilderContext";
import { MenuItemCard } from "@/components/menu/menu-item";
import {
  BuilderElementProps,
  withBuilderElementWrapper,
} from "./builder-element-wrapper";
import { Builder } from "@/types/builder/BuilderSchema";

function BuilderElementMenuItemBase({ elementKey }: BuilderElementProps) {
  const data = useWatch({ name: elementKey });
  const form = useFormContext<Builder>();
  const [files, setFiles] = useState<File[]>([]);
  const { control } = useFormContext();
  const { previewMode } = useBuilder();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue(`${elementKey}.image` as any, files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const imageErrors = useWatch({
    name: `${elementKey}.image`,
    control,
  });

  console.log("form.formState.errors.menu");
  console.log(imageErrors);

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
              <Input type="number" placeholder="Price" {...field} />
            </FormControl>
            <FormMessage />
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
              <Input placeholder="Ingredients (comma separated)" {...field} />
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
              <Input placeholder="Categories (comma separated)" {...field} />
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
              <ImageUploadDropzone files={files} setFiles={setFiles} />
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
