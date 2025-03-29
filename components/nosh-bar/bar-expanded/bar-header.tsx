"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";

type HeaderProps = {
  activeTab: "cart" | "orders";
  handleCollapse: () => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  contentHeight: number;
  startContentHeight: number;
  setStartContentHeight: (height: number) => void;
  setContentHeight: (height: number) => void;
};

export function BarHeader({
  activeTab,
  handleCollapse,
  setIsDragging,
  contentHeight,
  startContentHeight,
  setStartContentHeight,
  setContentHeight,
}: HeaderProps) {
  return (
    <motion.header
      drag="y"
      onDragStart={() => {
        setIsDragging(true);
        setStartContentHeight(contentHeight);
      }}
      onDrag={(_, info) => {
        const dragHeight = Math.max(startContentHeight - info.offset.y, 90);
        if (
          dragHeight >= 90 &&
          dragHeight <= window.innerHeight - 12 &&
          Math.abs(dragHeight - contentHeight) > 2
        ) {
          setContentHeight(dragHeight);
        }
      }}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        if (info.velocity.y > 500 || contentHeight < 150) {
          handleCollapse();
        } else {
          setContentHeight(startContentHeight);
        }
      }}
      dragElastic={0}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      className="text-primary-foreground flex items-center justify-between p-4"
    >
      <h3 className="text-lg font-semibold">
        {activeTab === "cart" ? "Confirm Order" : "My Tab"}
      </h3>
      <button
        onClick={handleCollapse}
        className="text-primary-foreground hover:bg-accent hover:text-secondary rounded-full p-1 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.header>
  );
}
