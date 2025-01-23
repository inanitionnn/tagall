"use client";
import { useState, useEffect } from "react";
import { cn } from "../../../lib";
import { Button } from "../ui";
import { MoveUp } from "lucide-react";

function ScrollButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-12 right-6 z-50 hover:bg-primary sm:bottom-6",
        {
          hidden: !isVisible,
        },
      )}
    >
      <MoveUp />
    </Button>
  );
}

export { ScrollButton };
