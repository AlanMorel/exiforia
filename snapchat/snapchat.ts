import { fileExists } from "@/utils/Utility.ts";
import { exiftool } from "exiftool-vendored";
import { promises as fs } from "node:fs";
import path from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results: Record<string, string> = {};

async function readMemories(directory: string): Promise<void> {
    try {
        const files = await fs.readdir(directory);

        console.log("Memories in directory:");
        console.log(files.length);

        for (const file of files) {
            const extension = path.extname(file);

            if (!extension) {
                console.error(`Extension not found in file: ${file}`);
                continue;
            }

            if (extension === ".html") {
                console.log(`Skipping non-JPG file: ${file}`);
                continue;
            }

            const date = file.split("_")[0];

            if (!date) {
                console.error(`Date not found in file name: ${file}`);
                continue;
            }

            const year = date.substring(0, 4);
            const month = date.substring(5, 7);
            const day = date.substring(8, 10);

            results[file] = `${year}:${month}:${day} 12:00:00`;
        }
    } catch (err) {
        console.error("Error updating photos in directory:", err);
    }
}

const subfolder = process.argv[2];

if (!subfolder) {
    console.error("Subfolder not provided");
    exit(1);
}

const inputPath = path.join(__dirname, "input", subfolder);

await readMemories(inputPath);

const outputPath = path.join(__dirname, "output", subfolder);

await fs.mkdir(outputPath, {
    recursive: true
});

let updates = 0;

for (const [photo, newDate] of Object.entries(results)) {
    if (photo.includes("_original")) {
        continue;
    }

    const photoPath = path.join(__dirname, "input", subfolder, photo);
    const photoExists = await fileExists(photoPath);

    if (!photoExists) {
        console.error(`Photo ${photo} does not exist`);
        continue;
    }

    await exiftool.write(photoPath, {
        DateTimeOriginal: newDate,
        CreateDate: newDate,
        ModifyDate: newDate
    });

    console.log(`Updated ${photo} to ${newDate}`);
    updates++;

    const writePath = path.join(__dirname, "output", subfolder, photo);

    await fs.copyFile(photoPath, writePath);
}

console.log("All memories updated successfully!");
