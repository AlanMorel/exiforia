import { MenuSelector, type MenuItem } from "@/cli/components/MenuSelector.tsx";
import { spawn } from "bun";
import { Instance, render } from "ink";

const menuItems: MenuItem[] = [
    {
        label: "Facebook",
        command: "bun",
        args: ["facebook"],
        color: "blue"
    },
    {
        label: "Instagram",
        command: "bun",
        args: ["instagram"],
        color: "magenta"
    },
    {
        label: "Snapchat Chat Media",
        command: "bun",
        args: ["snapchat-chat-media"],
        color: "yellow"
    },
    {
        label: "Snapchat Memories",
        command: "bun",
        args: ["snapchat-memories"],
        color: "yellow"
    },
    {
        label: "Adhoc",
        command: "bun",
        args: ["adhoc"],
        color: "green"
    }
];

async function executeScript(item: MenuItem, app: Instance) {
    app.unmount();

    const proc = spawn([item.command, ...item.args], {
        stdout: "inherit",
        stderr: "inherit",
        stdin: "ignore"
    });

    const exitCode = await proc.exited;

    if (exitCode === 0) {
        console.log(`\n✓ ${item.label} completed successfully\n`);
    } else {
        console.error(`\n✗ ${item.label} failed with exit code ${exitCode}\n`);
    }

    startMenu();
}

function startMenu() {
    const app = render(<MenuSelector items={menuItems} onSelect={item => executeScript(item, app)} />);
}

startMenu();
