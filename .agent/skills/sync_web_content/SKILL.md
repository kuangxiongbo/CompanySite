# Sync Web Content Skill

This skill automates the process of syncing news content from the official website to the local `data/news.ts` file. It ensures 100% visual fidelity by prioritizing metadata from the list view and using robust crawling for detail pages.

## Prerequisite
- Ensure `config.json` is configured (though scripts currently hardcode some paths for the project).

## Workflow (3 Steps)

### Step 1: Fetch Metadata (The "Golden Source")
Fetches the main list of articles to get correct Titles, Dates, and Thumbnails as they appear on the site.
```bash
node .agent/skills/sync_web_content/scripts/01_fetch_list.cjs
```
**Output**: `data/main_list.json`

### Step 2: Crawl Content
Iterates through the list from Step 1, visits each article's detail page, and extracts the full HTML content.
*   Handles `document.write` based rendering by parsing `Body.js`.
*   Downloads images embedded in the content.
```bash
node .agent/skills/sync_web_content/scripts/02_crawl_content.cjs
```
**Output**: `data/news_batch_content.json`

### Step 3: Process & Unify
Merges the Metadata (Step 1) with the Content (Step 2) to generate the final application data.
*   **Visual Fidelity**: Use List Thumbnail > Detail Content Image.
*   **Asset Localization**: Downloads all images to `public/upload/`.
*   **Smart Fallbacks**: Generates generic thumbnails for Awards/Lists if original image is missing/broken.
*   **Cleaning**: Decodes HTML entities in titles.
```bash
node .agent/skills/sync_web_content/scripts/03_process_data.cjs
```
**Output**: `data/news.ts` (Ready for app)

## Key Features
*   **Mobile User-Agent**: Bypasses 403 blocks on `wanwang` CDN.
*   **Generic Thumbnails**: Automatically assigns Gold Medal for Awards and Brown Icon for Trend Lists.
*   **Robust Title Cleaning**: Fixes `& #183;` artifacts.
