import { z } from 'zod';

export const watchSchema = z.object({
  code: z
    .string()
    .regex(/^\d{4}$/, { message: '銘柄コードは4桁の数字で入力してください' }),
});

export type WatchInput = z.infer<typeof watchSchema>;
