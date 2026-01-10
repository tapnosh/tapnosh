"use client";

import { useThrottle } from "@uidotdev/usehooks";
import {
  Check,
  CirclePlus,
  Loader2Icon,
  Paintbrush,
  Palette,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

import { BasicNotificationBody } from "@/components/ui/feedback/basic-notification";
import { Button } from "@/components/ui/forms/button";
import { useFormField } from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { Tabs, TabsContent } from "@/components/ui/layout/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/overlays/popover";
import { useNotification } from "@/context/NotificationBar";
import { useThemeColor } from "@/context/ThemeContext";
import { useCreateRestaurantTheme } from "@/hooks/api/theme/useCreateRestaurantTheme";
import { useRestaurantThemesQuery } from "@/hooks/api/theme/useRestaurantThemes";
import { TranslatedError } from "@/types/api/Error";
import { RestaurantTheme } from "@/types/theme/Theme";
import { cn } from "@/utils/cn";
import { tryCatch } from "@/utils/tryCatch";

export function ThemePicker({
  onChange,
  "aria-invalid": ariaInvalid,
}: {
  onChange?: (theme: RestaurantTheme) => void;
  "aria-invalid"?: boolean;
}) {
  const tToast = useTranslations("common.toast");

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
          title={tToast("error")}
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
        title={tToast("success")}
        description={tToast("themeCreated")}
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
      className={cn(
        "preview bg-muted flex h-full w-full items-center justify-center rounded-md bg-cover bg-center p-10 transition-all",
        ariaInvalid &&
          "ring-destructive dark:ring-destructive/40 border-destructive ring-1",
      )}
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
        aria-invalid={ariaInvalid}
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
  "aria-invalid": ariaInvalid,
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
  "aria-invalid"?: boolean;
}) {
  const t = useTranslations("restaurants.form.fields.fields.theme");

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
          aria-invalid={ariaInvalid}
          className={cn(
            "hover:bg-background/75 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 w-[220px] justify-start text-left font-normal",
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
              {background ? background : t("placeholder")}
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
              {t("createTheme")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
