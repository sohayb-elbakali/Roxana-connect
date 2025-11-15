// Memory and Cache Management Utility

class CacheManager {
  constructor() {
    this.caches = new Map();
    this.maxSize = 1000; // Maximum items per cache
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  /**
   * Create or get a named cache
   */
  getCache(name, ttl = this.defaultTTL) {
    if (!this.caches.has(name)) {
      this.caches.set(name, {
        data: new Map(),
        ttl: ttl,
        hits: 0,
        misses: 0
      });
    }
    return this.caches.get(name);
  }

  /**
   * Set item in cache
   */
  set(cacheName, key, value, customTTL = null) {
    const cache = this.getCache(cacheName);
    const ttl = customTTL || cache.ttl;
    
    // Implement LRU eviction if cache is full
    if (cache.data.size >= this.maxSize) {
      const firstKey = cache.data.keys().next().value;
      cache.data.delete(firstKey);
    }
    
    cache.data.set(key, {
      value: value,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    });
  }

  /**
   * Get item from cache
   */
  get(cacheName, key) {
    const cache = this.getCache(cacheName);
    const item = cache.data.get(key);
    
    if (!item) {
      cache.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expires) {
      cache.data.delete(key);
      cache.misses++;
      return null;
    }
    
    cache.hits++;
    return item.value;
  }

  /**
   * Delete item from cache
   */
  delete(cacheName, key) {
    const cache = this.getCache(cacheName);
    return cache.data.delete(key);
  }

  /**
   * Clear entire cache
   */
  clear(cacheName) {
    const cache = this.getCache(cacheName);
    cache.data.clear();
    cache.hits = 0;
    cache.misses = 0;
  }

  /**
   * Clear all caches
   */
  clearAll() {
    this.caches.forEach(cache => {
      cache.data.clear();
      cache.hits = 0;
      cache.misses = 0;
    });
  }

  /**
   * Get cache statistics
   */
  getStats(cacheName = null) {
    if (cacheName) {
      const cache = this.getCache(cacheName);
      return {
        size: cache.data.size,
        hits: cache.hits,
        misses: cache.misses,
        hitRate: cache.hits / (cache.hits + cache.misses) || 0
      };
    }
    
    // Return stats for all caches
    const stats = {};
    this.caches.forEach((cache, name) => {
      stats[name] = {
        size: cache.data.size,
        hits: cache.hits,
        misses: cache.misses,
        hitRate: cache.hits / (cache.hits + cache.misses) || 0
      };
    });
    return stats;
  }

  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    this.caches.forEach(cache => {
      cache.data.forEach((item, key) => {
        if (now > item.expires) {
          cache.data.delete(key);
          cleaned++;
        }
      });
    });
    
    return cleaned;
  }

  /**
   * Start automatic cleanup interval
   */
  startAutoCleanup(interval = 60000) { // Default: 1 minute
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = setInterval(() => {
      const cleaned = this.cleanup();
      if (cleaned > 0) {
        console.log(`[CacheManager] Cleaned ${cleaned} expired entries`);
      }
    }, interval);
  }

  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
const cacheManager = new CacheManager();

// Start automatic cleanup
if (typeof window !== 'undefined') {
  cacheManager.startAutoCleanup();
  
  // Clear cache on page unload
  window.addEventListener('beforeunload', () => {
    cacheManager.clearAll();
  });
}

export default cacheManager;

/**
 * Usage Examples:
 * 
 * // Store user profile with 10 minute TTL
 * cacheManager.set('profiles', userId, profileData, 10 * 60 * 1000);
 * 
 * // Retrieve from cache
 * const profile = cacheManager.get('profiles', userId);
 * 
 * // Delete specific item
 * cacheManager.delete('profiles', userId);
 * 
 * // Clear all profiles
 * cacheManager.clear('profiles');
 * 
 * // Get stats
 * console.log(cacheManager.getStats('profiles'));
 */
