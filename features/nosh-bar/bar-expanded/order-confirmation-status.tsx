import { Check, Loader2Icon } from "lucide-react";
import { motion } from "motion/react";

export const OrderConfirmationStatus = ({ status }: { status: string }) => {
  if (status === "confirmed") {
    return (
      <motion.div
        layout
        layoutId="confirmation-status"
        animate={{ scale: 1 }}
        initial={{ scale: 0.25 }}
        exit={{ scale: 0.25 }}
        transition={{ layout: { duration: 0.8, type: "spring", damping: 16 } }}
      >
        <Check />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      layoutId="confirmation-status"
      animate={{ scale: 1 }}
      initial={{ scale: 0.25 }}
      exit={{ scale: 0.25 }}
      transition={{ layout: { duration: 0.8, type: "spring", damping: 16 } }}
    >
      <Loader2Icon className="animate-spin" />
    </motion.div>
  );
};
