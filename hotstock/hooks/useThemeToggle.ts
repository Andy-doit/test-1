'use client';
import { UseThemeToggleReturn } from '@/app/types/theme';
import { useTheme } from 'next-themes';
import { useMemo, useCallback, useState, useEffect } from 'react';

export function useThemeToggle(): UseThemeToggleReturn {
    const { theme, setTheme, systemTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);
    const effective = useMemo(() => {
        if (!isMounted) return undefined;
        if (theme === "system") {
            return systemTheme ?? undefined;
        }
        return theme ?? undefined;
    }, [theme, systemTheme, isMounted])
    const set = useCallback((t: "light" | "dark" | "system") => {
        setTheme(t);
    }, [setTheme]);
    const toggle = useCallback(() => {
        const next = effective === "dark" ? "light" : "dark";
        setTheme(next);
    }, [effective, setTheme]);
    return {
        theme: theme as "light" | "dark" | "system",
        effective: effective as "light" | "dark",
        set,
        toggle,
        isMounted,
    };
}