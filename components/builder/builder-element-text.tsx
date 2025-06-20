import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BuilderElementProps } from "./builder-element-wrapper";
import { useFormContext, useWatch } from "react-hook-form";
import { useBuilder } from "@/context/BuilderContext";
import { Builder, HeaderText } from "@/types/builder/BuilderSchema";

interface BuilderElementTextProps extends BuilderElementProps {
  elementKey: `header.${number}`;
}

export function BuilderElementText({ elementKey }: BuilderElementTextProps) {
  const { previewMode } = useBuilder();
  const { control } = useFormContext();
  const data = useWatch<Builder>({ name: elementKey }) as HeaderText;

  if (previewMode) {
    return <p>{data?.text || "No description provided."}</p>;
  }

  return (
    <FormField
      control={control}
      name={`${elementKey}.text`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Paragrapgh</FormLabel>
          <FormControl>
            <Textarea placeholder="Text" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
