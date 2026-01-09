"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";

import { CategoryMultiSelect } from "@/components/ui/forms/category-multiselect";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/forms/form";
import ImageUploadDropzone from "@/components/ui/forms/image-upload-drop-zone";
import { Input } from "@/components/ui/forms/input";
import PriceInput from "@/components/ui/forms/price-input";
import { Textarea } from "@/components/ui/forms/textarea";
import { TranslatedFormMessage } from "@/components/ui/forms/translated-form-message";
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
  const t = useTranslations("management.pageBuilder.menu.item");
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
            <FormLabel>{t("name")}</FormLabel>
            <FormControl>
              <Input placeholder={t("namePlaceholder")} {...field} />
            </FormControl>
            <TranslatedFormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("description")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("descriptionPlaceholder")} {...field} />
            </FormControl>
            <TranslatedFormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.price`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("price")}</FormLabel>
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
            <FormLabel>{t("allergens")}</FormLabel>
            <FormControl>
              <CategoryMultiSelect
                value={field.value || []}
                onChange={field.onChange}
                type="allergens"
                placeholder={t("allergensPlaceholder")}
              />
            </FormControl>
            <TranslatedFormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.food_types`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("foodTypes")}</FormLabel>
            <FormControl>
              <CategoryMultiSelect
                value={field.value || []}
                onChange={field.onChange}
                type="food_type"
                placeholder={t("foodTypesPlaceholder")}
              />
            </FormControl>
            <TranslatedFormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${elementKey}.image`}
        render={() => (
          <FormItem>
            <div className="space-y-2">
              <FormLabel>{t("itemImage")}</FormLabel>
              <ImageUploadDropzone />
            </div>
            <TranslatedFormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export const BuilderElementMenuItem = withBuilderElementWrapper(
  BuilderElementMenuItemBase,
);
