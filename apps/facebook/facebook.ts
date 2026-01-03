import { cleanFileName, fileExists, formatDate } from "@/utils/Utility.ts";
import { exiftool } from "exiftool-vendored";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readAllAlbums(directory: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    const files = await fs.readdir(directory);

    console.log(`Reading ${files.length} album jsons in directory: ${directory}`);

    for (const file of files) {
        const filePath = `${directory}/${file}`;

        const data = await fs.readFile(filePath, "utf-8");

        const jsonData = JSON.parse(data);

        const photos = jsonData.photos;

        for (const photo of photos) {
            const uri = photo.uri;
            const fileName = uri.split("/").pop();

            if (!fileName) {
                console.error(`File name not found for URI: ${uri}`);
                continue;
            }

            const cleanedFileName = cleanFileName(fileName);
            const timestamp =
                photo.media_metadata?.photo_metadata?.exif_data?.[0]?.taken_timestamp ?? photo.creation_timestamp;

            const date = new Date(timestamp * 1000);

            results[cleanedFileName] = formatDate(date);
        }
    }

    return results;
}

async function facebook(): Promise<void> {
    const albumsPath = path.join(__dirname, "input", "albums");

    const albums = await readAllAlbums(albumsPath);

    const outputPath = path.join(__dirname, "output", "your-photos");

    await fs.mkdir(outputPath, {
        recursive: true
    });

    const results = await Promise.all(
        Object.entries(albums).map(async ([photo, newDate]) => {
            if (photo.includes("_original")) {
                return false;
            }

            const photoPath = path.join(__dirname, "input", "your-photos", photo);
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

await facebook();
