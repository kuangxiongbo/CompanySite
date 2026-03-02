import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { newsData, industryNewsData, NewsItem } from '../data/news';

/**
 * 新闻详情页 — 根据 URL 中的 newsId 查找对应文章并渲染 HTML 富文本内容。
 * 数据全部来自 data/news.ts，后续接入后台时只需替换数据源。
 */
export const NewsDetailPage: React.FC = () => {
    const { newsId } = useParams();

    // 合并所有新闻数据并按日期排序，确保上下页顺序正确
    const allNews = [...newsData, ...industryNewsData].sort((a, b) => b.date.localeCompare(a.date));
    const article = allNews.find((n) => n.id === newsId);

    // 相邻文章导航（同列表内前后）
    const currentIndex = allNews.findIndex((n) => n.id === newsId);
    const prevArticle = currentIndex > 0 ? allNews[currentIndex - 1] : null;
    const nextArticle = currentIndex < allNews.length - 1 ? allNews[currentIndex + 1] : null;

    if (!article) {
        return (
            <div className="bg-white min-h-screen">
                <PageHero title="文章未找到" subtitle="您访问的新闻文章不存在或已被移除" image="/upload/173016165.png" />
                <div className="max-w-4xl mx-auto px-6 py-24 text-center">
                    <Link to="/about/news" className="inline-flex items-center text-ibc-brand font-bold hover:underline">
                        <ArrowLeft size={16} className="mr-2" /> 返回新闻列表
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <PageHero
                title={article.title}
                subtitle={article.summary}
                image={article.image || '/upload/news_default.png'}
            />

            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* 面包屑 */}
                <nav className="flex items-center text-sm text-gray-400 mb-8">
                    <Link to="/" className="hover:text-ibc-brand transition-colors">首页</Link>
                    <span className="mx-2">/</span>
                    <Link to="/about/news" className="hover:text-ibc-brand transition-colors">最新动态</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-600">{article.title}</span>
                </nav>

                {/* 元信息 */}
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-10 pb-6 border-b border-gray-100">
                    <span className="flex items-center">
                        <Calendar size={14} className="mr-1.5" />{article.date}
                    </span>
                    <span className="flex items-center">
                        <Tag size={14} className="mr-1.5" />{article.category}
                    </span>
                </div>

                {/* 正文 — HTML 富文本 */}
                <article
                    className="news-article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* 上下篇导航 */}
                <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prevArticle ? (
                        <Link
                            to={`/news/${prevArticle.id}`}
                            className="group flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
                        >
                            <ArrowLeft size={18} className="text-gray-400 group-hover:text-ibc-brand mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="text-xs text-gray-400 mb-1">上一篇</div>
                                <div className="text-sm font-bold text-gray-800 group-hover:text-ibc-brand line-clamp-2">{prevArticle.title}</div>
                            </div>
                        </Link>
                    ) : (
                        <div />
                    )}
                    {nextArticle ? (
                        <Link
                            to={`/news/${nextArticle.id}`}
                            className="group flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors text-right md:justify-self-end"
                        >
                            <div>
                                <div className="text-xs text-gray-400 mb-1">下一篇</div>
                                <div className="text-sm font-bold text-gray-800 group-hover:text-ibc-brand line-clamp-2">{nextArticle.title}</div>
                            </div>
                            <ArrowRight size={18} className="text-gray-400 group-hover:text-ibc-brand mt-0.5 flex-shrink-0" />
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>

                {/* 返回列表 */}
                <div className="mt-10 text-center">
                    <Link
                        to="/about/news"
                        className="inline-flex items-center px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold text-sm hover:bg-ibc-brand hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" /> 返回新闻列表
                    </Link>
                </div>
            </div>
        </div>
    );
};
