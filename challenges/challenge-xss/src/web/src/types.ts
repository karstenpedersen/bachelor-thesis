import { z } from "zod";

/**
 * Zod schema for JWTPayload.
 */
export const JWTPayloadSchema = z.object({
  userId: z.number()
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

/**
 * Zod schema for AppVariables.
 */
export const AppVariablesSchema = z.object({
  isLoggedIn: z.boolean(),
  jwtPayload: JWTPayloadSchema.optional(),
})

/** 
 * Hono app variables.
 */
export type AppVariables = z.infer<typeof AppVariablesSchema>;
