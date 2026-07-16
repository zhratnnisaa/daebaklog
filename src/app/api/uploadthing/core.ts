import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  idolPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Belum ada auth (Step 6), jadi sementara bebas akses.
      // Nanti setelah proxy.ts + NextAuth jadi, cek role ADMIN di sini.
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload selesai:", file.url);
      return { url: file.url };
    }),
    
  boyGroupLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => ({ url: file.url })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
