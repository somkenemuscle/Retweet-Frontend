import { createUploadthing, type FileRouter } from "uploadthing/next";

// Create UploadThing instance
const f = createUploadthing();

// FileRouter for simple image uploading without fake auth or complex middleware
export const ourFileRouter = {
  media: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      // Return data for client callback if needed
      return { uploadedFileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
