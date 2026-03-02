export default {
    baseUrl: "https://new.myibc.net",
    endpoints: {
        list: "/Designer/Common/GetData",
    },
    categories: {
        "207046": "公司动态",
        "207047": "行业动态",
        "207048": "政策解读"
    },
    headers: {
        "Referer": "https://new.myibc.net/",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    paths: {
        output: "data/news.ts",
        images: "public/upload"
    }
};
