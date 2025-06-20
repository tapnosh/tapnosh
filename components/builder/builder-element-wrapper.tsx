import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useMemo } from "react";
import { useBuilder } from "@/context/BuilderContext";

interface BuilderElementWrapperProps {
  id: string;
  index: number;
  formKey: string;
  remove: (idx: number) => void;
}

export interface BuilderElementProps {
  id: string;
  index: number;
  elementKey: string;
  remove: (idx: number) => void;
}

export function withBuilderElementWrapper<P extends object>(
  Component: React.ComponentType<P>,
) {
  const componentName = Component.displayName || Component.name || "Component";

  const WrappedComponent = ({
    id,
    index,
    remove,
    formKey,
    ...props
  }: BuilderElementWrapperProps & Omit<P, "elementKey">) => {
    const elementKey = useMemo(
      () => `${formKey}.${index}` as const,
      [formKey, index],
    );
    const { previewMode } = useBuilder();

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 10000 : 1,
    };

    if (previewMode) {
      return <Component {...(props as P)} elementKey={elementKey} />;
    }

    return (
      <Card ref={setNodeRef} style={style} className="relative flex-row gap-0">
        <div className="absolute flex shrink-0 items-center pl-1">
          <div {...attributes} {...listeners}>
            <GripVertical className="size-4 cursor-grab touch-none" />
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => remove(index)}
          className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center"
        >
          <Trash2 />
        </Button>
        <CardContent className="flex flex-1 flex-col">
          <Component {...(props as P)} elementKey={elementKey} />
        </CardContent>
      </Card>
    );
  };

  WrappedComponent.displayName = `withBuilderElement(${componentName})`;

  return WrappedComponent;
}
