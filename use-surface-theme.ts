"use client";

import * as React from "react";

export type SurfaceTheme = "auto" | "light" | "dark";
export type ResolvedSurfaceTheme = "light" | "dark";

function detect(): ResolvedSurfaceTheme {
  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** "auto": <html> üzerindeki .dark/.light sınıfını, yoksa işletim sistemi temasını izler. */
export function useSurfaceTheme(theme: SurfaceTheme = "auto"): ResolvedSurfaceTheme {
  const [auto, setAuto] = React.useState<ResolvedSurfaceTheme>("dark");

  React.useEffect(() => {
    if (theme !== "auto") return;
    const update = () => setAuto(detect());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, [theme]);

  return theme === "auto" ? auto : theme;
}
