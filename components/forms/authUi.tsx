"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

/** Page heading block shared by sign-in / sign-up. */
export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>
    </div>
  );
}

/** Text input with an inline show/hide toggle. Forwards RHF field props. */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

/** Full-width primary submit with a built-in loading state. */
export function SubmitButton({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button type="submit" size="xl" disabled={loading} className="w-full font-semibold">
      {loading ? (
        <>
          <Spinner className="mr-2" size={17} />
          Just a moment…
        </>
      ) : (
        children
      )}
    </Button>
  );
}
