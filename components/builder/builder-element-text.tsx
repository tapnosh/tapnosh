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

export function BuilderElementText({ elementKey }: BuilderElementProps) {
  const { previewMode } = useBuilder();
  const { control } = useFormContext();
  const data = useWatch({ name: elementKey });

  if (previewMode) {
    return (
      <p className="text-foreground text-sm">
        {data?.text || "No description provided."}
      </p>
    );
  }

  return (
    <FormField
      control={control}
      name={`${elementKey}.text`}
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
  );
}
