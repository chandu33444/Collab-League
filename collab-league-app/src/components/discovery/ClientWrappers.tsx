'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FilterPanel } from './FilterPanel';
import { SearchBar } from './SearchBar';
import { SortDropdown } from './SortDropdown';
import { Pagination } from './Pagination';

export function FilterWrapper({ initialFilters }: { initialFilters: any }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleFilterChange = (newFilters: any) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update params
        if (newFilters.niche) params.set('niche', newFilters.niche);
        else params.delete('niche');

        if (newFilters.platform) params.set('platform', newFilters.platform);
        else params.delete('platform');

        if (newFilters.minFollowers) params.set('minFollowers', newFilters.minFollowers.toString());
        else params.delete('minFollowers');

        if (newFilters.maxFollowers) params.set('maxFollowers', newFilters.maxFollowers.toString());
        else params.delete('maxFollowers');

        // Reset page on filter change
        params.set('page', '1');

        router.push(`${pathname}?${params.toString()}`);
    }

    return <FilterPanel filters={initialFilters} onChange={handleFilterChange} />;
}

export function SearchWrapper({ initialValue }: { initialValue: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set('search', value);
        else params.delete('search');
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    }

    return <SearchBar initialValue={initialValue} onSearch={handleSearch} />;
}

export function SortWrapper({ initialValue }: { initialValue: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', value);
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    }

    return <SortDropdown value={initialValue} onChange={handleSort} />;
}

export function PaginationWrapper({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    }

    return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />;
}
