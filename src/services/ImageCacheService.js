class ImageCacheService {
    constructor() {
        this.cacheKey = 'spaceshipImages';
    }

    getCachedImages() {
        const cachedData = localStorage.getItem(this.cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return {};
    }

    setCachedImages(images) {
        localStorage.setItem(this.cacheKey, JSON.stringify(images));
    }

    async loadImage(url) {
        const cachedImages = this.getCachedImages();
        if (cachedImages[url]) {
            return cachedImages[url];
        }

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            cachedImages[url] = imageUrl;
            this.setCachedImages(cachedImages);
            return imageUrl;
        } catch (error) {
            console.error('Error loading image:', error);
            return url;
        }
    }

    async loadImages(urls) {
        const imagePromises = urls.map(url => this.loadImage(url));
        const images = await Promise.all(imagePromises);
        return images;
    }
}

const imageCacheService = new ImageCacheService();
export default imageCacheService;
