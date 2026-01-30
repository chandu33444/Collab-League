export const INDUSTRIES = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS & Technology' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'food-beverage', label: 'Food & Beverage' },
    { value: 'health-wellness', label: 'Health & Wellness' },
    { value: 'beauty-cosmetics', label: 'Beauty & Cosmetics' },
    { value: 'travel-hospitality', label: 'Travel & Hospitality' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'education', label: 'Education & Training' },
    { value: 'finance', label: 'Finance & Insurance' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'sports-fitness', label: 'Sports & Fitness' },
    { value: 'gaming', label: 'Gaming & Esports' },
    { value: 'marketing-agency', label: 'Marketing Agency' },
    { value: 'nonprofit', label: 'Nonprofit & Social Cause' },
    { value: 'other', label: 'Other' }
] as const;

export type Industry = typeof INDUSTRIES[number]['value'];

export const COMPANY_SIZES = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1,000 employees' },
    { value: '1000+', label: '1,000+ employees' }
] as const;

export type CompanySize = typeof COMPANY_SIZES[number]['value'];
