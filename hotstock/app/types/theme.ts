export type UseThemeToggleReturn = {
    theme: "light" | "dark" | "system" | undefined;
    effective: "light" | "dark" | undefined;
    set: (t: "light" | "dark" | "system") => void;
    toggle: () => void;
    isMounted: boolean;
  };
  