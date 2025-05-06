import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  password: z.string().min(6, { message: 'パスワードは6文字以上です' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
