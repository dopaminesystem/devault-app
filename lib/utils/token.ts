/**
 * Check if a token is expired or expiring soon.
 * Single responsibility: Token expiration calculation.
 */
export function isTokenExpiringSoon(
    expiresAt: Date | null | undefined,
    bufferMs: number = 24 * 60 * 60 * 1000 // default 1 day
): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() < Date.now() + bufferMs;
}
