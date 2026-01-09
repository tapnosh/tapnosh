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
import { Builder, HeaderHeading } from "@/types/builder/BuilderSchema";

import { BuilderElementProps } from "./builder-element-wrapper";

interface BuilderElementHeadingProps extends BuilderElementProps {
  elementKey: `header.${number}`;
}

export function BuilderElementHeading({
  elementKey,
}: BuilderElementHeadingProps) {
  const t = useTranslations("management.pageBuilder.elements");
  const tPreview = useTranslations("management.pageBuilder.menu.preview");
  const { previewMode } = useBuilder();
  const { control } = useFormContext();
  const data = useWatch<Builder>({ name: elementKey }) as HeaderHeading;

  if (previewMode) {
    return <h2>{data?.heading || tPreview("noMenu")}</h2>;
  }

  return (
    <FormField
      control={control}
      name={`${elementKey}.heading`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("heading")}</FormLabel>
          <FormControl>
            <Textarea placeholder={t("text")} {...field} />
          </FormControl>
          <TranslatedFormMessage />
        </FormItem>
      )}
    />
  );
}
