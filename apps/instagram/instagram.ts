import { fileExists, formatTimestamp } from "@/utils/Utility.ts";
import { exiftool } from "exiftool-vendored";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function instagram(): Promise<void> {
    const inputFile = path.join(__dirname, "input", "posts_1.json");

    const inputData = await fs.readFile(inputFile, "utf-8");
    const inputJson = JSON.parse(inputData);

    const outputPath = path.join(__dirname, "output", "your-photos");

    await fs.mkdir(outputPath, {
        recursive: true
    });

    let updates = 0;

    for (const mediaCategory of inputJson) {
        for (const mediaFile of mediaCategory.media) {
            const folderName = mediaFile.uri.split("/")[2];

            const photo = mediaFile.uri.split("/")[3];
            const newDate = formatTimestamp(mediaFile.creation_timestamp);

            const photoPath = path.join(__dirname, "input", folderName, photo);
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
    }

    console.log(`Updated ${updates} photos`);
}

await instagram();
