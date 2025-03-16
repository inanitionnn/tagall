"use client";

import { useEffect } from "react";
import { Button, Header } from "./_components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-lvh w-full items-center justify-center gap-6">
      <Header vtag="h3">Something went wrong!</Header>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
