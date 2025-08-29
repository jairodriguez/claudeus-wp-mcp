import { config } from 'dotenv';
import { SiteConfig, RawSiteConfig, SiteConfigurations } from './types/config.js';
import fs from 'fs';

config();

export const DEFAULT_SITE = 'aiwithjai';

export function loadSiteConfigurations(configPath: string): SiteConfigurations {
    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const config: SiteConfigurations = {};

    for (const [alias, site] of Object.entries(rawConfig)) {
        const rawSite = site as RawSiteConfig;
        config[alias] = {
            url: rawSite.URL,
            username: rawSite.USER,
            auth: Buffer.from(`${rawSite.USER}:${rawSite.PASS}`).toString('base64'),
            authType: (rawSite.authType || 'basic') as 'basic' | 'jwt',
            capabilities: rawSite.capabilities
        };
    }

    return config;
} 