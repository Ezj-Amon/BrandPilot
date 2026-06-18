// 生成 Session ID：时间戳 + 随机串，用于留档
export function generateSessionId(): string {
  const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BP-${ts}-${rand}`;
}
