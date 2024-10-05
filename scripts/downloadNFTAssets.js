const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const NFTCacheService = require("../src/services/NFTCacheService");

// Set up path to root directory
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

console.log("Environment variables loaded.");

// Define config based on environment variables
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

async function downloadNFTAssets() {
    console.log("Starting downloadNFTAssets function");

    try {
        const totalTokens = 1500; // Define the number of tokens you want to process

        for (let tokenId = 1; tokenId <= totalTokens; tokenId++) {
            try {
                console.log(`Processing token ${tokenId}...`);

                const metadataUrl = `${config.ipfsGateway}/${tokenId}`;

                console.log(`Fetching metadata from URL: ${metadataUrl}`);
                const metadata = await NFTCacheService.getMetadata(metadataUrl, tokenId);

                // Log the retrieved metadata
                console.log(`Metadata for token ${tokenId}:`, metadata);

                if (metadata.image) {
                    const imageUrl = convertIPFSUrl(metadata.image);
                    console.log(`Fetching image for token ${tokenId} from URL: ${imageUrl}`);
                    await NFTCacheService.getImage(imageUrl, tokenId);
                } else {
                    console.warn(`No image found for token ${tokenId}`);
                }

                console.log(`Token ${tokenId} processed successfully.`);
            } catch (error) {
                console.error(`Error processing token ${tokenId}:`, error);
            }

            // Add a small delay between requests to avoid overwhelming the gateways
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('Download completed.');
    } catch (error) {
        console.error("Error in downloadNFTAssets:", error);
    }
}
console.log("Script started");
downloadNFTAssets().catch(console.error).finally(() => {
    console.log("Script finished");
});