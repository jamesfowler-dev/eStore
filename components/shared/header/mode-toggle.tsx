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

    useEffect(() => {
        setMounted(true);   
    }, []);

    if (!mounted) {
        return null; 
    }

    return ( 
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button asChild variant="ghost" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                <span>
                { theme === "system" ? (
                    <SunMoon />
                ) : theme === "dark" ? (
                    <MoonIcon /> 
                ) : (
                    <SunIcon />
                )}
                </span>
            </Button>
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
    </DropdownMenu> );
};
 
export default ModeToggle;