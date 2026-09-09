"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AutosizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Cap the auto-growth (px). Beyond this it scrolls. */
  maxHeight?: number;
  minHeight?: number;
}

/** Textarea that grows to fit its content. */
const AutosizeTextarea = React.forwardRef<HTMLTextAreaElement, AutosizeTextareaProps>(
  ({ className, value, onChange, maxHeight = 480, minHeight = 0, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    };

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "auto";
      const next = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${Math.max(next, minHeight)}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [maxHeight, minHeight]);

    React.useLayoutEffect(resize, [resize, value]);

    return (
      <textarea
        ref={setRefs}
        value={value}
        onChange={(e) => {
          onChange?.(e);
          resize();
        }}
        rows={1}
        className={cn(
          "block w-full resize-none bg-transparent placeholder:text-muted-foreground/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
AutosizeTextarea.displayName = "AutosizeTextarea";

export { AutosizeTextarea };
