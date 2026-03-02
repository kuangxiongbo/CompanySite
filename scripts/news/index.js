
import fs from 'fs';
import path from 'path';
import config from './config/index.js';

// Simple delay helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper to load existing JSON data
function loadExistingData() {
    const jsonPath = path.resolve('data/news.json');
    if (!fs.existsSync(jsonPath)) return [];

    try {
        const data = fs.readFileSync(jsonPath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Failed to parse existing JSON data:", e);
        return [];
    }
}

async function fetchList(categoryKey) {
    console.log(`Fetching list for category ${config.categories[categoryKey]}...`);
    const results = [];
    let page = 1;
    let totalPages = 1;

    do {
        try {
            const body = new URLSearchParams({
                cid: categoryKey,
                pageindex: page.toString(),
                pagesize: "100"
            });

            const resp = await fetch(config.baseUrl + config.endpoints.list, {
                method: 'POST',
                headers: config.headers,
                body: body
            });

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();

            if (data && data.List) {
                data.List.forEach(item => {
                    results.push({
                        id: `news-${item.Id}`,
                        title: item.Title,
                        summary: item.Short,
                        image: item.PicUrl ? (item.PicUrl.startsWith('//') ? 'https:' + item.PicUrl : (item.PicUrl.startsWith('http') ? item.PicUrl : config.baseUrl + item.PicUrl)) : '',
                        date: item.PubDateStr ? item.PubDateStr.split(' ')[0] : '',
                        category: config.categories[categoryKey],
                        originalId: item.Id
                    });
                });
                totalPages = data.TotalPage || 1;
                console.log(`  Fetched page ${page}/${totalPages} (${data.List.length} items)`);
            } else {
                break;
            }
        } catch (e) {
            console.error(`Error fetching page ${page}:`, e);
            break;
        }
        page++;
        await delay(500); // Be nice
    } while (page <= totalPages);

    return results;
}

async function main() {
    const existingData = loadExistingData();
    const existingMap = new Map(existingData.map(i => [i.id, i]));

    const allItems = [];

    for (const catKey in config.categories) {
        const items = await fetchList(catKey);
        for (const item of items) {
            // Preserve existing content/details if ID matches
            if (existingMap.has(item.id)) {
                const existing = existingMap.get(item.id);
                // Merge props but preserve content which is expensive/scraped
                allItems.push({
                    ...item,
                    content: existing.content || "",
                    // Prefer existing image URL if it was localized? 
                    // Actually existing one might be a local path like /upload/xxx.jpg
                    // The new fetch gets remote URL.
                    // We should probably keep existing image if it looks local.
                    image: (existing.image && existing.image.startsWith('/')) ? existing.image : item.image
                });
            } else {
                // New item
                allItems.push(item);
            }
        }
    }

    console.log(`Total items: ${allItems.length}`);

    // Sort by date desc
    allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save to intermediate JSON
    fs.writeFileSync('data/news.json', JSON.stringify(allItems, null, 2));
    console.log(`Updated data/news.json`);

    // Ensure data/news.ts exists with correct import (should be static now, but just in case)
    const tsContent = `export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  content: string;
}

import newsDataJson from './news.json';

export const newsData: NewsItem[] = newsDataJson as NewsItem[];
`;
    // We don't overwrite news.ts if it matches content to avoid unnecessary recompilation triggers?
    // But it's fine.
    // fs.writeFileSync(config.paths.output, tsContent);
}

main().catch(console.error);
