export const PLATFORMS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'twitter', label: 'X (Twitter)' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'other', label: 'Other' }
] as const;

export type Platform = typeof PLATFORMS[number]['value'];
