import { z } from "zod";

const fileSizeLimit = 5 * 1024 * 1024; // 5MB

export const ImageValidationSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg",
        "image/svg+xml",
      ].includes(file.type),
    { message: "Invalid image file type" },
  )
  .refine((file) => file.size <= fileSizeLimit, {
    message: `File size should not exceed ${fileSizeLimit}MB`,
  });

export const BlobImageSchema = z.object({
  url: z.string().url(),
  downloadUrl: z.string().url(),
  pathname: z.string(),
  contentType: z.string(),
  contentDisposition: z.string(),
});

export const UploadImageSchema = z.object({
  file: ImageValidationSchema,
  url: z.string().url(),
});

export type BlobImage = z.infer<typeof BlobImageSchema>;
export type UploadImage = z.infer<typeof BlobImageSchema>;
