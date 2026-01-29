/// <reference types="chrome" />
import type { WebsiteBox, Dashboard } from '../types';

const OLD_STORAGE_KEY = 'dashboard_boxes';
const STORAGE_KEY = 'dashboards_data';

export const storageService = {
    getDashboards: async (): Promise<Dashboard[]> => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.get([STORAGE_KEY, OLD_STORAGE_KEY], (result: { [key: string]: any }) => {
                    // Check for new format first
                    if (result[STORAGE_KEY]) {
                        resolve(result[STORAGE_KEY]);
                        return;
                    }

                    // Migration: Check for old format
                    if (result[OLD_STORAGE_KEY]) {
                        console.log('Migrating single dashboard to multi-dashboard format');
                        const defaultDashboard: Dashboard = {
                            id: 'default',
                            name: 'Main Dashboard',
                            boxes: result[OLD_STORAGE_KEY]
                        };
                        // Save immediately to new format
                        chrome.storage.local.set({ [STORAGE_KEY]: [defaultDashboard] });
                        resolve([defaultDashboard]);
                        return;
                    }

                    // Default empty state
                    const initial: Dashboard = { id: 'default', name: 'Main Dashboard', boxes: [] };
                    resolve([initial]);
                });
            });
        } else {
            // LocalStorage fallback
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return Promise.resolve(JSON.parse(stored));

            const oldStored = localStorage.getItem(OLD_STORAGE_KEY);
            if (oldStored) {
                const defaultDashboard: Dashboard = {
                    id: 'default',
                    name: 'Main Dashboard',
                    boxes: JSON.parse(oldStored)
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultDashboard]));
                return Promise.resolve([defaultDashboard]);
            }

            const initial: Dashboard = { id: 'default', name: 'Main Dashboard', boxes: [] };
            return Promise.resolve([initial]);
        }
    },

    saveDashboards: async (dashboards: Dashboard[]): Promise<void> => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [STORAGE_KEY]: dashboards }, () => resolve());
            });
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
            return Promise.resolve();
        }
    },

    // Deprecated but kept for compatibility calls if any remain (though we should update them)
    getBoxes: async (): Promise<WebsiteBox[]> => {
        console.warn('getBoxes is deprecated, use getDashboards');
        const dashboards = await storageService.getDashboards();
        return dashboards[0]?.boxes || [];
    },

    saveBoxes: async (boxes: WebsiteBox[]): Promise<void> => {
        console.warn('saveBoxes is deprecated, use saveDashboards');
        // This is risky as it might overwrite the first dashboard blindly, 
        // but strictly needed if we missed updating a caller.
        // Better to update all callers.
        const dashboards = await storageService.getDashboards();
        if (dashboards.length > 0) {
            dashboards[0].boxes = boxes;
            await storageService.saveDashboards(dashboards);
        }
    }
};
