"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useThemeColor } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { CirclePlus, Loader2Icon, Paintbrush, Palette } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useThrottle } from "@uidotdev/usehooks";
import useSWR from "swr";
import { useNotification } from "@/context/NotificationBar";
import { BasicNotificationBody } from "../ui/basic-notification";
import { RestaurantTheme } from "@/types/theme/Theme";
import { createTheme } from "@/app/actions/theme/create";

export function ThemePicker({
  onChange,
}: {
  onChange?: (theme: RestaurantTheme) => void;
}) {
  const { openNotification } = useNotification();
  const [createStatus, action, isPending] = useActionState(createTheme, null);

  const { data = [], isLoading } = useSWR<RestaurantTheme[]>(
    "restaurant-theme",
    {
      onError: () => {
        openNotification(
          <BasicNotificationBody
            title="Error"
            description="Failed to load themes. Please try again."
            variant="error"
          />,
        );
      },
    },
  );

  useEffect(() => {
    if (!createStatus) return;
    if (createStatus.success) {
      if (createStatus?.data) {
        onChange?.(createStatus.data);
      }
      openNotification(
        <BasicNotificationBody
          title="Success"
          description="Theme created successfully"
          variant="success"
        />,
      );
      return;
    }

    openNotification(
      <BasicNotificationBody
        title="Error"
        description={
          createStatus instanceof Error
            ? createStatus.message
            : "Unknown error occurred"
        }
        variant="error"
      />,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createStatus]);

  const { setColor, color } = useThemeColor();
  const [hexColor, setHexColor] = useState<string>(color);

  const throttleColor = useThrottle(hexColor, 300);

  useEffect(() => {
    if (throttleColor) setColor(throttleColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttleColor]);

  return (
    <div
      className="preview flex h-full w-full items-center justify-center rounded bg-cover bg-center p-10 transition-all"
      style={{ background: hexColor }}
    >
      <ColorPicker
        themes={data}
        background={color}
        setBackground={setHexColor}
        onCreate={(color) => startTransition(() => action({ color }))}
        isPending={isPending || isLoading}
        onThemeChange={(t) => {
          setHexColor(t.color);
          onChange?.(t);
        }}
      />
    </div>
  );
}

export function ColorPicker({
  themes,
  background,
  setBackground,
  className,
  onCreate,
  isPending,
  onThemeChange,
}: {
  themes: RestaurantTheme[];
  background: string;
  setBackground: (color: string) => void;
  className?: string;
  onCreate: (color: string) => void;
  isPending: boolean;
  onThemeChange: (theme: RestaurantTheme) => void;
}) {
  const isColorDefined = useMemo(
    () => !themes.find(({ color }) => color === background),
    [background, themes],
  );

  const defaultTab = useMemo(() => {
    return "solid";
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "hover:bg-background/75 w-[220px] justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-cover !bg-center transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">
              {background ? background : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsContent value="solid" className="mt-0 flex flex-wrap gap-1">
            {themes.map((s) => (
              <div
                key={s.id}
                style={{ background: s.color }}
                className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
                onClick={() => onThemeChange(s)}
              />
            ))}
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex w-full max-w-sm items-center gap-2">
          <Button
            className="relative shrink-0 cursor-pointer rounded-md"
            size="icon"
          >
            <Palette />
            <Input
              id="custom-picker"
              type="color"
              value={background}
              className="absolute inset-0 size-full p-0 opacity-0"
              onChange={(e) => setBackground(e.currentTarget.value)}
            />
          </Button>

          <Input
            id="custom"
            value={background}
            onChange={(e) => setBackground(e.currentTarget.value)}
            disabled={isPending}
          />

          {isColorDefined && (
            <Button
              className="relative shrink-0 cursor-pointer rounded-md"
              size="icon"
              variant="secondary"
              onClick={() => onCreate(background)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <CirclePlus />
              )}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
