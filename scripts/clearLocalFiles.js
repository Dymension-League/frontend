// deleteLocal.js
const fs = require('fs').promises;
const path = require('path');

async function deleteLocal() {
    const imagesDir = path.join(process.cwd(), 'public', 'nfts', 'images');
    const metadataDir = path.join(process.cwd(), 'public', 'nfts', 'metadata');

    const deleteFiles = async (dir) => {
        const files = await fs.readdir(dir);
        await Promise.all(files.map(file => fs.unlink(path.join(dir, file))));
        return files.length;
    };

    try {
        const [imagesDeleted, metadataDeleted] = await Promise.all([
            deleteFiles(imagesDir),
            deleteFiles(metadataDir)
        ]);

        console.log(`Deleted ${imagesDeleted} image files and ${metadataDeleted} metadata files.`);
        return imagesDeleted + metadataDeleted;
    } catch (error) {
        console.error('Error deleting local files:', error);
        throw error;
    }
}

(async () => {
    try {
        console.log('Running local file deletion operation...');
        const itemsDeleted = await deleteLocal();
        console.log(`Local files deleted. Total items deleted: ${itemsDeleted}`);
    } catch (error) {
        console.error('Error deleting local files:', error);
    } finally {
        process.exit();
    }
})();