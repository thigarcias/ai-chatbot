export function getProxyUrl(): string | undefined {
  return process.env.RECORD_TRAFFIC === "true" ? process.env.PROXY_URL : undefined
}

export function initializeProxy(): void {
}
