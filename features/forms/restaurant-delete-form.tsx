"use client";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Button } from "@/components/ui/forms/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { TranslatedFormMessage } from "@/components/ui/forms/translated-form-message";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlays/dialog";

interface RestaurantDeleteFormData {
  confirmationSlug: string;
}

interface RestaurantDeleteFormProps {
  form: UseFormReturn<RestaurantDeleteFormData>;
  onSubmit: (data: RestaurantDeleteFormData) => void;
  isPending?: boolean;
  restaurantName: string;
  restaurantSlug: string;
}

export function RestaurantDeleteForm({
  form,
  onSubmit,
  isPending,
  restaurantName,
  restaurantSlug,
}: RestaurantDeleteFormProps) {
  const t = useTranslations("management.settings.deleteRestaurant");
  const tActions = useTranslations("management.settings.actions");
  const tDialog = useTranslations("management.settings.confirmDialog");

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<RestaurantDeleteFormData | null>(
    null,
  );

  const handleFormSubmit = (data: RestaurantDeleteFormData) => {
    if (data.confirmationSlug !== restaurantSlug) {
      form.setError("confirmationSlug", {
        type: "manual",
        message: t("slugMismatch"),
      });
      return;
    }

    setFormData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (formData) {
      onSubmit(formData);
      setShowConfirmDialog(false);
      setFormData(null);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setFormData(null);
    form.reset();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("descriptionBefore")}{" "}
            <span className="text-foreground font-semibold">
              &quot;{restaurantName}&quot;
            </span>{" "}
            {t("descriptionAfter")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div className="bg-destructive/10 border-destructive/20 rounded-md border p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-destructive text-sm font-medium">
                      {t("warning")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t("warningDescription")}
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="confirmationSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("confirmationLabelBefore")}{" "}
                      <code className="bg-muted rounded px-1 py-0.5 text-sm">
                        {restaurantSlug}
                      </code>{" "}
                      {t("confirmationLabelAfter")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("confirmationPlaceholder", {
                          restaurantSlug,
                        })}
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription>{t("confirmationHelper")}</FormDescription>
                    <TranslatedFormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  {tActions("cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={
                    isPending ||
                    form.watch("confirmationSlug") !== restaurantSlug
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {tActions("deleteRestaurant")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {tDialog("title")}
            </DialogTitle>
            <DialogDescription>
              {tDialog("descriptionBefore")}{" "}
              <span className="text-foreground font-semibold">
                &quot;{restaurantName}&quot;
              </span>{" "}
              {tDialog("descriptionAfter")}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-destructive/10 border-destructive/20 rounded-md border p-4">
            <p className="text-destructive text-sm font-medium">
              {tDialog("permanentDeleteTitle")}
            </p>
            <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
              <li>{tDialog("deleteItem1")}</li>
              <li>{tDialog("deleteItem2")}</li>
              <li>{tDialog("deleteItem3")}</li>
              <li>{tDialog("deleteItem4")}</li>
              <li>{tDialog("deleteItem5")}</li>
            </ul>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isPending}
            >
              {tActions("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tDialog("deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {tDialog("confirmDelete")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
