import { openDB } from 'idb';

class ImageCacheService {
    constructor() {
        this.dbPromise = openDB('ImageCache', 1, {
            upgrade(db) {
                db.createObjectStore('images');
            },
        });
        this.cacheLimit = 50 * 1024 * 1024;
        this.cacheExpiration = 7 * 24 * 60 * 60 * 1000;
    }

    async getCachedImage(url) {
        const db = await this.dbPromise;
        const tx = db.transaction('images', 'readonly');
        const store = tx.objectStore('images');
        const cachedImage = await store.get(url);

        if (cachedImage && Date.now() - cachedImage.timestamp < this.cacheExpiration) {
            return cachedImage.data;
        }

        return null;
    }

    async setCachedImage(url, data) {
        const db = await this.dbPromise;
        const tx = db.transaction('images', 'readwrite');
        const store = tx.objectStore('images');
        await store.put({ data, timestamp: Date.now() }, url);
        await this.pruneCache();
    }

    async pruneCache() {
        const db = await this.dbPromise;
        const tx = db.transaction('images', 'readwrite');
        const store = tx.objectStore('images');
        const keys = await store.getAllKeys();

        let totalSize = 0;
        const now = Date.now();

        for (const key of keys) {
            const item = await store.get(key);
            totalSize += item.data.length;

            if (now - item.timestamp > this.cacheExpiration) {
                await store.delete(key);
            }
        }

        while (totalSize > this.cacheLimit && keys.length > 0) {
            const oldestKey = keys.shift();
            const oldestItem = await store.get(oldestKey);
            totalSize -= oldestItem.data.length;
            await store.delete(oldestKey);
        }
    }

    async loadImage(url) {
        const cachedImage = await this.getCachedImage(url);
        if (cachedImage) {
            return cachedImage;
        }

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            await this.setCachedImage(url, imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('Error loading image:', error);
            return url;
        }
    }

    async lazyLoadImage(url, imageElement) {
        const cachedImage = await this.getCachedImage(url);
        if (cachedImage) {
            imageElement.src = cachedImage;
        } else {
            const observer = new IntersectionObserver(async (entries) => {
                if (entries[0].isIntersecting) {
                    imageElement.src = await this.loadImage(url);
                    observer.disconnect();
                }
            });
            observer.observe(imageElement);
        }
    }
}

const imageCacheService = new ImageCacheService();
export default imageCacheService;
