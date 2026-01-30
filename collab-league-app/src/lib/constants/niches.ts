export const NICHES = [
    { value: 'fashion', label: 'Fashion & Style' },
    { value: 'tech', label: 'Technology' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'fitness', label: 'Fitness & Health' },
    { value: 'beauty', label: 'Beauty & Skincare' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'business', label: 'Business & Finance' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'art', label: 'Art & Design' },
    { value: 'parenting', label: 'Parenting & Family' },
    { value: 'pets', label: 'Pets & Animals' },
    { value: 'home', label: 'Home & DIY' },
    { value: 'other', label: 'Other' }
] as const;

export type Niche = typeof NICHES[number]['value'];
