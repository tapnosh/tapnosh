"use client";

import { useState } from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { Button } from "@/components/ui/forms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlays/dialog";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<RestaurantDeleteFormData | null>(
    null,
  );

  const handleFormSubmit = (data: RestaurantDeleteFormData) => {
    if (data.confirmationSlug !== restaurantSlug) {
      form.setError("confirmationSlug", {
        type: "manual",
        message: "The restaurant slug does not match",
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
            Delete Restaurant
          </CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the
            restaurant
            <span className="text-foreground font-semibold">
              {" "}
              &quot;{restaurantName}&quot;
            </span>{" "}
            and remove all associated data.
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
                      Warning: This action is irreversible
                    </p>
                    <p className="text-muted-foreground text-sm">
                      All menu items, categories, orders, and other data
                      associated with this restaurant will be permanently
                      deleted.
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
                      Type{" "}
                      <code className="bg-muted rounded px-1 py-0.5 text-sm">
                        {restaurantSlug}
                      </code>{" "}
                      to confirm
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter "${restaurantSlug}" to confirm deletion`}
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription>
                      Please type the restaurant slug exactly as shown above to
                      confirm deletion.
                    </FormDescription>
                    <FormMessage />
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
                  Cancel
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
                  Delete Restaurant
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
              Final Confirmation
            </DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete
              <span className="text-foreground font-semibold">
                {" "}
                &quot;{restaurantName}&quot;
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-destructive/10 border-destructive/20 rounded-md border p-4">
            <p className="text-destructive text-sm font-medium">
              This will permanently delete:
            </p>
            <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
              <li>All menu items and categories</li>
              <li>Restaurant images and branding</li>
              <li>Customer orders and reviews</li>
              <li>QR codes and public links</li>
              <li>All other restaurant data</li>
            </ul>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isPending}
            >
              Cancel
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
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, Delete Forever
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
