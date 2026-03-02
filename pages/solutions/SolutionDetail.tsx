import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { solutionCategories } from '../../data/solutions';
import { ContactModal } from '../../components/ContactModal';
import {
   Shield, ArrowLeft, ArrowRight,
   Target, Lightbulb, Layers, Zap, Globe, Users, Briefcase, MousePointer2, ChevronRight
} from 'lucide-react';

const DECORATIVE_ICONS = [Zap, Globe, Users, Briefcase, Shield, Layers];

const AUTO_SCROLL_STYLE = `
  .auto-scroll-container {
    max-height: 40vh;
    overflow-y: auto;
    position: relative;
    scroll-behavior: smooth;
  }
  .auto-scroll-container::-webkit-scrollbar {
    display: none;
  }
  .auto-scroll-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scroll-mask {
    pointer-events: none;
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to bottom, transparent, rgba(7, 1, 1, 0.9));
    z-index: 20;
    margin-top: -60px;
  }
  .scroll-mask-green {
    background: linear-gradient(to bottom, transparent, rgba(1, 7, 3, 0.9));
  }
`;

const AutoScrollBox: React.FC<{ children: React.ReactNode, className?: string, isGreen?: boolean }> = ({ children, className, isGreen }) => {
   const scrollRef = useRef<HTMLDivElement>(null);
   const [isPaused, setIsPaused] = useState(false);
   const scrollPos = useRef(0);

   useEffect(() => {
      let animationFrameId: number;

      const scroll = () => {
         if (!isPaused && scrollRef.current) {
            const el = scrollRef.current;
            scrollPos.current += 0.4;
            if (scrollPos.current >= el.scrollHeight - el.clientHeight) {
               scrollPos.current = 0;
            }
            el.scrollTop = scrollPos.current;
         }
         animationFrameId = requestAnimationFrame(scroll);
      };

      animationFrameId = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(animationFrameId);
   }, [isPaused]);

   // Sync manual scroll back to our ref
   const handleManualScroll = () => {
      if (scrollRef.current) {
         scrollPos.current = scrollRef.current.scrollTop;
      }
   };

   return (
      <div className="relative">
         <div
            ref={scrollRef}
            className={`auto-scroll-container ${className || ''}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onWheel={handleManualScroll}
            onTouchMove={handleManualScroll}
         >
            {children}
            <div className={`scroll-mask ${isGreen ? 'scroll-mask-green' : ''}`} />
         </div>
      </div>
   );
};

export const SolutionDetail: React.FC = () => {
   const { id } = useParams();
   const { language } = useLanguage();
   const [activeSection, setActiveSection] = useState('0');
   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   const [searchParams] = useSearchParams();
   const nameQuery = searchParams.get('name');

   const allSolutions = solutionCategories.flatMap((cat) => cat.solutions);
   const currentIndex = nameQuery
      ? allSolutions.findIndex(s => s.title === nameQuery)
      : allSolutions.findIndex((s) => s.id === id);

   const solution = allSolutions[currentIndex];
   const realId = solution ? solution.id : null;

   useEffect(() => {
      if (containerRef.current) {
         containerRef.current.scrollTop = 0;
         setActiveSection('0');
      }
   }, [realId, nameQuery]);

   const prevSolution = currentIndex > 0 ? allSolutions[currentIndex - 1] : null;
   const nextSolution = currentIndex < allSolutions.length - 1 ? allSolutions[currentIndex + 1] : null;

   const category = solutionCategories.find((cat) =>
      cat.solutions.some((s) => s.id === realId)
   );

   const getEnhancedSolution = () => {
      if (!solution) return null;
      const enhanced = { ...solution };

      // Helper to clean up titles and descriptions
      const cleanSplit = (text: string, marker: string) => {
         const idx = text.indexOf(marker);
         if (idx === -1) return { main: text, extra: '' };
         return {
            main: text.substring(0, idx).trim(),
            extra: text.substring(idx + marker.length).trim()
         };
      };

      const descObj = cleanSplit(enhanced.solutionDesc || '', '优势特色');
      const mainDesc = descObj.main;
      const extraContent = descObj.extra;

      // Extract advantages if missing
      if (!enhanced.advantages || enhanced.advantages.length === 0) {
         let points: string[] = [];

         // Priority 1: Use the summary as the lead advantage
         if (enhanced.summary && enhanced.summary.length > 5) {
            points.push(enhanced.summary);
         }

         if (extraContent) {
            // Priority 2: Split extraContent (after 优势特色)
            // Handle both period-separated and space-separated items
            let extracted = extraContent.split(/[。]+/).filter(p => p.trim().length > 8);

            // If splitting by period resulted in a single long block, try splitting by space
            if (extracted.length <= 1 && extraContent.trim().split(/\s{2,}/).length >= 2) {
               extracted = extraContent.trim().split(/\s{2,}/).filter(p => p.length > 8);
            } else if (extracted.length <= 1 && extraContent.trim().split(' ').length >= 3) {
               // Aggressive split for space-separated lists common in some data
               extracted = extraContent.trim().split(' ').filter(p => p.length > 8);
            }

            points = [...points, ...extracted];
         }

         if (points.length > 0) {
            // Remove duplicates and limit
            points = [...new Set(points)];

            enhanced.advantages = points.map(p => {
               const cleanP = p.trim().replace(/^[\d.、\s]+/, '');
               // Try to split into title and desc by first comma or colon or natural break
               const splitIdx = cleanP.search(/[，,：:\s]/);
               if (splitIdx !== -1 && splitIdx >= 3 && splitIdx < 15) {
                  return {
                     title: cleanP.substring(0, splitIdx).trim(),
                     desc: cleanP.substring(splitIdx + 1).trim() || cleanP.substring(0, splitIdx).trim()
                  };
               }
               // Fallback: the whole thing as desc, semantic title
               let title = "核心优势";
               if (cleanP.includes('国产') || cleanP.includes('商密')) title = "国产自研";
               else if (cleanP.includes('合规') || cleanP.includes('评估')) title = "合规保障";
               else if (cleanP.includes('整合') || cleanP.includes('统一')) title = "统一架构";
               else if (cleanP.includes('灵活') || cleanP.includes('适配')) title = "灵活兼容";

               return {
                  title,
                  desc: cleanP
               };
            }).slice(0, 8);
         }
      }

      // If usecases are missing, look for "应用场景" markers or generic industry mentions
      if (!enhanced.usecases_data || enhanced.usecases_data.length === 0) {
         const marker = mainDesc.indexOf('应用场景');
         const searchText = marker !== -1 ? mainDesc.substring(marker) : mainDesc;
         const keywords = ['政务', '金融', '运营商', '电力', '交通', '网联车', '工业', '水利', '能源', '医疗', '教育'];
         const foundIndustries = keywords.filter(k => searchText.includes(k));

         if (foundIndustries.length > 0) {
            enhanced.usecases_data = foundIndustries.map(ind => ({
               title: `${ind}行业密码应用`,
               desc: `针对${ind}领域的特定业务流程，提供合规、高效 of ${enhanced.title.replace('解决方案', '')} 技术支撑。`
            })).slice(0, 3);
         } else if (marker !== -1) {
            const text = mainDesc.substring(marker + 4).trim();
            const sces = text.split(/[，,。]/).filter(s => s.length > 2 && s.length < 20);
            if (sces.length > 0) {
               enhanced.usecases_data = sces.map(s => ({
                  title: s.trim(),
                  desc: `广泛应用于${s.trim()}等相关业务场景，满足行业监管及合规性要求。`
               })).slice(0, 3);
            }
         }
      }

      // ENHANCED: Dynamic feature extraction from solutionDesc
      if (enhanced.features.length <= 1 || enhanced.features[0] === '合规性满足') {
         const planText = mainDesc;
         let extracted: string[] = [];

         // 1. Check for "层面" based architecture (Common in security docs)
         const layers = planText.split(/([^\s。]+层面[：:\s])/).filter(p => p.length > 5);
         if (layers.length >= 4) {
            for (let i = 1; i < layers.length; i += 2) {
               const title = layers[i].replace(/[：:\s]/g, '').trim();
               const content = layers[i + 1].split(/[。，,]/)[0].trim();
               extracted.push(`${title}：${content}`);
            }
         }

         // 2. Check for numbered lists (1. 2. 3. or 1、2、3、)
         if (extracted.length < 3) {
            const listPattern = /(\d[:.、]\s*[^。]+(?:。|$))/g;
            const listMatches = planText.match(listPattern);
            if (listMatches && listMatches.length >= 3) {
               extracted = listMatches.map(m => m.replace(/^\d[:.、]\s*/, '').trim()).slice(0, 6);
            }
         }

         // 3. Check for specific action-based features (实现..., 提供..., 采用...)
         if (extracted.length < 3) {
            const actionSentences = planText.split(/[。]/).filter(s =>
               (s.includes('实现') || s.includes('提供') || s.includes('采用') || s.includes('支持') || s.includes('构建')) &&
               s.length > 15 && s.length < 60
            );
            if (actionSentences.length >= 3) {
               extracted = actionSentences.map(s => {
                  const clean = s.trim();
                  // Try to find a good break point for title-like prefix
                  const breakPoint = clean.search(/[，,：:]/);
                  if (breakPoint > 2 && breakPoint < 12) {
                     return clean;
                  }
                  // Fallback: use first few words as semantic title if possible, else just use the sentence
                  const verbs = ['实现', '提供', '采用', '支持', '构建', '基于'];
                  for (const v of verbs) {
                     if (clean.startsWith(v)) {
                        return clean.substring(0, 8) + '：' + clean.substring(0, 40);
                     }
                  }
                  return clean;
               }).slice(0, 6);
            }
         }

         // 4. Fallback: Keyword filtering with more descriptive titles
         if (extracted.length < 3) {
            const featureKeywords = [
               { k: '身份认证', t: '身份安全', d: '建立多因素、全流程的身份校验机制' },
               { k: '加解密', t: '加密计算', d: '提供高性能、低延迟的国密加解密能力' },
               { k: '透明传输', t: '透明加密', d: '无需改造现有业务，实现链路自动加密' },
               { k: '资源池', t: '资源服务', d: '集中管控物理设备，实现密码算力弹性分配' },
               { k: '态势感知', t: '监控预警', d: '实时监测运行状态，提供全景视图与风险预警' },
               { k: '信创', t: '信创适配', d: '全面兼容国产操作系统、数据库及基础中间件' }
            ];

            const found = featureKeywords.filter(fk => planText.includes(fk.k));
            if (found.length > 0) {
               extracted = found.map(f => `${f.t}：${f.d}`);
            }
         }

         if (extracted.length >= 3) {
            enhanced.features = extracted;
         }
      }

      // NEW: Extract challenge points (Key Risks) from needs
      if (enhanced.needs) {
         const challenges: { label: string, val: string, color: string }[] = [];

         const listPattern = /[一二三四五]、|[\d]\.|：/g;
         const parts = enhanced.needs.split(listPattern).filter(p => p.trim().length > 4);

         if (parts.length >= 2) {
            const startIdx = enhanced.needs.includes('：') ? 1 : 1;
            parts.slice(startIdx, startIdx + 3).forEach((part, i) => {
               const cleanPart = part.trim();
               const firstPunct = cleanPart.search(/[，。；,;]/);
               let label = firstPunct !== -1 ? cleanPart.substring(0, firstPunct) : cleanPart.substring(0, 6);
               if (label.length > 8) label = label.substring(0, 8);

               const valMap = ['CRITICAL', 'NON-COMPLIANT', 'VULNERABLE', 'HIGH RISK', 'EXPOSED'];
               challenges.push({
                  label: label.trim(),
                  val: valMap[i % valMap.length],
                  color: i === 0 ? 'text-red-500' : i === 1 ? 'text-orange-500' : 'text-red-600'
               });
            });
         }

         if (challenges.length < 3) {
            const keywords = [
               { k: '泄密', l: '数据泄密', v: 'CRITICAL' },
               { k: '泄露', l: '隐私泄露', v: 'CRITICAL' },
               { k: '合规', l: '合规考量', v: 'NON-COMPLIANT' },
               { k: '密改', l: '密码改造', v: 'COMPLEX' },
               { k: '攻击', l: '攻击威胁', v: 'THREAT' },
               { k: '孤岛', l: '信息孤岛', v: 'SILOED' },
               { k: '篡改', l: '篡改重放', v: 'TAMPER' },
               { k: '身份', l: '身份伪造', v: 'SPOOFING' },
               { k: '运维', l: '运维成本', v: 'INEFFICIENT' },
               { k: '接入', l: '接入安全', v: 'EXPOSED' },
               { k: '工控', l: '生产中断', v: 'URGENT' },
            ];

            for (const item of keywords) {
               if (enhanced.needs.includes(item.k) && !challenges.find(p => p.label.includes(item.k))) {
                  challenges.push({
                     label: item.l,
                     val: item.v,
                     color: challenges.length === 0 ? 'text-red-500' : challenges.length === 1 ? 'text-orange-500' : 'text-red-600'
                  });
               }
               if (challenges.length >= 3) break;
            }
         }

         while (challenges.length < 3) {
            const fallbacks = [
               { label: '安全隐患', val: 'HIDDEN RISK', color: 'text-red-500' },
               { label: '标准缺失', val: 'UNSTRUCTURED', color: 'text-orange-500' },
               { label: '访问失控', val: 'UNAUTHORIZED', color: 'text-red-600' }
            ];
            challenges.push(fallbacks[challenges.length]);
         }

         (enhanced as any).challenges = challenges.slice(0, 3);

         // Extract a relevant quote (usually the last sentence or one with '亟需')
         const sentences = enhanced.needs.split(/[。！!？?]/).filter(s => s.trim().length > 10);
         const quote = sentences.find(s => s.includes('亟需') || s.includes('面临') || s.includes('现状')) || sentences[sentences.length - 1];
         (enhanced as any).challengeQuote = quote ? quote.trim() + '。' : '传统安全机制在应对新型威胁时已显现出明显的防御滞后与能力短板。';

         // NEW: Refined Highlights (Core Points) - Limit to exactly 4 for consistent UI
         if (!enhanced.highlights || enhanced.highlights.length === 0) {
            let extractedHighlights: string[] = [];

            if (enhanced.solutionDesc && enhanced.solutionDesc.includes('优势特色')) {
               const parts = enhanced.solutionDesc.split('优势特色');
               const highlightText = parts[1];
               extractedHighlights = highlightText.split(/[，。；,;\n\s]/)
                  .map(p => p.trim().replace(/[“”。]/g, ''))
                  .filter(p => p.length >= 2 && p.length <= 10);
            }

            if (extractedHighlights.length < 4) {
               const techKeywords = ['极速加解密', '全流程可信', '国产密码算法', '零知识证明', '态势感知监控', '弹性云支撑', '数据安全总线', '双因素认证'];
               const currentContent = (enhanced.title + (enhanced.summary || '')).toUpperCase();
               const match = techKeywords.filter(tk => currentContent.includes(tk.substring(0, 2)));
               extractedHighlights = [...new Set([...extractedHighlights, ...match, ...techKeywords])];
            }

            enhanced.highlights = extractedHighlights.slice(0, 4);
         } else {
            enhanced.highlights = enhanced.highlights.slice(0, 4);
         }
      }

      return enhanced;
   };

   const enhancedSolution = getEnhancedSolution();
   const displayedSolution = enhancedSolution || solution;

   const relatedSolutions = (displayedSolution as any)?.relatedIds
      ? allSolutions.filter(s => (displayedSolution as any).relatedIds.includes(s.id))
      : (category
         ? category.solutions.filter((s) => s.id !== realId).slice(0, 3)
         : []);

   // Define the screens dynamically based on data
   const screens = [
      { id: 'hero', type: 'hero', label: '概述' },
      ...(displayedSolution?.needs ? [{ id: 'challenge', type: 'challenge', label: '核心挑战' }] : []),
      ...(displayedSolution?.solutionDesc ? [{ id: 'solution', type: 'solution', label: '建设方案' }] : []),
      ...(displayedSolution?.features && displayedSolution.features.length > 0 ? [{ id: 'features', type: 'features', label: '核心功能' }] : []),
      ...(displayedSolution?.advantages && displayedSolution.advantages.length > 0 ? [{ id: 'advantages', type: 'advantages', label: '方案价值' }] : []),
      { id: 'related', type: 'related', label: '相关方案' },
      { id: 'contact', type: 'contact', label: '咨询建议' }
   ];

   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach(entry => {
               if (entry.isIntersecting) {
                  const dataIndex = entry.target.getAttribute('data-index');
                  if (dataIndex !== null) {
                     setActiveSection(dataIndex);
                  }
                  entry.target.classList.add('is-visible');
               }
            });
         },
         { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" } // tighter threshold for active section
      );

      const elements = document.querySelectorAll('.snap-screen, .reveal-on-scroll');
      elements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
   }, [displayedSolution]);

   const scrollToScreen = (index: number) => {
      const sections = document.querySelectorAll('.snap-screen');
      if (sections[index]) {
         sections[index].scrollIntoView({ behavior: 'smooth' });
      }
   };

   if (!displayedSolution) {
      return (
         <div className="min-h-screen bg-[#0b0c10] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-white">未找到相关解决方案</h2>
            <Link to="/solutions" className="text-ibc-brand hover:underline">返回解决方案中心</Link>
         </div>
      );
   }

   return (
      <div className="bg-[#0b0c10] font-sans selection:bg-ibc-brand selection:text-white">
         {/* Fixed Progress Dot Navigation */}
         <div className="fixed right-6 lg:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-8 p-4 bg-white/[0.02] backdrop-blur-md rounded-full border border-white/5">
            {screens.map((screen, idx) => (
               <button
                  key={screen.id}
                  onClick={() => scrollToScreen(idx)}
                  className="group relative flex items-center justify-end"
                  aria-label={`Go to section ${idx + 1}`}
               >
                  <span className={`absolute right-10 text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-700 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 ${activeSection === String(idx) ? 'text-ibc-brand opacity-100 translate-x-0' : 'text-white/40'}`}>
                     {screen.label || screen.id}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${activeSection === String(idx) ? 'bg-ibc-brand scale-[3] shadow-[0_0_20px_rgba(0,177,64,0.6)]' : 'bg-white/20 group-hover:bg-white/60 scale-100'}`} />
               </button>
            ))}
         </div>

         {/* Vertical Progress Line */}
         <div className="fixed left-0 top-0 w-1 h-screen z-50 pointer-events-none opacity-20">
            <div
               className="w-full bg-ibc-brand transition-all duration-300 ease-out"
               style={{ height: `${((Number(activeSection) + 1) / screens.length) * 100}%` }}
            />
         </div>

         <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar" ref={containerRef}>
            {/* ══════════════════════════════════════
                SCREEN 1: HERO
            ══════════════════════════════════════ */}
            <section
               id="hero"
               data-index="0"
               className="snap-screen snap-start relative h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#0b0c10]"
            >
               <div className="absolute inset-0 z-0">
                  <img
                     src={displayedSolution.detailImage || '/upload/local_images/product_center_hero.png'}
                     alt={displayedSolution.title}
                     className="w-full h-full object-cover opacity-50 animate-ken-burns transition-opacity duration-1000"
                     onError={(e) => { (e.target as HTMLImageElement).src = '/upload/local_images/product_center_hero.png'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c10]/70 via-transparent to-[#0b0c10] z-10" />
               </div>

               <div className="relative z-20 max-w-5xl mx-auto px-6 pt-32">
                  <div className="animate-fade-in-up">
                     <div className="inline-flex items-center gap-3 bg-ibc-brand/20 backdrop-blur-md border border-ibc-brand/30 text-ibc-brand px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-10">
                        <span className="w-2 h-2 rounded-full bg-ibc-brand animate-pulse" />
                        {displayedSolution.category}
                     </div>
                     <h1 className="text-5xl md:text-8xl font-black text-white mb-10 leading-[1.05] tracking-tighter transition-all duration-700">
                        {displayedSolution.title}
                     </h1>
                     <p className="text-xl md:text-3xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto mb-16 opacity-80">
                        {displayedSolution.bannerSubtitle || displayedSolution.summary}
                     </p>
                     <div className="flex flex-col items-center gap-4">
                        <button
                           onClick={() => scrollToScreen(1)}
                           className="group flex items-center justify-center gap-4 bg-ibc-brand hover:bg-green-500 text-white px-12 py-6 rounded-full font-black text-xl transition-all duration-500 shadow-[0_20px_40px_rgba(0,177,64,0.3)] hover:shadow-[0_30px_60px_rgba(0,177,64,0.5)] hover:-translate-y-2"
                        >
                           {language === 'en' ? 'Start Journey' : '开启探索'}
                           <MousePointer2 className="animate-bounce" />
                        </button>
                     </div>
                  </div>
               </div>

               <div className="absolute bottom-12 flex flex-col items-center gap-3 text-white/20">
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Keep Scrolling</span>
                  <div className="w-px h-16 bg-gradient-to-b from-ibc-brand to-transparent animate-pulse" />
               </div>
            </section>

            {/* ══════════════════════════════════════
                SCREEN 2: CHALLENGE (DARK RED THEME)
            ══════════════════════════════════════ */}
            {displayedSolution.needs && (
               <section
                  id="challenge"
                  data-index="1"
                  className="snap-screen snap-start relative h-screen flex items-center bg-[#070101] overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-[40vw] h-full bg-red-600/5 blur-[150px] rounded-full translate-x-1/2" />
                  <div className="absolute inset-0 flex items-center justify-center text-[35vw] font-black text-white/[0.005] select-none pointer-events-none uppercase tracking-[0.2em]">NEED</div>

                  <div className="max-w-7xl mx-auto px-6 w-full py-20 flex flex-col justify-center pt-32">
                     <div className="reveal-on-scroll grid lg:grid-cols-[1fr_400px] gap-20 items-center">
                        <div>
                           <div className="flex items-center gap-4 text-red-500 font-black text-xs tracking-[0.5em] uppercase mb-8 font-olym">
                              <Target size={24} /> {language === 'en' ? 'Pain Points' : '核心挑战'}
                           </div>
                           <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-10 lg:mb-16 tracking-tight leading-tight max-w-4xl">
                              {language === 'en' ? 'Navigating Complex Industry Hurdles.' : '在复杂的业务环境中，安全面临重重阻碍。'}
                           </h2>
                           <div className="relative group max-w-3xl">
                              <AutoScrollBox>
                                 <div className="relative z-10 space-y-6 text-xl md:text-2xl text-gray-400 font-light leading-[1.8] text-left">
                                    {displayedSolution.needs}
                                 </div>
                              </AutoScrollBox>
                              <div className="mt-16 flex items-center gap-6 opacity-40">
                                 <div className="h-px w-20 bg-red-500" />
                                 <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Critical Analysis</span>
                              </div>
                           </div>
                        </div>

                        {/* Supplemented Content: Key Risks */}
                        <div className="hidden lg:flex flex-col gap-6">
                           {(displayedSolution as any).challenges?.map((item: any, i: number) => (
                              <div key={i} className="p-8 bg-red-950/20 border border-red-900/30 rounded-[30px] backdrop-blur-md">
                                 <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{item.label}</div>
                                 <div className={`text-xl font-black ${item.color} leading-none`}>{item.val}</div>
                              </div>
                           ))}
                           <div className="mt-10 p-8 border-l-2 border-red-500/30">
                              <p className="text-gray-500 text-sm leading-relaxed italic">
                                 "{(displayedSolution as any).challengeQuote || '传统安全机制在应对高级持久性威胁（APT）及内部数据泄露等方面已显露出明显的防御滞后与能力短板。'}"
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
            )}

            {/* ══════════════════════════════════════
                SCREEN 3: SOLUTION (DARK GREEN THEME)
            ══════════════════════════════════════ */}
            {displayedSolution.solutionDesc && (
               <section
                  id="solution"
                  data-index={displayedSolution.needs ? "2" : "1"}
                  className="snap-screen snap-start relative h-screen flex items-center bg-[#010703] overflow-hidden"
               >
                  <div className="absolute top-1/2 left-0 w-[40vw] h-full bg-ibc-brand/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute inset-0 flex items-center justify-center text-[35vw] font-black text-ibc-brand/[0.003] select-none pointer-events-none uppercase tracking-[0.2em]">CORE</div>

                  <div className="max-w-7xl mx-auto px-6 w-full py-20 pt-32">
                     <div className="reveal-on-scroll grid lg:grid-cols-[1fr_auto] gap-20 items-center">
                        <div className="flex flex-col">
                           <div className="flex items-center gap-4 text-ibc-brand font-black text-xs tracking-[0.5em] uppercase mb-8 font-olym">
                              <Lightbulb size={24} /> {language === 'en' ? 'The Blueprint' : '奥联建设方案'}
                           </div>
                           <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-8 lg:mb-12 tracking-tight leading-tight max-w-4xl">
                              {language === 'en' ? 'Crafting a Future of Cryptographic Trust.' : '构建自主可控、内生合规的密码安全底座。'}
                           </h2>
                           <div className="relative group max-w-4xl">
                              <AutoScrollBox isGreen>
                                 <div className="relative z-10 space-y-8 text-xl md:text-2xl text-gray-200 font-light leading-[1.8]">
                                    {displayedSolution.solutionDesc.split('优势特色')[0].trim().split('\n').map((para, i) => (
                                       <p key={i} className="relative">
                                          <span className="absolute -left-10 top-5 w-6 h-px bg-ibc-brand/40" />
                                          {para}
                                       </p>
                                    ))}
                                 </div>
                              </AutoScrollBox>
                              <div className="mt-16 flex flex-wrap gap-4 relative z-10">
                                 {(displayedSolution.highlights || []).map((t: string) => (
                                    <div key={t} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 group/tag hover:border-ibc-brand/50 transition-all cursor-default">
                                       <div className="w-1.5 h-1.5 rounded-full bg-ibc-brand group-hover/tag:scale-150 transition-transform" />
                                       <span className="text-[10px] font-bold text-white/60 group-hover/tag:text-white uppercase tracking-widest">{t}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Supplemented Content: Dynamic Highlights wheel */}
                        <div className="hidden xl:flex relative w-[450px] h-[450px] items-center justify-center">
                           <div className="absolute inset-20 border border-ibc-brand/10 rounded-full animate-spin-slow" />
                           <div className="absolute inset-32 border border-ibc-brand/5 rounded-full animate-spin-slow-reverse" />
                           <div className="relative z-10 text-center">
                              <div className="text-ibc-brand text-5xl font-black mb-2 px-6 py-2 bg-[#0b0c10] border-2 border-ibc-brand/20 rounded-2xl shadow-[0_0_50px_rgba(0,177,64,0.2)]">CORE</div>
                              <div className="text-[10px] text-white/40 tracking-[0.4em] uppercase font-olym">Highlights</div>
                           </div>
                           {(displayedSolution.highlights || []).map((point: string, i: number, arr: string[]) => {
                              const angle = (i * (360 / arr.length) - 90) * (Math.PI / 180);
                              const radius = 200;
                              const x = Math.cos(angle) * radius;
                              const y = Math.sin(angle) * radius;
                              return (
                                 <div
                                    key={i}
                                    style={{ transform: `translate(${x}px, ${y}px)` }}
                                    className="absolute bg-white/[0.03] backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl text-[11px] font-bold text-white whitespace-nowrap shadow-2xl hover:border-ibc-brand/50 hover:text-ibc-brand transition-all duration-500 cursor-default group"
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-1.5 rounded-full bg-ibc-brand group-hover:scale-150 transition-transform" />
                                       {point}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>
               </section>
            )}

            {/* ══════════════════════════════════════
                SCREEN 4: CORE FEATURES (DARK NAVY THEME)
            ══════════════════════════════════════ */}
            {displayedSolution.features && displayedSolution.features.length > 0 && (
               <section
                  id="features"
                  data-index={screens.findIndex(s => s.type === 'features')}
                  className="snap-screen snap-start relative h-screen flex items-center bg-[#0b0c10] overflow-hidden"
               >
                  <div className="max-w-7xl mx-auto px-6 w-full flex flex-col justify-center pt-32">
                     <div className="reveal-on-scroll mb-8">
                        <div className="text-ibc-brand font-black text-[10px] tracking-[0.5em] uppercase mb-4 font-olym">Innovative Core</div>
                        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tighter">{language === 'en' ? 'Capability Excellence' : '方案核心功能与特色'}</h2>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {displayedSolution.features.slice(0, 6).map((feature, index) => {
                           const Icon = DECORATIVE_ICONS[(index + 4) % DECORATIVE_ICONS.length];
                           let title = "";
                           let desc = "";

                           if (feature.includes('：') || feature.includes(':')) {
                              const pos = feature.indexOf('：') !== -1 ? feature.indexOf('：') : feature.indexOf(':');
                              title = feature.substring(0, pos).trim();
                              desc = feature.substring(pos + 1).trim();
                           } else {
                              if (feature.length > 20) {
                                 const b = feature.search(/[，,。]/);
                                 title = b !== -1 && b < 20 ? feature.substring(0, b).trim() : feature.substring(0, 10).trim();
                                 desc = b !== -1 && b < 20 ? feature.substring(b + 1).trim() : feature.trim();
                              } else {
                                 title = feature;
                                 desc = "";
                              }
                           }

                           return (
                              <div key={index} className="reveal-on-scroll group p-5 lg:p-8 bg-white/[0.02] border border-white/5 rounded-[30px] transition-all duration-700 hover:bg-white/[0.05] hover:border-ibc-brand/30 hover:-translate-y-1">
                                 <div className="flex items-center gap-4 mb-3 lg:mb-4">
                                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-[#1a1c23] flex items-center justify-center text-ibc-brand group-hover:bg-ibc-brand group-hover:text-white transition-all">
                                       <Icon size={18} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-sm lg:text-lg font-bold text-white group-hover:text-ibc-brand transition-colors line-clamp-2">{title}</h3>
                                 </div>
                                 {desc && <p className="text-gray-500 font-light leading-relaxed text-[10px] lg:text-xs line-clamp-3">{desc}</p>}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </section>
            )}

            {/* ══════════════════════════════════════
                SCREEN 5: ADVANTAGES (PURE BLACK THEME)
            ══════════════════════════════════════ */}
            {displayedSolution.advantages && displayedSolution.advantages.length > 0 && (
               <section
                  id="advantages"
                  data-index={screens.findIndex(s => s.type === 'advantages')}
                  className="snap-screen snap-start relative h-screen flex items-center bg-[#070707] overflow-hidden"
               >
                  <div className="max-w-7xl mx-auto px-6 w-full flex flex-col justify-center pt-32">
                     <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 reveal-on-scroll">
                        <div className="max-w-3xl">
                           <div className="text-ibc-brand font-black text-[10px] tracking-[0.5em] uppercase mb-4 opacity-60 font-olym">Competitive Edge</div>
                           <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">
                              {language === 'en' ? 'Systematic Value.' : '为什么选择奥联'}
                           </h2>
                        </div>
                     </div>

                     <div className={`grid gap-6 md:gap-8 lg:gap-10 ${displayedSolution.advantages.length > 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                        {displayedSolution.advantages.slice(0, 8).map((adv, index) => {
                           const Icon = DECORATIVE_ICONS[index % DECORATIVE_ICONS.length];
                           return (
                              <div key={index} className="reveal-on-scroll group bg-white/[0.02] p-5 lg:p-8 rounded-[40px] border border-white/5 hover:bg-ibc-brand/[0.03] hover:border-ibc-brand/20 transition-all duration-1000 flex flex-col items-center text-center">
                                 <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-[#1a1c23] flex items-center justify-center text-ibc-brand mb-4 lg:mb-6 group-hover:bg-ibc-brand group-hover:text-white transition-all duration-500">
                                    <Icon size={20} strokeWidth={1.5} />
                                 </div>
                                 <h4 className="text-base lg:text-lg font-bold text-white mb-2 lg:mb-3 group-hover:text-ibc-brand transition-colors">{adv.title}</h4>
                                 <p className="text-gray-500 text-[10px] md:text-xs font-light leading-relaxed opacity-70">{adv.desc}</p>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </section>
            )}



            {/* ══════════════════════════════════════
                SCREEN 7: RELATED SOLUTIONS (ICE SILVER THEME)
            ══════════════════════════════════════ */}
            <section
               id="related"
               data-index={screens.findIndex(s => s.type === 'related')}
               className="snap-screen snap-start relative h-screen flex flex-col justify-center bg-[#f1f5f9] text-[#0b0c10] overflow-hidden rounded-t-[100px] z-20"
            >
               <div className="max-w-7xl mx-auto px-6 w-full py-12 flex flex-col h-full justify-center pt-32">
                  <div className="reveal-on-scroll">
                     <div className="flex items-center justify-between mb-12">
                        <div>
                           <div className="text-ibc-brand font-black text-[10px] tracking-[0.5em] uppercase mb-4 opacity-60">Vertical Synergies</div>
                           <h3 className="text-3xl md:text-5xl font-bold tracking-tighter">{language === 'en' ? 'Explore More' : '探索更多相关实践'}</h3>
                        </div>
                        <Link to="/solutions" className="text-ibc-brand font-bold text-sm tracking-widest hover:translate-x-2 transition-transform">VIEW ALL →</Link>
                     </div>

                     <div className="grid md:grid-cols-3 gap-8">
                        {relatedSolutions.slice(0, 3).map((sol) => (
                           <Link
                              key={sol.id}
                              to={`/solutions?name=${sol.title}`}
                              className="group p-6 lg:p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 text-left flex flex-col h-full"
                           >
                              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-ibc-brand mb-6 group-hover:bg-ibc-brand group-hover:text-white transition-all">
                                 <ChevronRight size={20} />
                              </div>
                              <h4 className="text-lg font-bold mb-3 line-clamp-2 leading-snug group-hover:text-ibc-brand transition-colors">{sol.title}</h4>
                              <p className="text-gray-400 text-[13px] line-clamp-3 leading-relaxed mb-auto">{sol.summary}</p>
                              <div className="mt-8 text-[10px] font-black text-ibc-brand tracking-widest group-hover:translate-x-2 transition-transform">DISCOVER PROJECT →</div>
                           </Link>
                        ))}
                     </div>
                  </div>

                  {/* Bottom Navigation (Prev/Next) */}
                  <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center text-[10px] font-black tracking-widest uppercase reveal-on-scroll">
                     {prevSolution ? (
                        <Link to={`/solutions?name=${prevSolution.title}`} className="hover:text-ibc-brand transition-colors flex items-center gap-4 group">
                           <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-ibc-brand group-hover:bg-ibc-brand group-hover:text-white transition-all">←</span>
                           PREVIOUS CASE
                        </Link>
                     ) : <div />}
                     {nextSolution ? (
                        <Link to={`/solutions?name=${nextSolution.title}`} className="hover:text-ibc-brand transition-colors flex items-center gap-4 group">
                           NEXT CASE
                           <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-ibc-brand group-hover:bg-ibc-brand group-hover:text-white transition-all">→</span>
                        </Link>
                     ) : <div />}
                  </div>
               </div>
            </section>

            {/* ══════════════════════════════════════
                SCREEN 8: CONTACT CTA (PURE WHITE THEME)
            ══════════════════════════════════════ */}
            <section
               id="contact"
               data-index={screens.findIndex(s => s.type === 'contact')}
               className="snap-screen snap-start relative h-screen flex flex-col justify-center bg-white text-[#0b0c10] overflow-hidden z-30"
            >
               <div className="max-w-7xl mx-auto px-6 w-full text-center reveal-on-scroll pt-32">
                  <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter leading-none">
                     {language === 'en' ? 'Start Your Security Evolution.' : '立即启动您的安全升级。'}
                  </h2>
                  <p className="text-xl md:text-3xl text-gray-500 mb-20 font-light leading-relaxed max-w-4xl mx-auto">
                     {language === 'en' ? 'Deploy cryptographic excellence tailored for your industry.' : '与我们的专家架构师团队联系，为您的行业构建定制化、合规的标识密码安全。'}
                  </p>
                  <div className="flex justify-center">
                     <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="group inline-flex items-center justify-center gap-6 bg-[#0b0c10] text-white px-20 py-8 rounded-full font-black text-2xl transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:shadow-[0_45px_90px_rgba(0,0,0,0.3)] hover:-translate-y-4"
                     >
                        {language === 'en' ? 'Get Customized Solution' : '咨询定制化方案'}
                        <Zap size={28} className="text-ibc-brand fill-ibc-brand" />
                     </button>
                  </div>
               </div>
            </section>
         </div>
         <style>{AUTO_SCROLL_STYLE}</style>

         <ContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            type="customization"
         />
      </div >
   );
};