/**
 * useApi - Generic API data fetching hook with static fallback support
 */
import { useState, useEffect } from 'react';

const BASE = '/api';

// Generic fetch helper
async function apiFetch<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
    return res.json();
}

// ---- Menu ----
export interface NavItemApi {
    id: number;
    title: { zh: string; en: string };
    href: string;
    parentId: number | null;
    sortOrder: number;
    isActive: boolean;
    children?: NavItemApi[];
    linkedPage?: { slug: string; type: string };
}

export const useMenuItems = () => {
    const [items, setItems] = useState<NavItemApi[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch<NavItemApi[]>(`${BASE}/menus`)
            .then(setItems)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return { items, loading };
};

// ---- Pages (Products/Solutions) ----
export interface PageApiData {
    id: number;
    type: 'product' | 'solution';
    slug: string;
    title: { zh: string; en: string };
    subtitle?: { zh: string; en: string };
    description?: { zh: string; en: string };
    heroImage?: string;
    tag?: string;
    isActive: boolean;
    sortOrder: number;
    categoryId?: number;
    content?: {
        features?: Array<{ title: { zh: string; en: string } | string; desc: { zh: string; en: string } | string }>;
        advantages?: Array<{ title: { zh: string; en: string } | string; desc: { zh: string; en: string } | string }>;
        useCases?: Array<{ title: string; desc: string }>;
        needs?: string;
        solutionDesc?: string;
    };
    categoryInfo?: {
        id: number;
        slug: string;
        title: { zh: string; en: string };
    };
}

export const usePages = (type?: 'product' | 'solution') => {
    const [pages, setPages] = useState<PageApiData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = type ? `${BASE}/pages?type=${type}` : `${BASE}/pages`;
        apiFetch<PageApiData[]>(url)
            .then(setPages)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [type]);

    return { pages, loading };
};

export const usePage = (slug?: string) => {
    const [page, setPage] = useState<PageApiData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) { setLoading(false); return; }
        apiFetch<PageApiData>(`${BASE}/pages/detail?slug=${encodeURIComponent(slug)}`)
            .then(setPage)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    return { page, loading };
};

// ---- Page Categories ----
export interface PageCategoryApi {
    id: number;
    type: string;
    slug: string;
    title: { zh: string; en: string };
    sortOrder: number;
}

export const usePageCategories = (type?: string) => {
    const [categories, setCategories] = useState<PageCategoryApi[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = type ? `${BASE}/page-categories?type=${type}` : `${BASE}/page-categories`;
        apiFetch<PageCategoryApi[]>(url)
            .then(setCategories)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [type]);

    return { categories, loading };
};

// ---- Adapter: PageApiData → ProductItem (for backward compat) ----
export const adaptPageToProduct = (page: PageApiData) => {
    const getZh = (v: any): string => {
        if (!v) return '';
        if (typeof v === 'string') return v;
        return v.zh || v.en || '';
    };

    return {
        id: page.slug,
        name: getZh(page.title),
        category: page.categoryInfo?.slug || '',
        tag: page.tag,
        image: page.heroImage || '',
        description: getZh(page.description),
        features: [
            // First element is 'intro'
            { title: '产品介绍', desc: getZh(page.description) },
            ...(page.content?.features || []).map(f => ({
                title: getZh(f.title),
                desc: getZh(f.desc),
            })),
        ],
        advantages: (page.content?.advantages || []).map(a => ({
            title: getZh(a.title),
            desc: getZh(a.desc),
        })),
        useCases: '',
        usecases_data: (page.content?.useCases || []),
        specs: [],
    };
};

// ---- Adapter: PageApiData → SolutionItem ----
export const adaptPageToSolution = (page: PageApiData) => {
    const getZh = (v: any): string => {
        if (!v) return '';
        if (typeof v === 'string') return v;
        return v.zh || v.en || '';
    };

    return {
        id: page.slug,
        number: String(page.sortOrder || 1),
        title: getZh(page.title),
        category: page.categoryInfo?.title ? getZh(page.categoryInfo.title) : '',
        summary: getZh(page.subtitle) || getZh(page.description),
        bannerSubtitle: getZh(page.subtitle),
        needs: page.content?.needs || '',
        solutionDesc: page.content?.solutionDesc || '',
        features: (page.content?.features || []).map(f => getZh(f.title)),
        advantages: (page.content?.advantages || []).map(a => ({
            title: getZh(a.title),
            desc: getZh(a.desc),
        })),
        usecases_data: page.content?.useCases || [],
        detailImage: page.heroImage,
        highlights: [],
        relatedIds: [],
    };
};
