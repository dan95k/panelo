export interface WebsiteBox {
    id: string;
    url: string;
    title?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export interface Dashboard {
    id: string;
    name: string;
    boxes: WebsiteBox[];
}

export interface AIResponse {
    action: 'add' | 'remove' | 'none' | 'error';
    url?: string;
    boxId?: string;
    message?: string;
}
