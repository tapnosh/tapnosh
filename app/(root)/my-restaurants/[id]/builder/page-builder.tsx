"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
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
import { BuilderElementHeading } from "@/components/builder/builder-element-heading";
import { useMenuMutation } from "@/hooks/api/menu/useMenuMutation";
import { useMenusQuery } from "@/hooks/api/menu/useMenus";
import { useNotification } from "@/context/NotificationBar";
import { BasicNotificationBody } from "@/components/ui/basic-notification";
import { RestaurantHeader } from "@/app/(root)/restaurants/[slug]/restaurant-page";
import { useThemeColor } from "@/context/ThemeContext";
import { Restaurant } from "@/types/restaurant/Restaurant";

const PageElementMap = {
  "menu-group": withBuilderElementWrapper(BuilderElementMenuGroup),
  text: withBuilderElementWrapper(BuilderElementText),
  heading: withBuilderElementWrapper(BuilderElementHeading),
} as const;

const PreviewModeSwitcher = () => {
  const { previewMode, togglePreviewMode } = useBuilder();

  return (
    <Button
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        togglePreviewMode();
      }}
      type="button"
      className="mb-4"
    >
      {previewMode ? "Exit Preview Mode" : "Enter Preview Mode"}
    </Button>
  );
};

function PageBuilderFields({ restaurant }: { restaurant: Restaurant }) {
  const { setColor } = useThemeColor();
  const { openNotification } = useNotification();
  const { data: menu, refetch } = useMenusQuery({
    restaurantId: restaurant.id || "",
  });
  const { mutateAsync } = useMenuMutation();
  const [groupsParent] = useAutoAnimate();

  const { previewMode } = useBuilder();

  const form = useForm<Builder>({
    mode: "onChange",
    resolver: zodResolver(BuilderSchema),
    defaultValues: menu?.schema,
  });

  useEffect(() => {
    form.reset(menu?.schema ?? restaurant.menu);
  }, [menu, form, restaurant]);

  useEffect(() => {
    if (restaurant?.theme?.color) setColor(restaurant.theme.color);
  }, [restaurant, setColor]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

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
    appendField({
      version: "v1",
      type: "menu-group",
      name: "",
      timeFrom: "07:00",
      timeTo: "12:00",
      items: [],
    });
  };

  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((group) => group.id === active.id);
      const newIndex = fields.findIndex((group) => group.id === over.id);
      moveField(oldIndex, newIndex);
    }
  };

  const handleHeaderDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = headerFields.findIndex(
        (group) => group.id === active.id,
      );
      const newIndex = headerFields.findIndex((group) => group.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = async (schema: Builder) => {
    try {
      await mutateAsync({
        restaurantId: restaurant.id || "",
        schema,
        id: menu?.id,
      });
      openNotification(
        <BasicNotificationBody
          title="Success"
          description="Restaurant page updated successfully!"
          variant="success"
        />,
      );
      await refetch();
    } catch (error) {
      if (error instanceof Error) {
        openNotification(
          <BasicNotificationBody
            title="Error"
            description={error.message}
            variant="error"
          />,
        );
      } else {
        openNotification(
          <BasicNotificationBody
            title="Error"
            description="An unexpected error occurred"
            variant="error"
          />,
        );
      }
    }
  };

  return (
    <>
      <div ref={groupsParent}>
        {restaurant && <RestaurantHeader restaurant={restaurant} />}
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="section pt-0">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleHeaderDragEnd}
            >
              <SortableContext
                items={headerFields.map((group) => group.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="mb-2 flex flex-col gap-2" ref={groupsParent}>
                  {headerFields.map((group, i) => {
                    const Component = PageElementMap[group.type];
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
                  {!previewMode && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="border-foreground/20 h-32 w-full border border-dashed"
                        >
                          <Plus /> Add element
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          Select element type
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            append({
                              type: "text",
                              text: "",
                              version: "v1",
                            })
                          }
                        >
                          Text
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            append({
                              type: "heading",
                              heading: "",
                              version: "v1",
                            })
                          }
                        >
                          Heading
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </section>

          <section className="section @container space-y-2">
            <h2>Menu</h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleGroupDragEnd}
            >
              <SortableContext
                items={fields.map((group) => group.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2" ref={groupsParent}>
                  {fields.map((group, i) => {
                    const Component = PageElementMap[group.type];
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
                  {!previewMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="border-foreground/20 h-32 w-full border border-dashed"
                      onClick={addGroup}
                    >
                      <Plus /> Add menu group
                    </Button>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </section>
          <section className="section flex justify-end gap-2">
            <PreviewModeSwitcher />
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting && <Loader2 className="animate-spin" />}
              Save Menu
            </Button>
          </section>
        </form>
      </Form>
    </>
  );
}

export function PageBuilder({ restaurant }: { restaurant: Restaurant }) {
  return (
    <BuilderProvider>
      <PageBuilderFields restaurant={restaurant} />
    </BuilderProvider>
  );
}
