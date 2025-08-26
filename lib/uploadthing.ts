// app/lib/uploadthing.ts  (或者你放置该文件的任何位置)

import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// 使用新的 generateReactHelpers
export const { useUploadThing, uploadFiles } =
    generateReactHelpers<OurFileRouter>();