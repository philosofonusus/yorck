"use client";
import { Button } from "@/components/ui/button";
import { Leva, button, useControls } from "leva";
import { CogIcon } from "lucide-react";
import { useState } from "react";

export const LevaCog = () => {
  const [isHidden, setIsHidden] = useState(true);
  const _values = useControls({
    hide: button(() => {
      setIsHidden(true);
    }),
  });
  return (
    <>
      <Leva hidden={isHidden} />
      <Button
        onClick={() => setIsHidden(!isHidden)}
        variant="secondary"
        className="w-8 h-8 p-0 rounded-full"
      >
        <CogIcon className="w-4 h-4" />
      </Button>
    </>
  );
};
