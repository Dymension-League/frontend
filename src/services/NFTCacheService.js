const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const Redis = require('ioredis');

class NFTCacheService {
    constructor() {
        this.redis = null;
        this.connectRedis();
        this.imagesDir = path.join(process.cwd(), 'public', 'nfts', 'images');
        this.metadataDir = path.join(process.cwd(), 'public', 'nfts', 'metadata');
        this.ensureDirectories();
    }

    connectRedis() {
        try {
            this.redis = new Redis();
            this.redis.on('error', (error) => {
                console.error('Redis connection error:', error);
                this.redis = null;
            });
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            this.redis = null;
        }
    }

    ensureDirectories() {
        if (!fs.existsSync(this.imagesDir)) {
            fs.mkdirSync(this.imagesDir, { recursive: true });
        }
        if (!fs.existsSync(this.metadataDir)) {
            fs.mkdirSync(this.metadataDir, { recursive: true });
        }
    }

    // Retry mechanism with exponential backoff
    retry = async (fn, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
                console.log(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    };

    async getCachedImage(url) {
        if (this.redis) {
            const cacheKey = `image:${url}`;
            return await this.redis.get(cacheKey);
        }
        return null;
    }

    async setCachedImage(url, localPath) {
        if (this.redis) {
            const cacheKey = `image:${url}`;
            await this.redis.set(cacheKey, localPath, 'EX', 7 * 24 * 60 * 60); // Cache for 7 days
        }
    }

    async getCachedMetadata(tokenId) {
        if (this.redis) {
            const cacheKey = `metadata:${tokenId}`;
            const cachedMetadata = await this.redis.get(cacheKey);
            if (cachedMetadata) {
                return JSON.parse(cachedMetadata);
            }
        }
        return null;
    }

    async setCachedMetadata(tokenId, metadata) {
        if (this.redis) {
            const cacheKey = `metadata:${tokenId}`;
            await this.redis.set(cacheKey, JSON.stringify(metadata), 'EX', 7 * 24 * 60 * 60); // Cache for 7 days
        }
    }

    async downloadMetadata(url, tokenId) {
        const localPath = path.join(this.metadataDir, `${tokenId}.json`);

        if (fs.existsSync(localPath)) {
            return JSON.parse(fs.readFileSync(localPath, 'utf-8'));
        }

        // Use retry for metadata download
        try {
            const metadata = await this.retry(async () => {
                const response = await fetch(url); // Fetch the metadata
                if (!response.ok) {
                    console.error(`Failed to fetch metadata from ${url}: ${response.statusText}`);
                    throw new Error(`Failed to fetch metadata from ${url}: ${response.statusText}`);
                }
                return await response.json();
            });

            fs.writeFileSync(localPath, JSON.stringify(metadata, null, 2)); // Save metadata locally

            return metadata;
        } catch (error) {
            console.error(`Failed to download metadata for token ${tokenId}:`, error);
            throw error;
        }
    }

    async downloadImage(url, tokenId) {
        const fileName = path.basename(new URL(url).pathname); // Extract the filename from the URL
        const localPath = path.join(this.imagesDir, fileName);

        console.log(`Starting to download image for token ${tokenId} from URL: ${url}`);

        // Check if the file already exists
        if (fs.existsSync(localPath)) {
            console.log(`File already exists at ${localPath}`);
            return localPath;
        }

        const convertedUrl = this.convertIPFSUrl(url); // Get the correct IPFS URL

        // Use the retry function for image download
        try {
            await this.retry(async () => {
                console.log(`Fetching content from converted URL: ${convertedUrl}`);
                const response = await fetch(convertedUrl); // Fetch the content from the IPFS URL
                if (!response.ok) {
                    console.error(`Failed to fetch from ${convertedUrl}: ${response.statusText}`);
                    throw new Error(`Failed to fetch from ${convertedUrl}: ${response.statusText}`);
                }

                const buffer = await response.buffer(); // Get the content as a buffer
                fs.writeFileSync(localPath, buffer); // Write the buffer to a file
                console.log(`Successfully downloaded image for token ${tokenId} and saved to ${localPath}`);
            });

            return localPath;
        } catch (error) {
            console.error(`Failed to download image after multiple retries for token ${tokenId}:`, error);
            throw error;
        }
    }

    async getImage(url, tokenId) {
        let localPath = await this.getCachedImage(url);

        if (!localPath) {
            localPath = await this.downloadImage(url, tokenId);
            await this.setCachedImage(url, localPath);
        }

        return localPath;
    }

    async getMetadata(url, tokenId) {
        let metadata = await this.getCachedMetadata(tokenId);

        if (!metadata) {
            metadata = await this.downloadMetadata(url, tokenId);
            await this.setCachedMetadata(tokenId, metadata);
        }

        return metadata;
    }

    // Convert IPFS URL
    convertIPFSUrl(url) {
        if (!url || typeof url !== 'string') {
            console.error('Invalid IPFS URL:', url);
            return '';
        }

        // If the URL already uses a localhost IPFS gateway, return it as-is
        if (url.includes('ipfs.localhost')) {
            return url;
        }

        // If the URL is using the ipfs.io gateway, return it as-is
        if (url.startsWith('https://ipfs.io/ipfs/')) {
            return url;
        }

        try {
            if (url.startsWith('ipfs://')) {
                const cid = url.split('ipfs://').pop().split('/')[0];
                const path = url.split(cid).pop(); // Extract the file path
                return `https://ipfs.io/ipfs/${cid}${path}`;
            }

            const parts = url.split('/');
            const cid = parts[parts.length - 2];
            const filePath = parts[parts.length - 1];

            return `https://ipfs.io/ipfs/${cid}/${filePath}`;
        } catch (error) {
            console.error('Error converting IPFS URL:', error);
            return '';
        }
    }
}

module.exports = new NFTCacheService();