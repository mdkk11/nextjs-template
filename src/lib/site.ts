import { env } from "@/lib/env";

export const getSiteUrl = (): URL => new URL(env.APP_URL);
