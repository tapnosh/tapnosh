import { useFormContext, useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import { Textarea } from "@/components/ui/forms/textarea";
import { useBuilder } from "@/context/BuilderContext";
import { Builder, HeaderHeading } from "@/types/builder/BuilderSchema";

import { BuilderElementProps } from "./builder-element-wrapper";

interface BuilderElementHeadingProps extends BuilderElementProps {
  elementKey: `header.${number}`;
}

export function BuilderElementHeading({
  elementKey,
}: BuilderElementHeadingProps) {
  const { previewMode } = useBuilder();
  const { control } = useFormContext();
  const data = useWatch<Builder>({ name: elementKey }) as HeaderHeading;

  if (previewMode) {
    return <h2>{data?.heading || "No description provided."}</h2>;
  }

  return (
    <FormField
      control={control}
      name={`${elementKey}.heading`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Heading</FormLabel>
          <FormControl>
            <Textarea placeholder="Text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
