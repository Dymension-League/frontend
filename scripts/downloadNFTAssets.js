const path = require("path");
const dotenv = require("dotenv");
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const NFTCacheService = require("../src/services/NFTCacheService");
// Set up path to root directory
const rootDir = path.resolve(__dirname, '..');
const fs = require('fs').promises;

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

const config = {
    ipfsGateway: process.env.REACT_APP_IPFS_GATEWAY || "http://localhost:8080/ipfs/",
};

console.log("Config loaded:", config);

const IPFS_GATEWAYS = [
    config.ipfsGateway,
    "http://localhost:8080/ipfs/",  // Local IPFS node
    "https://ipfs.io/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://gateway.pinata.cloud/ipfs/",
];
const METADATA_CID = 'bafybeicfhwtczkruomu6cvl6wj7pix5inme4hknozepvjbfkunigtgvdku';

console.log("Constants set:", { IPFS_GATEWAYS, METADATA_CID });

async function checkAllFilesExist(totalTokens, NFTCacheService) {
    const metadataFiles = await fs.readdir(NFTCacheService.metadataDir);
    const imageFiles = await fs.readdir(NFTCacheService.imagesDir);

    return metadataFiles.length === totalTokens && imageFiles.length === totalTokens;
}

// Include the convertIPFSUrl function directly in this file
function convertIPFSUrl(url) {
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

        // Handle URLs that already have CID and file path, e.g. /ipfs/<cid>/<file>
        const parts = url.split('/');
        const cid = parts[parts.length - 2]; // Extract the CID
        const filePath = parts[parts.length - 1]; // Extract the file path (e.g., 3.mp4)

        return `https://ipfs.io/ipfs/${cid}/${filePath}`;
    } catch (error) {
        console.error('Error converting IPFS URL:', error);
        return '';
    }
}


async function processToken(tokenId, config, NFTCacheService) {
    try {
        console.log(`Processing token ${tokenId}...`);

        const metadataPath = path.join(NFTCacheService.metadataDir, `${tokenId}.json`);
        let metadata;

        // Check if metadata file exists
        if (await fs.access(metadataPath).then(() => true).catch(() => false)) {
            console.log(`Metadata for token ${tokenId} already exists, reading from file.`);
            metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
        } else {
            const metadataUrl = `${config.ipfsGateway}/${tokenId}`;
            metadata = await retryWithBackoff(async () => {
                console.log(`Fetching metadata from URL: ${metadataUrl}`);
                return await NFTCacheService.getMetadata(metadataUrl, tokenId);
            });
        }

        console.log(`Metadata for token ${tokenId}:`, metadata);

        if (metadata.image) {
            const imageUrl = convertIPFSUrl(metadata.image);
            const imagePath = path.join(NFTCacheService.imagesDir, path.basename(imageUrl));

            // Check if image file exists
            if (await fs.access(imagePath).then(() => true).catch(() => false)) {
                console.log(`Image for token ${tokenId} already exists at ${imagePath}`);
            } else {
                await retryWithBackoff(async () => {
                    console.log(`Fetching image for token ${tokenId} from URL: ${imageUrl}`);
                    await NFTCacheService.getImage(imageUrl, tokenId);
                });
            }
        } else {
            console.warn(`No image found for token ${tokenId}`);
        }

        console.log(`Token ${tokenId} processed successfully.`);
    } catch (error) {
        console.error(`Error processing token ${tokenId}:`, error);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
}

async function retryWithBackoff(fn, maxRetries = 5, initialDelay = 1000) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            retries++;
            if (retries === maxRetries) throw error;
            const delay = initialDelay * Math.pow(2, retries);
            console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function downloadNFTAssets() {
    console.log("Starting downloadNFTAssets function");

    const totalTokens = 1500;
    if (await checkAllFilesExist(totalTokens, NFTCacheService)) {
        console.log("All files already exist. No download necessary.");
        return;
    }
    const numWorkers = 4; // !!Number of workers to spawn - can be adjusted based on system resources
    const tokensPerWorker = Math.ceil(totalTokens / numWorkers);

    const workers = [];

    for (let i = 0; i < numWorkers; i++) {
        const startToken = i * tokensPerWorker + 1;
        const endToken = Math.min((i + 1) * tokensPerWorker, totalTokens);

        workers.push(new Worker(__filename, {
            workerData: { startToken, endToken, config }
        }));
    }

    for (const worker of workers) {
        worker.on('message', console.log);
        worker.on('error', console.error);
        worker.on('exit', (code) => {
            if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
        });
    }

    await Promise.all(workers.map(worker => new Promise(resolve => worker.on('exit', resolve))));
    console.log('Download completed.');
}

if (isMainThread) {
    console.log("Script started");
    downloadNFTAssets().catch(console.error).finally(() => {
        console.log("Script finished");
    });
} else {
    const { startToken, endToken, config } = workerData;

    (async () => {
        for (let tokenId = startToken; tokenId <= endToken; tokenId++) {
            await processToken(tokenId, config, NFTCacheService);
        }
        parentPort.postMessage(`Worker finished processing tokens ${startToken} to ${endToken}`);
    })();
}

console.log("Script started");
downloadNFTAssets().catch(console.error).finally(() => {
    console.log("Script finished");
});