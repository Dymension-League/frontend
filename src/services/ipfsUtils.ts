export const convertIPFSUrl = (url: string) => {
    if (url.startsWith('https://ipfs.io/ipfs/')) {
        return url;
    }
    const path = url.split('/').slice(-2).join('/');
    return `https://ipfs.io/ipfs/${path}`;
};