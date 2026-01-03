import { fileExists } from "@/utils/Utility.ts";
import { exiftool } from "exiftool-vendored";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const newDates = {
    "a.jpg": "2026:01:01 12:00:00"
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function adhoc(): Promise<void> {
    const outputPath = path.join(__dirname, "output");

    await fs.mkdir(outputPath, {
        recursive: true
    });

    let updates = 0;

    for (const [photo, newDate] of Object.entries(newDates)) {
        if (photo.includes("_original")) {
            continue;
        }

        const photoPath = path.join(__dirname, "input", photo);
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

        const writePath = path.join(__dirname, "output", photo);

        await fs.copyFile(photoPath, writePath);
    }

    await exiftool.end();

    console.log(`Updated ${updates} photos`);
}

await adhoc();
