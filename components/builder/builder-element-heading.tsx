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
import { Builder, HeaderHeading } from "@/types/builder/BuilderSchema";

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
