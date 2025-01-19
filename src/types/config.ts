export interface SiteConfig {
    url: string;
    username: string;
    auth: string;
    authType: 'basic' | 'jwt';
}

export interface RawSiteConfig {
    URL: string;
    USER: string;
    PASS: string;
    authType?: string;
}

export interface SiteConfigurations {
    [alias: string]: SiteConfig;
}

export interface WordPressSiteResource {
    id: string;
    name: string;
    type: string;
    uri: string;
    metadata: {
        url: string;
        authType: string;
    };
}

export interface ErrorResponse {
    code: string;
    message: string;
    data?: any;
} 