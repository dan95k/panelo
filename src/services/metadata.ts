
export const fetchPageTitle = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return doc.title || url;
    } catch (error) {
        console.error('Failed to fetch title for:', url, error);
        return url;
    }
};
