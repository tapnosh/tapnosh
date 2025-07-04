import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BuilderElementProps } from "./builder-element-wrapper";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Input } from "../ui/input";
import { BuilderElementMenuItem } from "./builder-element-menu-item";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useBuilder } from "@/context/BuilderContext";
import { Builder, BuilderMenuItem } from "@/types/builder/BuilderSchema";
import { MenuGroup } from "../menu/menu-group";

interface BuilderElementMenuGroupProps extends BuilderElementProps {
  elementKey: `menu.${number}`;
}

function BuilderElementMenuGroupFields({
  groupKey,
}: {
  groupKey: `menu.${number}`;
}) {
  const { control } = useFormContext<Builder>();
  const { previewMode } = useBuilder();
  const data = useWatch<Builder>({ name: groupKey });

  if (previewMode) {
    return (
      <MenuGroup
        data={data as { name: string; timeFrom: string; timeTo: string }}
      />
    );
  }

  return (
    <>
      <FormField
        control={control}
        name={`${groupKey}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Group name</FormLabel>
            <FormControl>
              <Input placeholder="Group name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className="text-sm text-gray-600">Served from:</span>
        <FormField
          control={control}
          name={`${groupKey}.timeFrom`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="time" className="w-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="text-sm text-gray-600">to</span>

        <FormField
          control={control}
          name={`${groupKey}.timeTo`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="time" className="w-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

export function BuilderElementMenuGroup({
  elementKey: groupKey,
}: BuilderElementMenuGroupProps) {
  const elementKey = useMemo(() => `${groupKey}.items` as const, [groupKey]);
  const { control } = useFormContext<Builder>();
  const { previewMode } = useBuilder();

  const {
    fields,
    append: appendChild,
    remove: removeChild,
    move: moveChild,
  } = useFieldArray({
    control,
    name: elementKey,
  });

  const [itemsParent] = useAutoAnimate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((group) => group.id === active.id);
      const newIndex = fields.findIndex((group) => group.id === over.id);
      moveChild(oldIndex, newIndex);
    }
  };

  const handleAdd = () => {
    appendChild({
      version: "v1",
      id: `item-${Date.now()}`,
      name: "",
      description: "",
      price: { amount: 0, currency: "PLN" },
      ingredients: [],
      categories: [],
      image: [],
    } as unknown as BuilderMenuItem);
  };

  return (
    <div className="space-y-2">
      <BuilderElementMenuGroupFields groupKey={groupKey} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleItemDragEnd}
      >
        <SortableContext items={fields.map((item) => item.id)}>
          <div
            className="grid gap-4 @3xl:grid-cols-2 @3xl:gap-8"
            ref={itemsParent}
          >
            {fields.map((item, i) => (
              <BuilderElementMenuItem
                key={item.id}
                id={item.id}
                formKey={elementKey}
                index={i}
                remove={removeChild}
              />
            ))}
            {!previewMode && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleAdd()}
                className="h-full min-h-60 border border-dashed border-gray-300"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Menu Item
              </Button>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
