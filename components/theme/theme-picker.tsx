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
import {
  Check,
  CirclePlus,
  Loader2Icon,
  Paintbrush,
  Palette,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useThrottle } from "@uidotdev/usehooks";
import { useNotification } from "@/context/NotificationBar";
import { BasicNotificationBody } from "../ui/basic-notification";
import { RestaurantTheme } from "@/types/theme/Theme";
import { useRestaurantThemesQuery } from "../../hooks/api/theme/useRestaurantThemes";
import { useCreateRestaurantTheme } from "@/hooks/api/theme/useCreateRestaurantTheme";
import { TranslatedError } from "@/types/api/Error";
import { useFormField } from "@/components/ui/form";
import { useWatch } from "react-hook-form";
import { tryCatch } from "@/lib/tryCatch";

export function ThemePicker({
  onChange,
}: {
  onChange?: (theme: RestaurantTheme) => void;
}) {
  const { name } = useFormField();
  const value = useWatch({ name });
  const { openNotification } = useNotification();

  const { data = [], isLoading, refetch } = useRestaurantThemesQuery();
  const { mutateAsync, isPending } = useCreateRestaurantTheme();

  const [theme, setTheme] = useState<RestaurantTheme | undefined>();
  const { setColor } = useThemeColor();
  const [hexColor, setHexColor] = useState<string | undefined>();

  const throttleColor = useThrottle(hexColor, 300);

  const isValidColor = useMemo(
    () => /^#[0-9a-fA-F]{6}$/.test(hexColor ?? ""),
    [hexColor],
  );

  useEffect(() => {
    if (throttleColor && isValidColor) setColor(throttleColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttleColor]);

  const handleThemeChange = (t: RestaurantTheme) => {
    setHexColor(t.color);
    onChange?.(t);
    setTheme(t);
  };

  const handleThemeCreate = async (color: string) => {
    const [error, res] = await tryCatch(mutateAsync({ color }));

    if (error) {
      openNotification(
        <BasicNotificationBody
          title="Error"
          description={(error as unknown as TranslatedError).message}
          variant="error"
        />,
      );
      return;
    }

    refetch();
    handleThemeChange(res);
    openNotification(
      <BasicNotificationBody
        title="Success"
        description="Theme created successfully"
        variant="success"
      />,
    );
  };

  useEffect(() => {
    if (value && data.length > 0) {
      const selectedTheme = data.find((t) => t.id === value);
      if (selectedTheme) {
        setHexColor(selectedTheme.color);
        setTheme(selectedTheme);
      } else {
        setHexColor(undefined);
        setTheme(undefined);
      }
    }
  }, [value, data]);

  return (
    <div
      className="preview bg-muted flex h-full w-full items-center justify-center rounded bg-cover bg-center p-10 transition-all"
      style={{ background: hexColor }}
    >
      <ColorPicker
        theme={theme}
        themes={data}
        background={hexColor}
        setBackground={setHexColor}
        onCreate={handleThemeCreate}
        isPending={isPending || isLoading}
        isValidColor={isValidColor}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}

export function ColorPicker({
  theme,
  themes,
  background,
  setBackground,
  className,
  onCreate,
  isPending,
  onThemeChange,
  isValidColor,
}: {
  theme: RestaurantTheme | undefined;
  themes: RestaurantTheme[];
  background?: string;
  setBackground: (color: string) => void;
  className?: string;
  onCreate: (color: string) => void;
  isPending: boolean;
  onThemeChange: (theme: RestaurantTheme) => void;
  isValidColor: boolean;
}) {
  const canBeCreated = useMemo(
    () => !themes.find(({ color }) => color === background) && isValidColor,
    [background, isValidColor, themes],
  );

  const defaultTab = useMemo(() => {
    return "solid";
  }, []);

  return (
    <Popover
      onOpenChange={(open) =>
        !open && canBeCreated && theme && onThemeChange(theme)
      }
    >
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
      <PopoverContent side="top" className="w-64">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsContent value="solid" className="mt-0 flex flex-wrap gap-1">
            <Button
              className="relative size-6 shrink-0 cursor-pointer rounded-md"
              size="icon"
            >
              <Palette />
              <Input
                id="custom-picker"
                type="color"
                value={background}
                className="absolute inset-0 size-full p-0 opacity-0"
                aria-invalid={!isValidColor}
                onChange={(e) => setBackground(e.currentTarget.value)}
              />
            </Button>
            {themes.map((s) => (
              <div
                key={s.id}
                style={{ background: s.color }}
                className="relative size-6 cursor-pointer rounded-md border active:scale-105"
                onClick={() => onThemeChange(s)}
              >
                {theme?.id === s.id && (
                  <Check className="text-primary-foreground absolute inset-0 m-auto h-4 w-4" />
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
        {canBeCreated && (
          <div className="mt-4 flex w-full max-w-sm items-center gap-2">
            <Button
              className="relative w-full shrink-0 cursor-pointer rounded-md"
              onClick={() => background && onCreate(background)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <CirclePlus />
              )}
              Create this theme color
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
