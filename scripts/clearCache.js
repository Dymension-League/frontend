// deleteCache.js
const Redis = require('ioredis');

async function deleteCache() {
    const redis = new Redis();

    try {
        const clearKeys = async (pattern) => {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(keys);
            }
            return keys.length;
        };

        const [imageCount, metadataCount] = await Promise.all([
            clearKeys('image:*'),
            clearKeys('metadata:*')
        ]);

        console.log(`Cache cleared: ${imageCount} images, ${metadataCount} metadata entries.`);
        return imageCount + metadataCount;
    } catch (error) {
        console.error('Error clearing cache:', error);
        throw error;
    } finally {
        await redis.quit();
    }
}

(async () => {
    try {
        console.log('Running cache clearing operation...');
        const itemsCleared = await deleteCache();
        console.log(`Cache cleared. Total items cleared: ${itemsCleared}`);
    } catch (error) {
        console.error('Error clearing cache:', error);
    } finally {
        process.exit();
    }
})();