"use client";
import { useState, useEffect } from "react"; 
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes"; 
import { SunIcon, MoonIcon, SunMoon } from "lucide-react"; 

const ModeToggle = () => {
    const [ mounted, setMounted ] = useState(false); 
    const { theme, setTheme } = useTheme(); 

    // useEffect hook different from tutorial to avoid errors. What this code does:
    // Waits one animation frame before marking the component as mounted.
    // Avoids the checker warning about synchronous setState in an effect.
    // Keeps your SSR/hydration guard behavior (returns null until mounted). 
    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    if (!mounted) {
        return null; 
    }


    // Code for <DropdownMenuTrigger> differs from the tutorial due to button rendering inside 
    // a button
    return ( 
    <DropdownMenu>
        <DropdownMenuTrigger
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
            {theme === "system" ? <SunMoon /> : theme === "dark" ? <MoonIcon /> : <SunIcon />}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem 
                checked={theme === "system"}
                onClick={() => setTheme("system")}
            >
                System
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
                checked={theme === "dark"}
                onClick={() => setTheme("dark")}
            >
                Dark
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
                checked={ theme === "light" }
                onClick={() => setTheme("light")}
            >
                Light
            </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu> 
    );
};
 
export default ModeToggle;