# exiforia

Update your photos from Facebook, Instagram, and Snapchat with exif data after exporting.

When you export your photos from Facebook, Instagram, and Snapchat, the exif data on your photos are not preserved. This is a problem because when you import those photos into another photo management software, the order of your photos will not be correct. This tool will help you automatically update the exif data of your photos, allowing for easy importing.

## Installation

Install bun, clone this repository, then install the dependencies

```sh
git clone https://github.com/AlanMorel/exiforia.git
```

```sh
cd exiforia
```

```sh
bun install
```

## Usage

### Facebook

Export your Facebook data using the export tool.

Create a `facebook/input/albums` folder and put your album data JSON in it.

For example, a `0.json` file might look like this:

```json
{
  "name": "Cover photos",
  "photos": [
    {
      "uri": "your_facebook_activity/posts/media/id/filename.jpg",
      "creation_timestamp": 1000000000,
      "media_metadata": {
        "photo_metadata": {
          "exif_data": [
            {
              "upload_ip": "xx.xx.xx.xx"
            }
          ]
        }
      },
      "title": "Cover photos",
      "backup_uri": "https://facebook.com/"
    },
  ],
  "cover_photo": {
    "uri": "https://facebook.com/",
    "creation_timestamp": 1000000000,
    "media_metadata": {
      "photo_metadata": {
        "exif_data": [
          {
            "upload_ip": "xx.xx.xx.xx"
          }
        ]
      }
    },
    "title": "Cover photos",
    "backup_uri": "https://facebook.com/"
  },
  "last_modified_timestamp": 1000000000,
  "description": ""
}
```

Create a `facebook/input/your-photos` folder and put your photos in it.

Run the script to update your Facebook photos:

```sh
bun facebook
```

The output will be in the `facebook/output/your-photos` folder.

### Instagram

Export your Instagram data using the export tool.

Create a `instagram/input` folder and put your photos in it, grouped by year and month. For example, like a `202601` folder.

Make sure this folder also contains a `instagram/input/posts_1.json` file.

This looks like this:

```json
[
  {
    "media": [
      {
        "uri": "media/posts/202601/filename.jpg",
        "creation_timestamp": 1000000000,
        "media_metadata": {
          "camera_metadata": {
            "has_camera_metadata": false
          }
        },
        "title": "",
        "cross_post_source": {
          "source_app": "FB"
        }
      }
    ]
  }
]
```

Run the script to update your Instagram photos:

```sh
bun instagram
```

The output will be in the `instagram/output` folder.

### Snapchat

Export your Snapchat data using the export tool.

Create a `snapchat/input/chat_media` and `snapchat/input/memories` folder and put your chat media and memories in it.

Run the script to update your Snapchat photos and videos:

```sh
bun snapchat-chat-media
bun snapchat-memories
```

The output will be in the `snapchat/output/chat_media` and `snapchat/output/memories` folders.

### Adhoc

You can also use the adhoc script to update the exif data of any number of photos and videos.

Create a `adhoc/input` folder and put your photos and videos in it.

Update the `newDates` object with the new dates you want to apply to your photos and videos.

```ts
const newDates = {
    "a.jpg": "2026:01:01 12:00:00"
};
```

Run the script to update your photos and videos:

```sh
bun adhoc
```

The output will be in the `adhoc/output` folder.

## License

This code is licensed under the [AGPL-3.0 license](LICENSE).
