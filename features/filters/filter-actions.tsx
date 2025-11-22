import { Button } from "@/components/ui/forms/button";
import { DrawerClose } from "@/components/ui/overlays/drawer";

interface FilterActionsProps {
  onApply: () => void;
  onReset: () => void;
}

export function FilterActions({ onApply, onReset }: FilterActionsProps) {
  return (
    <>
      <div className="flex w-full gap-2">
        <Button onClick={onApply} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          Reset
        </Button>
      </div>
      <DrawerClose asChild>
        <Button variant="ghost">Cancel</Button>
      </DrawerClose>
    </>
  );
}
