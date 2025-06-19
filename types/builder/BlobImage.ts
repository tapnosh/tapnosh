import { z } from "zod";

export const BlobImageSchema = z.object({
  url: z.string().url(),
  downloadUrl: z.string().url(),
  pathname: z.string(),
  contentType: z.string(),
  contentDisposition: z.string(),
});

export type BlobImage = z.infer<typeof BlobImageSchema>;
