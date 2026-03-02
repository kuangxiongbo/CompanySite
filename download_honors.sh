#!/bin/bash
rm -f /Users/kuangxb/Desktop/CompanySite/public/upload/about/honors/*.png
mkdir -p /Users/kuangxb/Desktop/CompanySite/public/upload/about/honors

# Define common headers
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
REF="https://cs.new.myibc.net/ryzz"
ACC="image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"

# Function to download
download() {
    echo "Downloading $2..."
    curl -L -H "User-Agent: $UA" -H "Referer: $REF" -H "Accept: $ACC" -o "/Users/kuangxb/Desktop/CompanySite/public/upload/about/honors/$1" "$2"
}

# Enterprise Qualifications
download "qual_01.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152450.png"
download "qual_02.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152451.png"
download "qual_03.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152449.png"
download "qual_04.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152448.png"
download "qual_05.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152455.png"
download "qual_06.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152452.png"
download "qual_07.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152453.png"
download "qual_08.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152454.png"

# Honorary Awards
download "honor_01.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152503.png"
download "honor_02.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152512.png"
download "honor_03.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152510.png"
download "honor_04.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152506.png"
download "honor_05.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152515.png"
download "honor_06.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152514.png"
download "honor_07.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152513.png"
download "honor_08.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152505.png"
download "honor_09.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152517.png"
download "honor_10.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152511.png"
download "honor_11.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152509.png"
download "honor_12.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152508.png"
download "honor_13.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152507.png"
download "honor_14.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152504.png"
download "honor_15.png" "https://img.wanwang.xin/contents/sitefiles6221/31109561/images/173152516.png"
