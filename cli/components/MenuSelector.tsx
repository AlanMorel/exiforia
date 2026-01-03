import { config } from "@/utils/Config.ts";
import figlet from "figlet";
import { Box, Text, useApp, useInput } from "ink";
import { useState } from "react";

export interface MenuItem {
    label: string;
    command: string;
    args: string[];
    color: string;
}

interface MenuSelectorProps {
    items: MenuItem[];
    onSelect: (item: MenuItem) => void;
}

export function MenuSelector({ items, onSelect }: MenuSelectorProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { exit } = useApp();

    useInput((input, key) => {
        if (key.upArrow) {
            setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
        } else if (key.downArrow) {
            setSelectedIndex(prev => (prev + 1) % items.length);
        } else if (key.return) {
            onSelect(items[selectedIndex]!);
        } else if (input === "q" || (key.ctrl && input === "c")) {
            exit();
        }
    });

    const logo = figlet.textSync(config.appName.toUpperCase(), {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default"
    });

    return (
        <Box flexDirection="column">
            <Text> </Text>
            <Text color="green" bold>
                {logo}
            </Text>
            <Text dimColor>Use arrow keys to navigate, Enter to select, q to exit</Text>
            <Text> </Text>
            {items.map((item, index) => (
                <Text key={item.label} color={item.color} bold={index === selectedIndex}>
                    {index === selectedIndex ? "> " : "  "}
                    {item.label}
                </Text>
            ))}
        </Box>
    );
}
