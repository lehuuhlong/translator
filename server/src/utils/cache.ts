interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class Cache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private readonly ttlMs: number;

  constructor(ttlSeconds: number) {
    this.ttlMs = ttlSeconds * 1000;
  }

  set(key: string, value: T): void {
    this.store.set(key, {
      value,
      expiry: Date.now() + this.ttlMs,
    });
  }

  get(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // For testing and monitoring
  size(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}
