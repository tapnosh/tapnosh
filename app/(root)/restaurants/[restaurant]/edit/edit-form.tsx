import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { withBuilderElementWrapper } from "@/components/builder/builder-element-wrapper";
import { BuilderElementMenuGroup } from "@/components/builder/builder-element-menu-group";
import { BuilderElementText } from "@/components/builder/builder-element-text";
import { BuilderProvider, useBuilder } from "@/context/BuilderContext";
import { Builder, BuilderSchema } from "@/types/builder/BuilderSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const PageElementMap = {
  "menu-group": withBuilderElementWrapper(BuilderElementMenuGroup),
  text: withBuilderElementWrapper(BuilderElementText),
} as const;

const PreviewModeSwitcher = () => {
  const { previewMode, togglePreviewMode } = useBuilder();

  return (
    <Button
      variant="outline"
      onClick={() => togglePreviewMode()}
      className="mb-4"
    >
      {previewMode ? "Exit Preview Mode" : "Enter Preview Mode"}
    </Button>
  );
};

export function MenuForm() {
  const [groupsParent] = useAutoAnimate();

  const form = useForm<Builder>({
    mode: "onChange",
    resolver: zodResolver(BuilderSchema),
    defaultValues: {},
  });

  const { control, handleSubmit } = form;

  const {
    fields,
    append: appendField,
    remove: removeSection,
    move: moveField,
  } = useFieldArray({
    control,
    name: "menu",
  });

  const {
    fields: headerFields,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "header",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addGroup = () => {
    const newGroup = {
      type: "menu-group",
      id: `group-${Date.now()}`,
      name: "",
      timeFrom: "07:00",
      timeTo: "12:00",
      items: [],
    };
    // setGroups([...groups, newGroup]);
    appendField(newGroup);
  };

  const addText = () => {
    const newGroup = {
      type: "text",
      id: `text-${Date.now()}`,
      name: "",
      timeFrom: "07:00",
      timeTo: "12:00",
      items: [],
    };
    // setGroups([...groups, newGroup]);
    appendField(newGroup);
  };

  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((group) => group.id === active.id);
      const newIndex = fields.findIndex((group) => group.id === over.id);
      moveField(oldIndex, newIndex);
    }
  };

  // Submit handler (replace with your API logic)
  const onSubmit = (data: unknown) => {
    console.log(data);
    // Here you would typically send the data to your API
    // For example: api.post('/menu', data)
  };

  // log all form errors
  form.formState.errors && console.log(JSON.stringify(form.formState.errors));
  console.log(JSON.stringify(form.getValues()));

  return (
    <>
      <BuilderProvider>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleGroupDragEnd}
            >
              <section className="section section-primary">
                <SortableContext
                  items={fields.map((group) => group.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2" ref={groupsParent}>
                    {headerFields.map((group, i) => {
                      const Component =
                        PageElementMap[group.type as "menu-group"];
                      return (
                        <Component
                          key={group.id}
                          id={group.id}
                          index={i}
                          remove={remove}
                          formKey="header"
                        />
                      );
                    })}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="border-accent/50 hover:text-accent/50 h-32 w-full border border-dashed"
                      >
                        <Plus /> Add section
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Select section type</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          append({
                            type: "text",
                            id: `text-${Date.now()}`,
                            name: "",
                            timeFrom: "07:00",
                            timeTo: "12:00",
                          })
                        }
                      >
                        Text
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SortableContext>
              </section>

              <section className="section space-y-2">
                <h3>Menu</h3>
                <SortableContext
                  items={fields.map((group) => group.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div ref={groupsParent}>
                    {fields.map((group, i) => {
                      const Component =
                        PageElementMap[group.type as "menu-group" | "text"];
                      return (
                        <Component
                          key={group.id}
                          id={group.id}
                          index={i}
                          remove={removeSection}
                          formKey="menu"
                        />
                      );
                    })}
                  </div>
                </SortableContext>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="border-foreground/20 h-32 w-full border border-dashed"
                    >
                      <Plus /> Add section
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Select section type</DropdownMenuLabel>
                    <DropdownMenuItem onClick={addGroup}>
                      Menu Group
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={addText}>Text</DropdownMenuItem> */}
                    <DropdownMenuItem disabled>Image</DropdownMenuItem>
                    <DropdownMenuItem disabled>Carousel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>
                  <PreviewModeSwitcher />
                  <Button type="submit" className="mt-6">
                    Save Menu
                  </Button>
                </div>
              </section>
            </DndContext>
          </form>
        </Form>
      </BuilderProvider>
    </>
  );
}
