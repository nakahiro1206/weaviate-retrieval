import { z } from "zod";

export const PaperInfoSchema = z.object({
    type: z.string(),
    id: z.string(),
    abstract: z.string().optional(),
    title: z.string(),
    author: z.string(),
    journal: z.string().optional(),
    volume: z.string().optional(),
    number: z.string().optional(),
    pages: z.string().optional(),
    year: z.string().optional(),
    publisher: z.string().optional(),
});
export type PaperInfo = z.infer<typeof PaperInfoSchema>;

export const PaperEntrySchema = z.object({
    summary: z.string(),
    comment: z.string().optional(),
    info: PaperInfoSchema,
});
  
export type PaperEntry = z.infer<typeof PaperEntrySchema>;

export const RetrievedPaperEntrySchema = z.object({
    metadata: z.object({
    uuid: z.string(),
    distance: z.number().optional(),
}),
...PaperEntrySchema.shape,
});

export type RetrievedPaperEntry = z.infer<typeof RetrievedPaperEntrySchema>;
export const RetrievedPaperEntryArraySchema = z.array(RetrievedPaperEntrySchema);