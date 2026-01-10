"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/forms/button";
import { DrawerClose } from "@/components/ui/overlays/drawer";

interface FilterActionsProps {
  onApply: () => void;
  onReset: () => void;
}

export function FilterActions({ onApply, onReset }: FilterActionsProps) {
  const t = useTranslations("management.pageBuilder.menu.display");

  return (
    <>
      <div className="flex w-full gap-2">
        <Button onClick={onApply} className="flex-1">
          {t("applyFilters")}
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          {t("reset")}
        </Button>
      </div>
      <DrawerClose asChild>
        <Button variant="ghost">{t("cancel")}</Button>
      </DrawerClose>
    </>
  );
}
