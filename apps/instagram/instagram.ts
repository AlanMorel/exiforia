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

    const outputPath = path.join(__dirname, "output");

    await fs.mkdir(outputPath, {
        recursive: true
    });

    const files = inputJson.flatMap((mediaCategory: any) => mediaCategory.media);

    const results = await Promise.all(
        files.map(async (file: any) => {
            const folderName = file.uri.split("/")[2];

            const photo = file.uri.split("/")[3];

            if (photo.includes("_original")) {
                return false;
            }

            const newDate = formatTimestamp(file.creation_timestamp);

            const photoPath = path.join(__dirname, "input", folderName, photo);
            const photoExists = await fileExists(photoPath);

            if (!photoExists) {
                console.error(`Photo ${photo} does not exist`);
                return false;
            }

            await exiftool.write(photoPath, {
                DateTimeOriginal: newDate,
                CreateDate: newDate,
                ModifyDate: newDate
            });

            console.log(`Updated ${photo} to ${newDate}`);

            const writePath = path.join(outputPath, photo);

            await fs.copyFile(photoPath, writePath);

            return true;
        })
    );

    await exiftool.end();

    const updates = results.filter(Boolean).length;

    console.log(`Updated ${updates} photos`);
}

await instagram();
