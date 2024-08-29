export const convertIPFSUrl = (url: string | undefined): string => {
    if (!url || typeof url !== 'string') {
        console.error('Invalid IPFS URL:', url);
        return '';
    }
    if (url.startsWith('https://ipfs.io/ipfs/')) {
        return url;
    }
    try {
        const path = url.split("/").slice(-2).join("/");
        return `https://ipfs.io/ipfs/${path}`;
    } catch (error) {
        console.error('Error converting IPFS URL:', error);
        return '';
    }
};