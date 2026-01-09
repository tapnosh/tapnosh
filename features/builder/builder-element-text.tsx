"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/forms/form";
import { Textarea } from "@/components/ui/forms/textarea";
import { TranslatedFormMessage } from "@/components/ui/forms/translated-form-message";
import { useBuilder } from "@/context/BuilderContext";
import { Builder, HeaderText } from "@/types/builder/BuilderSchema";

import { BuilderElementProps } from "./builder-element-wrapper";

interface BuilderElementTextProps extends BuilderElementProps {
  elementKey: `header.${number}`;
}

export function BuilderElementText({ elementKey }: BuilderElementTextProps) {
  const t = useTranslations("management.pageBuilder.elements");
  const tPreview = useTranslations("management.pageBuilder.menu.preview");
  const { previewMode } = useBuilder();
  const { control } = useFormContext();
  const data = useWatch<Builder>({ name: elementKey }) as HeaderText;

  if (previewMode) {
    return <p>{data?.text || tPreview("noMenu")}</p>;
  }

  return (
    <FormField
      control={control}
      name={`${elementKey}.text`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("paragraph")}</FormLabel>
          <FormControl>
            <Textarea placeholder={t("text")} {...field} />
          </FormControl>
          <TranslatedFormMessage />
        </FormItem>
      )}
    />
  );
}
