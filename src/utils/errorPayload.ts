export function errBody(errno: number, reason: string) {
  return {
    errno: errno,
    reason: reason,
  };
}
