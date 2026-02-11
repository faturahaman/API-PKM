import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

export interface SanitizeHtmlOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
}

const sanitize = (sanitizeHtml as any).default || sanitizeHtml;

export function SanitizeHtml(options?: SanitizeHtmlOptions) {
    return Transform(({ value }) => {
        if (typeof value !== 'string') return value;

        const defaultOptions: sanitizeHtml.IOptions = {
            allowedTags: sanitize.defaults.allowedTags.concat(['img', 'h1', 'h2', 'u', 'span']),
            allowedAttributes: {
                ...sanitize.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height'],
                'a': ['href', 'target'],
                '*': ['style', 'class']
            },
            allowedSchemes: ['http', 'https', 'mailto'],
            allowedSchemesByTag: {
                img: ['http', 'https', 'data']
            }
        };

        return sanitize(value, {
            ...defaultOptions,
            ...options
        });
    });
}

export function SanitizeText() {
    return Transform(({ value }) => {
        if (typeof value !== 'string') return value;

        // Strip all tags and trim
        return sanitize(value, {
            allowedTags: [],
            allowedAttributes: {}
        }).trim();
    });
}
