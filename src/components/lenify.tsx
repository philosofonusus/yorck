"use client";
import Tempus from "@studio-freight/tempus";
import Lenis from "@studio-freight/lenis";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Lenify() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (lenis.current) lenis.current!.scrollTo(0, { immediate: true });
  }, [pathname, searchParams, lenis]);

  useLayoutEffect(() => {
    lenis.current = new Lenis();

    const resize = setInterval(() => {
      lenis.current!.resize();
    }, 150);

    function onFrame(time: number) {
      lenis.current!.raf(time);
    }
    const unsubscribe = Tempus.add(onFrame);

    return () => {
      unsubscribe();
      clearInterval(resize);
      lenis.current!.destroy();
      lenis.current = null;
    };
  }, []);
  return null;
}
