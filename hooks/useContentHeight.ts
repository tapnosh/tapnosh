import { useRef, useState } from "react";

export function useContentHeight() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [startContentHeight, setStartContentHeight] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  return {
    contentRef,
    contentHeight,
    setContentHeight,
    startContentHeight,
    setStartContentHeight,
    isDragging,
    setIsDragging,
  };
}
