import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFieldArray, useFormContext } from "react-hook-form";

export function BuilderElementSortable({
  name,
  children,
}: {
  name: string;
  children: ({
    fields,
    append,
    remove,
  }: {
    fields: Record<"id", string>[];
    append?: (value: Record<"id", string>) => void;
    remove?: (index: number | number[]) => void;
  }) => React.ReactNode;
}) {
  const [groupsParent] = useAutoAnimate();
  const form = useFormContext();

  const { fields, move, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((group) => group.id === active.id);
      const newIndex = fields.findIndex((group) => group.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleGroupDragEnd}
      >
        <SortableContext
          items={fields.map((group) => group.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={groupsParent}>{children({ fields, append, remove })}</div>
        </SortableContext>
      </DndContext>
    </>
  );
}
