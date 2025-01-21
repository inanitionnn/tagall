"use client";
import { useState, useEffect } from "react";
import { cn } from "../../../../lib";
import { Button } from "../../ui";
import { MoveUp } from "lucide-react";

function HomeScrollButton() {
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
      className={cn("fixed bottom-6 right-6 z-50 hover:bg-primary", {
        hidden: !isVisible,
      })}
    >
      <MoveUp />
    </Button>
  );
}

export { HomeScrollButton };
