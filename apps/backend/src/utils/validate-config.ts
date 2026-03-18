import * as z from 'zod'

const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'provision'])
    .default('production'),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().positive(),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRATION_MINUTES: z.string().min(1)
})

export const validateConfig = (config: Record<string, any>) => {
  try {
    const parsed = configSchema.parse({
      ...config,
      DB_PORT: config.DB_PORT ? Number(config.DB_PORT) : undefined
    })
    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new Error(`Configuration validation failed: ${messages}`)
    }
    throw error
  }
}
