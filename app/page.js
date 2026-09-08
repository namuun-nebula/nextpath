"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search, MapPin, Clock, GraduationCap, ArrowRight, Menu, X,
  Compass, ExternalLink, CheckCircle2, ChevronLeft, ChevronDown,
  Wifi, Users2, Flag, Sparkles, Globe2, FlaskConical, Briefcase, Palette, HeartPulse, Send as SendIcon
} from "lucide-react";

/* ============================================================================
   NEXTPATH — V10 (final refinement pass)
   Layout, navigation, palette, and page structure are unchanged from V9.
   This pass: broadens "Хаанаас эхлэх вэ?" with interest areas, gives cards
   an overlapping sticker placement, distinguishes registration vs. program
   dates (only where that data exists), expands the detail-page questions,
   rewrites About in first person, adds a real Add/Report page, and sprinkles
   the same illustration language sparsely across the rest of the site so it
   stops feeling like a plain page below the hero.
   ============================================================================ */

/* ---------------- Data (placeholder — shape matches the Airtable "Opportunities" table plus
   a few optional editorial fields — bestFor / timeCommitment / competitiveness / programStart /
   programEnd — added only where there's something real to say; never fabricated for every item.) ---------------- */

const OPPS = [
  {
    id: "1", name: "Залуу Судлаачдын Хөтөлбөр", org: "ШУТИС · Инженерийн сургууль",
    description: "9-10 дугаар ангийн сурагчид 6 долоо хоногийн турш лабораторид бодит судалгааны төсөлд оролцоно.",
    type: "Судалгаа", field: "Инженер, Хими", grade: "9–10", location: "Улаанбаатар", format: "Танхим",
    mongoliaEligible: true, origin: "mongolia", cost: "Үнэгүй", deadline: "2026-10-12", programStart: "2026-11-01", experienceLevel: "Түвшин шаардахгүй",
    whatYouDo: "Ахлах судлаачийн дэргэд бодит туршилт хийж, улирлын эцэст өөрийн бяцхан судалгааг хамгаална.",
    requirements: "9 эсвэл 10 дугаар ангийн сурагч, хими эсвэл физик сонирхдог хэн ч бай.",
    bestFor: "Лабораторт удаан цагаар ажиллахаас залхдаггүй, нэг сэдвийг гүнзгий шинжлэхийг хүсдэг сурагчид илүү тохирно.",
    timeCommitment: "6 долоо хоног, долоо хоногт ~8–10 цаг лабораторт.",
    whatYouGet: "Судалгааны жинхэнэ туршлага, гэрчилгээ, зөвлөмжийн захидал авах боломж.",
    officialLink: "#", verifiedDate: "2026-08-01", featured: true, isNew: false,
  },
  {
    id: "2", name: "MIT PRIMES-Style Research Circle", org: "Global Math Circle Network",
    description: "An online research mentorship in mathematics for advanced high schoolers, paired with a graduate mentor for a full year.",
    type: "Судалгаа", field: "Математик", grade: "10–12", location: "Онлайн", format: "Онлайн",
    mongoliaEligible: true, origin: "international", cost: "Үнэгүй", deadline: "2026-11-30", experienceLevel: "Ахисан түвшин",
    whatYouDo: "Багийн хамт долоо хоног бүр цуглаж, сонгосон сэдвээрээ судалгаа хийж, жилийн эцэст өөрийн нийтлэлээ бичнэ.",
    requirements: "Математикийн олимпиадад оролцож байсан бол давуу тал болно.",
    bestFor: "Математикийг бие даан гүнзгийрүүлж судлахыг хүсдэг, англи хэлээр эрдэм шинжилгээний бичвэр унших чадвартай сурагчид.",
    timeCommitment: "1 жил, долоо хоногт ~5–6 цаг.",
    whatYouGet: "Судалгааны нийтлэл, гадаад менторын зөвлөгөө, олон улсын оюутнуудтай танилцах боломж.",
    officialLink: "#", verifiedDate: "2026-08-10", featured: true, isNew: true,
  },
  {
    id: "3", name: "Шинжлэх Ухааны Аяны Тэтгэлэг", org: "Монгол Апейрон сан",
    description: "Байгалийн шинжлэх ухаанд дуртай охидод зориулсан бүрэн тэтгэлэгтэй зуны хөтөлбөр.",
    type: "Тэтгэлэг", field: "Биологи, Экологи", grade: "8–11", location: "Хөвсгөл", format: "Танхим",
    mongoliaEligible: true, origin: "mongolia", cost: "Тэтгэлэгтэй", deadline: "2026-09-15", programStart: "2026-06-15", programEnd: "2026-07-10", experienceLevel: "Түвшин шаардахгүй",
    whatYouDo: "Талбай дээр судалгаа хийж, нуурын экосистемийг судлаад, эцэст нь илтгэл тавина.",
    requirements: "Охин сурагч, 8–11 дугаар анги, хээрийн нөхцөлд аялах бэлэн байдал.",
    competitiveness: "Жил бүр 200 орчим өргөдөл хүлээж авдаг бөгөөд эдгээрээс 30 сурагчийг сонгодог.",
    bestFor: "Байгальд дуртай, хээрийн бэрх нөхцөлд ажиллахаас эмээдэггүй охид энэ хөтөлбөрөөс хамгийн ихийг олж авна.",
    timeCommitment: "4 долоо хоног, бүтэн цагаар хээрийн лагерьт.",
    whatYouGet: "Унаа, хоол, байрны зардал бүрэн хамрагдана, ментортой ажиллана.",
    officialLink: "#", verifiedDate: "2026-07-20", featured: false, isNew: false, deadlineSoon: true,
  },
  {
    id: "4", name: "Girls Who Code — Summer Track", org: "Girls Who Code (international)",
    description: "A beginner-friendly coding program for girls, with a track open to international applicants including Mongolia.",
    type: "Хичээл/Курс", field: "Компьютерийн ухаан", grade: "9–11", location: "Онлайн", format: "Онлайн",
    mongoliaEligible: true, origin: "international", cost: "Үнэгүй", deadline: "2026-12-05", experienceLevel: "Эхлэгч",
    whatYouDo: "Долоо хоногт 3 удаа хичээллэж, багийн хамт жижиг апп хөгжүүлнэ.",
    requirements: "Англи хэлний дунд түвшин, компьютер, интернэттэй байх.",
    bestFor: "Кодлож үзээгүй ч сонирхолтой, англиар хичээллэхэд тэвчээртэй эхлэгчдэд тохиромжтой.",
    timeCommitment: "8 долоо хоног, долоо хоногт ~4 цаг.",
    whatYouGet: "Гэрчилгээ, портфолиод нэмэх төсөл, олон улсын оюутны нэгдэлд элсэх боломж.",
    officialLink: "#", verifiedDate: "2026-08-15", featured: true, isNew: true,
  },
  {
    id: "5", name: "Улсын Физикийн Олимпиад", org: "БШУЯ · Боловсролын Үнэлгээний Төв",
    description: "Ерөнхий боловсролын сургуулиудын дунд жил бүр явагддаг улсын түвшний олимпиад.",
    type: "Уралдаан", field: "Физик", grade: "8–12", location: "Улаанбаатар", format: "Танхим",
    mongoliaEligible: true, origin: "mongolia", cost: "Үнэгүй", deadline: "2026-09-28", programStart: "2026-11-15", experienceLevel: "Дунд түвшин",
    whatYouDo: "Аймаг/дүүргийн шатнаас түрүүлсэн сурагчид улсын шалгаруулалтад өрсөлдөнө.",
    requirements: "Сургуулийн дотоод шалгаруулалтад тэнцсэн байх.",
    competitiveness: "Аймаг/дүүргийн шатнаас ойролцоогоор шилдэг 10–15% нь улсын шатанд шалгардаг.",
    bestFor: "Бодлого бодох дуртай, тэмцээний стресст сайн ажилладаг сурагчид.",
    timeCommitment: "Бэлтгэл өөрөө хийнэ; шалгалт өдрөө 3 цаг.",
    whatYouGet: "Медаль, дээд сургуульд элсэхэд тооцогдох нэмэгдэл оноо.",
    officialLink: "#", verifiedDate: "2026-08-05", featured: false, isNew: false, deadlineSoon: true,
  },
  {
    id: "6", name: "Дадлагажигч Инженер — Хиймэл Оюуны Стартап", org: "TechMongolia LLC",
    description: "Улаанбаатар дахь орон нутгийн технологийн компанид зуны дадлага хийх боломж.",
    type: "Дадлага", field: "Компьютерийн ухаан", grade: "10–12", location: "Улаанбаатар", format: "Хосолсон",
    mongoliaEligible: true, origin: "mongolia", cost: "Цалинтай", deadline: "2026-10-01", experienceLevel: "Дунд түвшин",
    whatYouDo: "Жинхэнэ бүтээгдэхүүний баг дээр код бичихэд, туршилт хийхэд туслана.",
    requirements: "Python эсвэл JavaScript-ийн үндсэн мэдлэгтэй байх.",
    bestFor: "Жинхэнэ багт код бичиж, бодит бүтээгдэхүүн дээр ажиллаж үзэхийг хүсдэг сурагчид.",
    timeCommitment: "8 долоо хоног, долоо хоногт 3 өдөр.",
    whatYouGet: "Цалин, ажлын жинхэнэ туршлага, зөвлөмжийн захидал.",
    officialLink: "#", verifiedDate: "2026-08-18", featured: false, isNew: true,
  },
  {
    id: "7", name: "Global Young Researchers Hackathon", org: "Youth Science Alliance",
    description: "A 48-hour interdisciplinary hackathon for teens worldwide, held online with regional teams.",
    type: "Уралдаан", field: "Олон салбар", grade: "9–12", location: "Онлайн", format: "Онлайн",
    mongoliaEligible: true, origin: "international", cost: "Үнэгүй", deadline: "2026-11-10", experienceLevel: "Түвшин шаардахгүй",
    whatYouDo: "4 хүний багтай нэгдэж, 48 цагийн дотор бодит асуудалд шийдэл боловсруулна.",
    requirements: "Багаар ажиллах дуртай, лаптоптой байх.",
    bestFor: "Хурдан шийдвэр гаргаж, багаар шахуу хугацаанд ажиллахад дуртай сурагчид.",
    timeCommitment: "48 цаг, тасралтгүй хамтарсан ажил.",
    whatYouGet: "Шагнал, гэрчилгээ, олон улсын багийн туршлага.",
    officialLink: "#", verifiedDate: "2026-08-12", featured: false, isNew: false,
  },
  {
    id: "8", name: "Байгаль Хамгаалагчдын Сайн Дурын Хөтөлбөр", org: "Дэлхийн Байгаль Хамгаалах Сан (Монгол)",
    description: "Говийн үндэсний паркуудад зуны улиралд явагддаг байгаль хамгааллын сайн дурын ажил.",
    type: "Сайн дурын ажил", field: "Экологи", grade: "9–12", location: "Өмнөговь", format: "Танхим",
    mongoliaEligible: true, origin: "mongolia", cost: "Үнэгүй", deadline: "2027-01-15", experienceLevel: "Түвшин шаардахгүй",
    whatYouDo: "Ан амьтны тооллого хийж, орон нутгийн иргэдтэй хамт мод тарина.",
    requirements: "Хээрийн нөхцөлд ажиллах чадвартай, эрүүл мэндийн гэрчилгээтэй.",
    bestFor: "Байгальд гарч, гар хүчээр ажиллахаас таашаал авдаг сурагчид.",
    timeCommitment: "2 долоо хоног, бүтэн цагаар хээрийн лагерьт.",
    whatYouGet: "Байгаль хамгааллын гэрчилгээ, талбайн жинхэнэ туршлага.",
    officialLink: "#", verifiedDate: "2026-06-30", featured: false, isNew: false,
  },
];

const CATEGORIES = ["Судалгаа", "Уралдаан", "Тэтгэлэг", "Дадлага", "Хичээл/Курс", "Сайн дурын ажил"];
const ACCENTS = ["cobalt", "magenta", "violet", "teal", "lime"];
function accentFor(type) { return ACCENTS[CATEGORIES.indexOf(type) % ACCENTS.length]; }
const STEM_FIELDS = ["Инженер", "Хими", "Математик", "Биологи", "Экологи", "Физик", "Компьютерийн ухаан"];
const isStem = (o) => STEM_FIELDS.some(f => o.field.includes(f));

/* ---------------- helpers ---------------- */

function daysUntil(dateStr) {
  const d = new Date(dateStr);
  const now = new Date("2026-08-29");
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ["1-р сар","2-р сар","3-р сар","4-р сар","5-р сар","6-р сар","7-р сар","8-р сар","9-р сар","10-р сар","11-р сар","12-р сар"];
  return `${d.getFullYear()} оны ${months[d.getMonth()]}ын ${d.getDate()}`;
}
function formatDateCompact(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return reduced;
}

/* ---------------- Global styles ---------------- */

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&family=Unbounded:wght@600;700&display=swap');

    .np-root {
      --bg: #F8F8FB; --bg-alt: #F1F1F7;
      --paper: #FFFFFF;
      --ink: #201F2B; --ink-soft: #6B6880;
      --line: rgba(32,31,43,0.11);
      --cobalt: #3B5BFF; --cobalt-deep: #1F3ECC; --cobalt-soft: #E4E9FF; --cobalt-light: #8CA3FF;
      --violet: #8B5CF6; --violet-deep: #6C3CE0; --violet-soft: #EEE6FF; --violet-light: #B4A0FA;
      --magenta: #ED3F92; --magenta-deep: #C21F70; --magenta-soft: #FDE1EF; --magenta-light: #F585BC;
      --teal: #12B8C4; --teal-deep: #0C8892; --teal-soft: #D9F5F7; --teal-light: #5FD6DE;
      --lime: #6FBE3D; --lime-deep: #4A8F27; --lime-soft: #E9F5DC; --lime-light: #A2D97C;
      font-family: 'Manrope', sans-serif;
      background: var(--bg); color: var(--ink);
      min-height: 100vh; position: relative; overflow-x: hidden;
    }
    .np-root * { box-sizing: border-box; }
    .np-display { font-family: 'Unbounded', sans-serif; }
    .np-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }
    .np-root a, .np-root button { font-family: inherit; }
    .np-root button { cursor: pointer; border: none; background: none; }
    .np-root :focus-visible { outline: 2px solid var(--cobalt); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .np-root * { animation: none !important; transition: none !important; } }
    @keyframes npfadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .np-enter { animation: npfadein .38s cubic-bezier(.2,.7,.2,1); }

    /* ---------- Nav ---------- */
    .np-nav { position: sticky; top: 0; z-index: 60; display: flex; justify-content: center; padding: 14px 18px; }
    .np-nav-inner { width: 100%; max-width: 1080px; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border: 1px solid var(--line); border-radius: 13px; padding: 8px 8px 8px 20px; }
    .np-logo { display: flex; align-items: center; gap: 8px; color: var(--ink); font-size: 14.5px; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; }
    .np-logo svg { color: var(--cobalt); }
    .np-navlinks { display: flex; gap: 2px; align-items: center; }
    .np-navlink { color: var(--ink-soft); font-size: 13px; font-weight: 600; padding: 9px 13px; border-radius: 8px; transition: color .12s ease, background .12s ease; }
    .np-navlink:hover { color: var(--ink); background: var(--bg-alt); }
    .np-navlink.active { color: var(--cobalt-deep); background: var(--cobalt-soft); }
    .np-navlink.dropbtn { display: inline-flex; align-items: center; gap: 4px; }
    .np-navdrop { position: relative; }
    .np-navdrop-panel { position: absolute; top: calc(100% + 8px); right: 0; background: var(--paper); border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 18px 32px -14px rgba(32,31,43,0.32); padding: 6px; min-width: 240px; z-index: 70; }
    .np-navdrop-panel button { display: block; width: 100%; text-align: left; padding: 11px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--ink); background: none; }
    .np-navdrop-panel button:hover { background: var(--bg-alt); color: var(--cobalt-deep); }
    .np-navburger { display: none; color: var(--ink); padding: 8px; }
    @media (max-width: 720px) { .np-navlinks > .np-navlink, .np-navlinks > .np-navdrop { display: none; } .np-navburger { display: flex; } }
    .np-mobilemenu { position: fixed; inset: 0; z-index: 100; background: var(--bg); display: flex; flex-direction: column; padding: 20px; }
    .np-mobilemenu-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 34px; }
    .np-mobilemenu a, .np-mobilemenu button.np-mm-link { color: var(--ink); font-family: 'Newsreader', serif; font-size: 25px; font-weight: 600; padding: 14px 4px; text-align: left; border-bottom: 1px solid var(--line); }
    .np-mobilemenu-cta { margin-top: auto; background: var(--magenta); color: #fff; padding: 15px; border-radius: 10px; font-weight: 700; text-align: center; font-size: 15px; }
    .np-mobilemenu-cta + .np-mobilemenu-cta { margin-top: 10px; background: var(--ink); }

    /* ---------- Motif / sticker background layer (used sparsely site-wide) ---------- */
    .np-motiflayer { position: absolute; inset: 0; pointer-events: none; overflow: visible; z-index: 0; }
    .np-motif { position: absolute; filter: drop-shadow(0 6px 10px rgba(32,31,43,0.1)); transition: transform .1s linear; }
    .np-drift { animation: npdrift 7s ease-in-out infinite; }
    @keyframes npdrift { 0%, 100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-8px) rotate(var(--r,0deg)); } }

    /* ---------- Hero (unchanged composition) ---------- */
    .np-hero { position: relative; padding: 58px 24px 40px; text-align: center; overflow: hidden;
      background:
        radial-gradient(ellipse 46% 40% at 14% 14%, rgba(59,91,255,0.16) 0%, transparent 62%),
        radial-gradient(ellipse 42% 38% at 86% 10%, rgba(237,63,146,0.14) 0%, transparent 62%),
        radial-gradient(ellipse 46% 36% at 50% 96%, rgba(18,184,196,0.14) 0%, transparent 62%),
        radial-gradient(ellipse 34% 30% at 70% 60%, rgba(111,190,61,0.12) 0%, transparent 62%),
        var(--bg);
    }
    .np-hero-eyebrow { position: relative; display: inline-flex; align-items: center; gap: 8px; color: var(--magenta-deep); font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 24px; }
    .np-hero-eyebrow svg { width: 13px; height: 13px; }
    .np-hero h1 { position: relative; font-family: 'Newsreader', serif; font-size: clamp(36px, 6.2vw, 68px); line-height: 1.08; font-weight: 600; letter-spacing: -0.01em; max-width: 780px; margin: 0 auto 22px; color: var(--ink); }
    .np-hero p { position: relative; color: var(--ink-soft); font-size: 16.5px; max-width: 520px; margin: 0 auto 28px; line-height: 1.6; }
    .np-hero-entry { position: relative; display: inline-flex; align-items: center; gap: 8px; background: var(--paper); border: 1.5px solid var(--ink); border-radius: 999px; padding: 10px 8px 10px 18px; font-size: 13.5px; font-weight: 700; color: var(--ink); transition: transform .15s ease, box-shadow .15s ease; }
    .np-hero-entry:hover { transform: translateY(-2px); box-shadow: 0 8px 18px -10px rgba(32,31,43,0.3); }
    .np-hero-entry .go { width: 26px; height: 26px; border-radius: 50%; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: center; }
    .np-hero-closer { position: relative; margin: 2px auto 26px; }
    .np-hero-closer span { font-family: 'Manrope', sans-serif; font-style: italic; font-weight: 600; font-size: 13.5px; color: var(--ink-soft); letter-spacing: 0.01em; }
    .np-hero-searchlabel { position: relative; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); margin: 0 0 14px; }
    .np-hero-catlabel { position: relative; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); margin: 26px 0 12px; }
    .np-hero-tags { position: relative; display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }

    /* ---------- Filter tag system ---------- */
    .np-tag { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-soft); position: relative; padding: 6px 1px; border-bottom: 1.5px solid transparent; transition: color .12s ease, border-color .12s ease; }
    .np-tag:hover { color: var(--tag-color, var(--cobalt-deep)); }
    .np-tag.filled { color: var(--tag-color, var(--cobalt-deep)); border-bottom-color: var(--tag-color, var(--cobalt-deep)); }

    /* ---------- Section shell ---------- */
    .np-section { padding: 26px 24px 52px; max-width: 1140px; margin: 0 auto; position: relative; z-index: 1; }
    .np-section-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; gap: 12px; flex-wrap: wrap; position: relative; z-index: 1; }
    .np-section-head .eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--teal-deep); margin-bottom: 8px; display: block; }
    .np-section-head h3 { font-family: 'Newsreader', serif; font-size: clamp(22px, 2.6vw, 29px); margin: 0; font-weight: 600; color: var(--ink); letter-spacing: -0.01em; }
    .np-seeall { font-size: 12.5px; font-weight: 700; color: var(--ink-soft); display: flex; align-items: center; gap: 4px; }
    .np-seeall:hover { color: var(--cobalt-deep); }

    .np-row { display: flex; gap: 18px; overflow-x: auto; padding: 6px 4px 16px; scroll-snap-type: x proximity; position: relative; z-index: 1; }
    .np-row::-webkit-scrollbar { height: 0; }
    .np-row > * { scroll-snap-align: start; flex-shrink: 0; }
    .np-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(266px, 1fr)); gap: 24px 20px; align-items: stretch; position: relative; z-index: 1; }

    /* ---------- Opportunity card — sticker overlaps the top edge ---------- */
    .np-card-wrap { height: 356px; }
    .np-row .np-card-wrap { width: 266px; }
    .np-card { position: relative; height: 100%; display: flex; flex-direction: column; background: var(--paper); border-radius: 16px; border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(32,31,43,0.03), 0 8px 16px -14px rgba(32,31,43,0.14); transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease; cursor: pointer; overflow: visible; }
    .np-card:hover { transform: translateY(-3px); border-color: var(--accent, var(--cobalt)); box-shadow: 0 1px 2px rgba(32,31,43,0.04), 0 14px 24px -16px rgba(32,31,43,0.2); }
    .np-card:hover .np-card-sticker { transform: rotate(-8deg) scale(1.06); }
    .np-card-sticker { position: absolute; top: -13px; left: 18px; z-index: 2; width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; transform: rotate(-6deg); box-shadow: 0 6px 12px rgba(32,31,43,0.18); transition: transform .18s ease; border: 2px solid var(--paper); }
    .np-card-newstamp { position: absolute; top: -10px; right: 16px; z-index: 2; display: flex; align-items: center; gap: 4px; background: var(--magenta); color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 9.5px; letter-spacing: 0.06em; padding: 5px 10px 5px 8px; border-radius: 4px 10px 10px 4px; transform: rotate(4deg); box-shadow: 0 6px 12px rgba(237,63,146,0.4); }
    .np-card-body { position: relative; display: flex; flex-direction: column; height: 100%; padding: 30px 20px 18px; overflow: hidden; border-radius: 16px; }
    .np-card-typelabel { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; display: block; }
    .np-card h4 { font-family: 'Newsreader', serif; font-size: 18px; line-height: 1.26; margin: 0 0 7px; font-weight: 600; color: var(--ink); letter-spacing: -0.005em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .np-card .org { font-size: 11.5px; color: var(--ink-soft); margin-bottom: 9px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .np-card .desc { font-size: 12.5px; color: var(--ink-soft); line-height: 1.55; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .np-card-meta { border-top: 1px solid var(--line); padding-top: 12px; margin-top: 12px; }
    .np-card-meta .facts { font-size: 12px; color: var(--ink-soft); margin-bottom: 6px; }
    .np-card-meta .facts .dot { margin: 0 6px; opacity: 0.4; }
    .np-card-meta .deadline { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em; color: var(--ink-soft); display: flex; align-items: center; gap: 6px; text-transform: uppercase; }
    .np-card-meta .deadline.soon { color: var(--magenta-deep); }

    /* ---------- Where to start ---------- */
    .np-exploregrid { display: grid; gap: 14px; position: relative; z-index: 1; }
    .np-exploregrid.g5 { grid-template-columns: repeat(5, 1fr); }
    .np-exploregrid.g3 { grid-template-columns: repeat(3, 1fr); max-width: 720px; }
    @media (max-width: 980px) { .np-exploregrid.g5 { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 640px) { .np-exploregrid.g5, .np-exploregrid.g3 { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 420px) { .np-exploregrid.g5, .np-exploregrid.g3 { grid-template-columns: 1fr; } }
    .np-exploretile { position: relative; padding: 20px 18px; text-align: left; overflow: hidden; min-height: 138px; display: flex; flex-direction: column; justify-content: space-between; transition: transform .15s ease; border-radius: 14px; }
    .np-exploretile:hover { transform: translateY(-4px); }
    .np-exploretile .icon { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: var(--accent); }
    .np-exploretile .lbl { font-family: 'Newsreader', serif; font-weight: 600; font-size: 15.5px; margin-top: 14px; color: var(--ink); line-height: 1.2; }
    .np-exploretile .sub { font-family: 'IBM Plex Mono', monospace; font-size: 9.5px; margin-top: 5px; color: var(--ink-soft); line-height: 1.4; }
    .np-exploretile .count { position: absolute; bottom: 14px; right: 16px; font-family: 'Unbounded', sans-serif; font-size: 19px; font-weight: 700; color: var(--accent); opacity: 0.7; }
    .np-explore-divider { display: flex; align-items: center; gap: 12px; margin: 26px 0 16px; position: relative; z-index: 1; }
    .np-explore-divider .ln { flex: 1; height: 1px; background: var(--line); }
    .np-explore-divider span { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); }

    /* ---------- Why NextPath ---------- */
    .np-why { padding: 50px 24px 70px; max-width: 900px; margin: 0 auto; position: relative; z-index: 1; }
    .np-why-top { max-width: 640px; margin: 0 auto 40px; position: relative; z-index: 1; text-align: center; }
    .np-why-top h2 { font-family: 'Newsreader', serif; font-size: clamp(26px,3.6vw,36px); margin: 0 0 20px; color: var(--ink); letter-spacing: -0.01em; font-weight: 600; line-height: 1.28; }
    .np-why-top p { font-size: 15.5px; line-height: 1.8; color: var(--ink-soft); margin: 0 0 14px; }
    .np-why-top strong { color: var(--ink); font-weight: 700; }
    .np-why-top p.np-why-strong { color: var(--ink); font-weight: 700; font-size: 16.5px; margin-top: 20px; }
    .np-principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 30px; position: relative; z-index: 1; }
    @media (max-width: 780px) { .np-principles { grid-template-columns: 1fr; } }
    .np-principle { background: var(--paper); padding: 24px 22px; border-radius: 14px; border: 1px solid var(--line); }
    .np-principle .t { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: 0.06em; color: var(--cobalt-deep); margin-bottom: 8px; }
    .np-principle p { font-size: 13.5px; color: var(--ink-soft); line-height: 1.6; margin: 0; }

    /* ---------- Add opportunity CTA ---------- */
    .np-addcta { max-width: 1040px; margin: 0 auto 84px; padding: 0 24px; position: relative; z-index: 1; }
    .np-addcta-inner { background: linear-gradient(115deg, var(--cobalt-deep), var(--magenta-deep)); border-radius: 20px; padding: 44px 36px; text-align: center; position: relative; overflow: hidden; }
    .np-addcta h3 { font-family: 'Newsreader', serif; font-size: clamp(22px,2.8vw,29px); color: #fff; margin: 0 0 10px; font-weight: 600; position: relative; }
    .np-addcta p { color: rgba(255,255,255,0.82); font-size: 14px; margin: 0 0 22px; position: relative; }
    .np-addcta button { background: #fff; color: var(--cobalt-deep); font-weight: 700; padding: 13px 24px; border-radius: 9px; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: transform .15s ease; position: relative; }
    .np-addcta button:hover { transform: translateY(-2px); }

    /* ---------- Footer ---------- */
    .np-footer { border-top: 1px solid var(--line); padding: 30px 24px; max-width: 1140px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; position: relative; z-index: 1; }
    .np-footer .np-logo svg { color: var(--cobalt); }
    .np-footer .desc { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--ink-soft); margin-top: 4px; }
    .np-footer-links { display: flex; gap: 18px; font-size: 12.5px; color: var(--ink-soft); flex-wrap: wrap; }
    .np-footer-links a, .np-footer-links button { color: var(--ink-soft); }
    .np-footer-links a:hover, .np-footer-links button:hover { color: var(--ink); }

    /* ---------- Opportunities (Browse) page ---------- */
    .np-browse-top { position: relative; padding: 38px 24px 26px; text-align: center; overflow: hidden;
      background: radial-gradient(ellipse 50% 50% at 22% 0%, rgba(59,91,255,0.14) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 10%, rgba(18,184,196,0.12) 0%, transparent 60%), var(--bg); }
    .np-browse-top h2 { position: relative; font-family: 'Newsreader', serif; color: var(--ink); font-size: clamp(24px,3.2vw,32px); margin: 0 0 8px; letter-spacing: -0.01em; font-weight: 600; }
    .np-browse-top p { position: relative; color: var(--ink-soft); font-family: 'IBM Plex Mono', monospace; font-size: 12px; margin: 0; }
    .np-browse-wrap { max-width: 1160px; margin: 0 auto; padding: 24px 24px 80px; position: relative; z-index: 1; }
    .np-browse-search { display: flex; align-items: center; gap: 10px; background: var(--paper); border: 1.5px solid var(--ink); border-radius: 999px; padding: 13px 22px; margin-bottom: 22px; }
    .np-browse-search:focus-within { border-color: var(--cobalt-deep); }
    .np-browse-search input { border: none; outline: none; background: none; flex: 1; font-size: 14.5px; color: var(--ink); }
    .np-toolbar { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 16px 0; margin-bottom: 22px; display: flex; flex-wrap: wrap; align-items: center; gap: 18px; row-gap: 12px; }
    .np-toolbar-group { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
    .np-toolbar-sep { width: 1px; align-self: stretch; background: var(--line); }
    .np-select { border: none; border-bottom: 1.5px solid var(--line); background: transparent; border-radius: 0; padding: 6px 2px; font-size: 11.5px; font-weight: 600; color: var(--ink-soft); font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.04em; text-transform: uppercase; }
    .np-select:focus { border-bottom-color: var(--cobalt-deep); color: var(--ink); }
    .np-switch { display: inline-flex; align-items: center; gap: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ink-soft); cursor: pointer; padding: 6px 1px; border-bottom: 1.5px solid transparent; transition: color .12s ease, border-color .12s ease; }
    .np-switch.on { color: var(--teal-deep); border-bottom-color: var(--teal-deep); }
    .np-browse-count { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--ink-soft); margin-bottom: 16px; }

    /* ---------- Detail page ---------- */
    .np-detail-top { position: relative; padding: 30px 24px 56px; overflow: hidden; background: radial-gradient(ellipse 50% 50% at 20% 0%, rgba(139,92,246,0.14) 0%, transparent 60%), var(--bg); }
    .np-back { position: relative; display: inline-flex; align-items: center; gap: 5px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ink-soft); }
    .np-back:hover { color: var(--ink); }
    .np-detail { max-width: 720px; margin: -30px auto 0; padding: 0 24px 80px; position: relative; z-index: 1; }
    .np-detail-head { background: var(--paper); border-radius: 18px; padding: 32px; box-shadow: 0 1px 2px rgba(32,31,43,0.04), 0 20px 34px -22px rgba(32,31,43,0.22); margin-bottom: 30px; }
    .np-detail-head h1 { font-family: 'Newsreader', serif; font-size: clamp(26px,3.6vw,36px); margin: 14px 0 14px; line-height: 1.2; color: var(--ink); letter-spacing: -0.01em; font-weight: 600; }
    .np-detail-head .org { color: var(--ink-soft); font-size: 13.5px; margin-bottom: 4px; }
    .np-detail-head .lede { font-size: 14.5px; line-height: 1.65; color: var(--ink-soft); margin: 14px 0 20px; }
    .np-quickfacts { font-family: 'IBM Plex Mono', monospace; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px,1fr)); gap: 16px; border-top: 1px solid var(--line); padding-top: 18px; }
    .np-qf-item .k { font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-soft); margin-bottom: 4px; }
    .np-qf-item .v { font-size: 12.5px; font-weight: 700; display: flex; align-items: center; gap: 5px; color: var(--ink); }

    .np-realtalk { margin: 0 0 34px; padding: 6px 0 6px 22px; border-left: 3px solid var(--accent, var(--cobalt)); }
    .np-realtalk .kicker { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent, var(--cobalt)); margin-bottom: 8px; display: block; }
    .np-realtalk p { font-family: 'Newsreader', serif; font-style: italic; font-size: 19px; line-height: 1.5; color: var(--ink); margin: 0; font-weight: 500; }

    .np-flowsection { padding: 20px 0; border-top: 1px solid var(--line); }
    .np-flowsection h3 { font-family: 'IBM Plex Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); margin: 0 0 10px; font-weight: 700; }
    .np-flowsection p { font-size: 14.5px; line-height: 1.72; color: var(--ink); margin: 0; }

    .np-trust { display: flex; align-items: center; gap: 9px; font-size: 12px; color: var(--ink-soft); padding: 16px 0; }
    .np-trust svg { color: var(--teal-deep); flex-shrink: 0; }
    .np-trust a { color: var(--ink-soft); text-decoration: underline; }
    .np-trust a:hover { color: var(--ink); }
    .np-trust b { color: var(--ink); font-weight: 700; }

    .np-applybar { position: sticky; bottom: 14px; background: var(--cobalt-deep); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 16px 30px rgba(31,62,204,0.3); margin-top: 28px; gap: 14px; flex-wrap: wrap; }
    .np-applybar .txt { font-family: 'IBM Plex Mono', monospace; color: rgba(255,255,255,0.75); font-size: 11px; letter-spacing: 0.03em; text-transform: uppercase; }
    .np-applybar a { background: #fff; color: var(--cobalt-deep); font-weight: 700; padding: 11px 18px; border-radius: 8px; display: flex; align-items: center; gap: 6px; font-size: 13px; }
    .np-applybar a:hover { background: var(--magenta-soft); }

    /* ---------- About page ---------- */
    .np-about-top { position: relative; padding: 46px 24px 60px; text-align: center; overflow: hidden; background: radial-gradient(ellipse 50% 50% at 30% 10%, rgba(237,63,146,0.14) 0%, transparent 60%), radial-gradient(ellipse 46% 46% at 75% 0%, rgba(18,184,196,0.14) 0%, transparent 60%), var(--bg); }
    .np-about-top h1 { position: relative; font-family: 'Newsreader', serif; color: var(--ink); font-size: clamp(28px,4vw,42px); margin: 0; letter-spacing: -0.01em; font-weight: 600; }
    .np-about { max-width: 600px; margin: -30px auto 0; padding: 0 24px 80px; position: relative; z-index: 1; }

    /* ---------- Add / Report page ---------- */
    .np-add-top { position: relative; padding: 46px 24px 30px; text-align: center; overflow: hidden; background: radial-gradient(ellipse 50% 50% at 30% 10%, rgba(111,190,61,0.16) 0%, transparent 60%), radial-gradient(ellipse 46% 46% at 75% 0%, rgba(59,91,255,0.14) 0%, transparent 60%), var(--bg); }
    .np-add-top h1 { position: relative; font-family: 'Newsreader', serif; color: var(--ink); font-size: clamp(26px,3.6vw,36px); margin: 0 0 8px; letter-spacing: -0.01em; font-weight: 600; }
    .np-add-top p { position: relative; color: var(--ink-soft); font-size: 14.5px; margin: 0; max-width: 480px; margin: 0 auto; }
    .np-add-wrap { max-width: 620px; margin: 0 auto; padding: 30px 24px 90px; position: relative; z-index: 1; }
    .np-add-tabs { display: flex; gap: 10px; margin-bottom: 26px; }
    .np-add-tab { flex: 1; padding: 13px; border-radius: 11px; border: 1.5px solid var(--line); font-weight: 700; font-size: 13px; color: var(--ink-soft); text-align: center; transition: all .15s ease; }
    .np-add-tab.on { border-color: var(--cobalt-deep); color: var(--cobalt-deep); background: var(--cobalt-soft); }
    .np-field { margin-bottom: 16px; }
    .np-field label { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 6px; }
    .np-field input, .np-field select, .np-field textarea { width: 100%; border: 1.5px solid var(--line); border-radius: 10px; padding: 11px 14px; font-size: 14px; color: var(--ink); font-family: 'Manrope', sans-serif; background: var(--paper); }
    .np-field input:focus, .np-field select:focus, .np-field textarea:focus { outline: none; border-color: var(--cobalt-deep); }
    .np-field textarea { resize: vertical; min-height: 90px; }
    .np-submitbtn { width: 100%; background: var(--ink); color: #fff; font-weight: 700; padding: 14px; border-radius: 10px; font-size: 14.5px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background .15s ease; margin-top: 6px; }
    .np-submitbtn:hover { background: var(--magenta-deep); }
    .np-add-success { background: var(--lime-soft); border-radius: 14px; padding: 26px; text-align: center; }
    .np-add-success .t { font-family: 'Newsreader', serif; font-size: 20px; font-weight: 600; color: var(--ink); margin-bottom: 8px; }
    .np-add-success p { color: var(--ink-soft); font-size: 13.5px; margin: 0; }
  `}</style>
);

/* ---------------- STEM background motif set (used sparsely across the whole site) ---------------- */

function MotifDNA({ style, color = "var(--cobalt)" }) {
  return <svg className="np-motif" style={style} width="60" height="96" viewBox="0 0 60 96" fill="none"><path d="M6 4 C 6 22, 54 22, 54 40 C 54 58, 6 58, 6 76 C 6 86, 26 90, 34 90" stroke={color} strokeWidth="1.4" opacity="0.75" /><path d="M54 4 C 54 22, 6 22, 6 40 C 6 58, 54 58, 54 76 C 54 86, 34 90, 26 90" stroke={color} strokeWidth="1.4" opacity="0.75" />{[8,21,34,47,60,73].map((y,i)=><line key={i} x1="12" y1={y} x2="48" y2={y} stroke={color} strokeWidth="1.1" opacity="0.45" />)}</svg>;
}
function MotifAtom({ style, color = "var(--teal)" }) {
  return <svg className="np-motif" style={style} width="82" height="82" viewBox="0 0 82 82" fill="none"><ellipse cx="41" cy="41" rx="36" ry="13.5" stroke={color} strokeWidth="1.3" opacity="0.75" transform="rotate(20 41 41)" /><ellipse cx="41" cy="41" rx="36" ry="13.5" stroke={color} strokeWidth="1.3" opacity="0.75" transform="rotate(-20 41 41)" /><ellipse cx="41" cy="41" rx="36" ry="13.5" stroke={color} strokeWidth="1.3" opacity="0.75" transform="rotate(90 41 41)" /><circle cx="41" cy="41" r="5.5" fill={color} /></svg>;
}
function MotifGraph({ style, color = "var(--magenta)" }) {
  return <svg className="np-motif" style={style} width="100" height="64" viewBox="0 0 100 64" fill="none"><line x1="5" y1="5" x2="5" y2="58" stroke={color} strokeWidth="1.3" opacity="0.5" /><line x1="5" y1="58" x2="94" y2="58" stroke={color} strokeWidth="1.3" opacity="0.5" /><path d="M5 45 L 27 30 L 47 40 L 68 12 L 94 20" stroke={color} strokeWidth="1.6" opacity="0.8" fill="none" /><circle cx="68" cy="12" r="3" fill={color} /></svg>;
}
function MotifOrbitPath({ style, color = "var(--violet)" }) {
  return <svg className="np-motif" style={style} width="120" height="56" viewBox="0 0 120 56" fill="none"><path d="M4 46 C 32 46, 32 8, 60 8 S 92 46, 116 46" stroke={color} strokeWidth="1.4" strokeDasharray="1 7" strokeLinecap="round" opacity="0.7" /><circle cx="4" cy="46" r="3" fill={color} /><circle cx="116" cy="46" r="3" fill={color} /></svg>;
}
function MotifTelescope({ style, color = "var(--lime)" }) {
  return <svg className="np-motif" style={style} width="54" height="74" viewBox="0 0 54 74" fill="none"><line x1="9" y1="65" x2="42" y2="16" stroke={color} strokeWidth="4.5" opacity="0.65" strokeLinecap="round" /><line x1="42" y1="16" x2="48" y2="24" stroke={color} strokeWidth="4.5" opacity="0.65" strokeLinecap="round" /><line x1="5" y1="70" x2="23" y2="55" stroke={color} strokeWidth="1.4" opacity="0.55" /><line x1="30" y1="70" x2="12" y2="55" stroke={color} strokeWidth="1.4" opacity="0.55" /></svg>;
}
function MotifStar({ style, color = "var(--magenta)" }) {
  return <svg className="np-motif" style={style} width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" fill={color} opacity="0.85" /></svg>;
}
function MotifMap({ style, color = "var(--teal)" }) {
  return <svg className="np-motif" style={style} width="70" height="56" viewBox="0 0 70 56" fill="none"><path d="M4 50 L20 8 L36 40 L50 12 L66 46" stroke={color} strokeWidth="1.4" strokeDasharray="4 3" opacity="0.65" fill="none" /><circle cx="20" cy="8" r="3" fill={color} /><circle cx="66" cy="46" r="3" fill={color} /></svg>;
}
function MotifBook({ style, color = "var(--cobalt)" }) {
  return <svg className="np-motif" style={style} width="64" height="48" viewBox="0 0 64 48" fill="none"><path d="M32 8 C 26 4, 12 4, 6 7 V40 C 12 37, 26 37, 32 41" stroke={color} strokeWidth="1.4" opacity="0.6" /><path d="M32 8 C 38 4, 52 4, 58 7 V40 C 52 37, 38 37, 32 41" stroke={color} strokeWidth="1.4" opacity="0.6" /><line x1="32" y1="8" x2="32" y2="41" stroke={color} strokeWidth="1.2" opacity="0.4" /></svg>;
}

function BackgroundWorld({ items, parallax = false }) {
  return (
    <div className="np-motiflayer" aria-hidden="true">
      {items.map((it, i) => (
        <div key={i} className="np-drift" style={{
          position: "absolute", top: it.top, left: it.left ?? undefined, right: it.right ?? undefined,
          "--r": `${(i % 2 === 0 ? -1 : 1) * 2}deg`, animationDelay: `${(i % 5) * 0.35}s`,
          transform: parallax ? `translate(calc(var(--px,0px) * ${it.depth || 10} / 100), calc(var(--py,0px) * ${it.depth || 10} / 100))` : undefined,
        }}>
          {it.motif}
        </div>
      ))}
    </div>
  );
}

const HERO_MOTIFS = [
  { top: "6%", left: "5%", right: null, depth: 18, motif: <MotifAtom /> },
  { top: "10%", left: null, right: "6%", depth: 14, motif: <MotifDNA /> },
  { top: "62%", left: "2%", right: null, depth: 10, motif: <MotifGraph /> },
  { top: "68%", left: null, right: "9%", depth: 16, motif: <MotifTelescope /> },
  { top: "34%", left: "16%", right: null, depth: 22, motif: <MotifStar /> },
  { top: "40%", left: null, right: "20%", depth: 20, motif: <MotifStar color="var(--teal)" /> },
  { top: "-4%", left: "34%", right: null, depth: 8, motif: <MotifOrbitPath /> },
  { top: "80%", left: "30%", right: null, depth: 12, motif: <MotifMap /> },
];
const SPARSE = {
  showcase: [{ top: "-4%", right: "2%", motif: <MotifGraph color="var(--cobalt)" style={{ width: 60, height: 40, opacity: 0.16 }} /> }, { top: "85%", left: "0%", motif: <MotifStar color="var(--teal)" style={{ width: 16, height: 16, opacity: 0.3 }} /> }],
  explore: [{ top: "-2%", left: "42%", motif: <MotifOrbitPath color="var(--violet)" style={{ width: 80, height: 36, opacity: 0.14 }} /> }],
  why: [{ top: "2%", right: "1%", motif: <MotifDNA color="var(--magenta)" style={{ width: 34, height: 54, opacity: 0.14 }} /> }, { top: "78%", left: "-1%", motif: <MotifMap color="var(--cobalt)" style={{ width: 48, height: 38, opacity: 0.16 }} /> }],
  addcta: [{ top: "10%", right: "6%", motif: <MotifStar color="#fff" style={{ width: 18, height: 18, opacity: 0.5 }} /> }, { top: "70%", left: "6%", motif: <MotifOrbitPath color="#fff" style={{ width: 70, height: 32, opacity: 0.35 }} /> }],
  browseTop: [{ top: "6%", right: "8%", motif: <MotifBook color="var(--cobalt)" style={{ width: 40, height: 30, opacity: 0.18 }} /> }, { top: "60%", left: "4%", motif: <MotifStar color="var(--magenta)" style={{ width: 14, height: 14, opacity: 0.3 }} /> }],
  detailTop: [{ top: "10%", left: "6%", motif: <MotifAtom color="var(--teal)" style={{ width: 44, height: 44, opacity: 0.16 }} /> }],
  aboutTop: [{ top: "8%", left: "8%", motif: <MotifBook color="var(--magenta)" style={{ width: 44, height: 34, opacity: 0.18 }} /> }, { top: "65%", right: "6%", motif: <MotifOrbitPath color="var(--cobalt)" style={{ width: 76, height: 34, opacity: 0.16 }} /> }],
  footer: [{ top: "10%", right: "10%", motif: <MotifStar color="var(--violet)" style={{ width: 14, height: 14, opacity: 0.3 }} /> }],
};

/* ---------------- Category stickers — small custom illustrations ---------------- */

function StickerMolecule({ color }) {
  return <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><line x1="10" y1="10" x2="21" y2="13" stroke={color} strokeWidth="1.5" /><line x1="21" y1="13" x2="15" y2="23" stroke={color} strokeWidth="1.5" /><line x1="10" y1="10" x2="15" y2="23" stroke={color} strokeWidth="1.5" opacity="0.5" /><circle cx="10" cy="10" r="3.5" fill={color} /><circle cx="21" cy="13" r="2.6" stroke={color} strokeWidth="1.5" /><circle cx="15" cy="23" r="2.6" stroke={color} strokeWidth="1.5" /></svg>;
}
function StickerTrophy({ color }) {
  return <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M9 6H23L21 17Q16 21 11 17Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 8C5 8 5 14 10 14" stroke={color} strokeWidth="1.4" /><path d="M23 8C27 8 27 14 22 14" stroke={color} strokeWidth="1.4" /><line x1="16" y1="21" x2="16" y2="25" stroke={color} strokeWidth="1.5" /><line x1="11" y1="27" x2="21" y2="27" stroke={color} strokeWidth="1.5" /></svg>;
}
function StickerMedal({ color }) {
  return <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M12 15 L8 27 L16 23 L24 27 L20 15" stroke={color} strokeWidth="1.4" strokeLinejoin="round" /><circle cx="16" cy="12" r="8" stroke={color} strokeWidth="1.6" /><path d="M16 7 L17.3 10.8 L21 11 L18.1 13.4 L19 17 L16 14.9 L13 17 L13.9 13.4 L11 11 L14.7 10.8 Z" fill={color} /></svg>;
}
function StickerBadge({ color }) {
  return <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><path d="M13 4H19V8H13Z" stroke={color} strokeWidth="1.4" /><rect x="7" y="8" width="18" height="20" rx="3" stroke={color} strokeWidth="1.5" /><circle cx="16" cy="15" r="3.2" stroke={color} strokeWidth="1.4" /><line x1="11" y1="23" x2="21" y2="23" stroke={color} strokeWidth="1.4" /></svg>;
}
function StickerNotebook({ color }) {
  return <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect x="8" y="5" width="19" height="22" rx="2" stroke={color} strokeWidth="1.5" /><circle cx="8" cy="10" r="1.4" fill={color} /><circle cx="8" cy="16" r="1.4" fill={color} /><circle cx="8" cy="22" r="1.4" fill={color} /><line x1="13" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.3" /><line x1="13" y1="17" x2="22" y2="17" stroke={color} strokeWidth="1.3" /><line x1="13" y1="22" x2="19" y2="22" stroke={color} strokeWidth="1.3" /></svg>;
}
function StickerNetwork({ color }) {
  return <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><line x1="16" y1="16" x2="8" y2="9" stroke={color} strokeWidth="1.4" /><line x1="16" y1="16" x2="24" y2="9" stroke={color} strokeWidth="1.4" /><line x1="16" y1="16" x2="16" y2="26" stroke={color} strokeWidth="1.4" /><circle cx="16" cy="16" r="3.4" fill={color} /><circle cx="8" cy="9" r="2.6" stroke={color} strokeWidth="1.4" /><circle cx="24" cy="9" r="2.6" stroke={color} strokeWidth="1.4" /><circle cx="16" cy="26" r="2.6" stroke={color} strokeWidth="1.4" /></svg>;
}
const STICKERS = { "Судалгаа": StickerMolecule, "Уралдаан": StickerTrophy, "Тэтгэлэг": StickerMedal, "Дадлага": StickerBadge, "Хичээл/Курс": StickerNotebook, "Сайн дурын ажил": StickerNetwork };

/* ---------------- Small pieces ---------------- */

function Nav({ view, setView, openAdd }) {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const go = (v) => { setView(v); setOpen(false); };

  useEffect(() => {
    if (!dropOpen) return;
    const onClick = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [dropOpen]);

  return (
    <div className="np-nav">
      <div className="np-nav-inner">
        <div className="np-logo np-display" onClick={() => go("home")}><Compass size={17} strokeWidth={2.4} /> NEXTPATH</div>
        <div className="np-navlinks">
          <button className={`np-navlink ${view === "home" ? "active" : ""}`} onClick={() => go("home")}>Нүүр</button>
          <button className={`np-navlink ${view === "browse" ? "active" : ""}`} onClick={() => go("browse")}>Боломжууд</button>
          <button className={`np-navlink ${view === "about" ? "active" : ""}`} onClick={() => go("about")}>Бидний тухай</button>
          <div className="np-navdrop" ref={dropRef}>
            <button className={`np-navlink dropbtn ${view === "add" ? "active" : ""}`} onClick={() => setDropOpen(o => !o)} aria-expanded={dropOpen} aria-haspopup="true">
              Боломж нэмэх <ChevronDown size={13} style={{ transform: dropOpen ? "rotate(180deg)" : "none", transition: "transform .15s ease" }} />
            </button>
            {dropOpen && (
              <div className="np-navdrop-panel">
                <button onClick={() => { openAdd("add"); setDropOpen(false); setView("add"); }}>Шинэ боломж нэмэх</button>
                <button onClick={() => { openAdd("report"); setDropOpen(false); setView("add"); }}>Хуучирсан/буруу мэдээлэл мэдэгдэх</button>
              </div>
            )}
          </div>
        </div>
        <button className="np-navburger" aria-label="Цэс нээх" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={21} /></button>
      </div>
      {open && (
        <div className="np-mobilemenu" role="dialog" aria-modal="true">
          <div className="np-mobilemenu-top">
            <div className="np-logo np-display"><Compass size={17} /> NEXTPATH</div>
            <button aria-label="Хаах" style={{ color: "var(--ink)" }} onClick={() => setOpen(false)}><X size={24} /></button>
          </div>
          <button className="np-mm-link" onClick={() => go("home")}>Нүүр</button>
          <button className="np-mm-link" onClick={() => go("browse")}>Боломжууд</button>
          <button className="np-mm-link" onClick={() => go("about")}>Бидний тухай</button>
          <div className="np-mobilemenu-cta" onClick={() => { openAdd("add"); go("add"); }}>Шинэ боломж нэмэх</div>
          <div className="np-mobilemenu-cta" onClick={() => { openAdd("report"); go("add"); }}>Хуучирсан/буруу мэдээлэл мэдэгдэх</div>
        </div>
      )}
    </div>
  );
}

function Tag({ label, accent = "cobalt", filled = false, onClick }) {
  return <button className={`np-tag ${filled ? "filled" : ""}`} style={{ "--tag-color": `var(--${accent}-deep)` }} onClick={onClick}>{label}</button>;
}

function OpportunityCard({ opp, onClick }) {
  const days = daysUntil(opp.deadline);
  const soon = days <= 21 && days >= 0;
  const accent = accentFor(opp.type);
  const Sticker = STICKERS[opp.type] || StickerMolecule;
  return (
    <div className="np-card-wrap">
      <div className="np-card" style={{ "--accent": `var(--${accent})` }}
        onClick={() => onClick(opp)}
        role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onClick(opp); }}>
        {opp.isNew && <div className="np-card-newstamp"><Sparkles size={10} /> ШИНЭ</div>}
        <div className="np-card-sticker" style={{ background: `var(--${accent}-soft)` }}><Sticker color={`var(--${accent}-deep)`} /></div>
        <div className="np-card-body">
          <span className="np-card-typelabel" style={{ color: `var(--${accent}-deep)` }}>{opp.type}</span>
          <h4>{opp.name}</h4>
          <div className="org">{opp.org}</div>
          <div className="desc">{opp.description}</div>
          <div className="np-card-meta">
            <div className="facts">
              {opp.grade} анги<span className="dot">·</span>{opp.format}<span className="dot">·</span>{opp.cost}
              {opp.mongoliaEligible && <><span className="dot">·</span>{opp.origin === "mongolia" ? "Монгол" : "Олон улс"}</>}
            </div>
            <div className={`deadline ${soon ? "soon" : ""}`}><Clock size={11} />БҮРТГЭЛ ДУУСАХ · {formatDateCompact(opp.deadline)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub, onSeeAll }) {
  return (
    <div className="np-section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3>{title}</h3>
        {sub && <div style={{ color: "var(--ink-soft)", fontSize: 12.5, marginTop: 6 }}>{sub}</div>}
      </div>
      {onSeeAll && <button className="np-seeall" onClick={onSeeAll}>Бүгдийг харах <ArrowRight size={13} /></button>}
    </div>
  );
}

/* ---------------- Pages ---------------- */

const INTEREST_AREAS = [
  { label: "STEM", sub: "Шинжлэх ухаан · Технологи · Инженерчлэл", accent: "cobalt", Icon: FlaskConical, query: "" },
  { label: "Нийгэм, хүмүүнлэг", sub: "Олон улсын харилцаа · Нийгмийн ухаан · Хууль", accent: "violet", Icon: Globe2, query: "нийгэм" },
  { label: "Бизнес, эдийн засаг", sub: "Бизнес · Эдийн засаг · Манлайлал", accent: "magenta", Icon: Briefcase, query: "бизнес" },
  { label: "Урлаг, бүтээлч", sub: "Дизайн · Хөгжим · Медиа", accent: "teal", Icon: Palette, query: "урлаг" },
  { label: "Эрүүл мэнд, амьдралын ухаан", sub: "Анагаах ухаан · Сэтгэл судлал · Биологи", accent: "lime", Icon: HeartPulse, query: "био" },
];

function Home({ setView, openDetail, setCategoryFilter, setOriginFilter, setQueryFilter }) {
  const heroRef = useRef(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches || !heroRef.current) return;
    const el = heroRef.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 40;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 40;
      el.style.setProperty("--px", `${x}px`);
      el.style.setProperty("--py", `${y}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  const showcase = OPPS.filter(o => o.featured || o.isNew).slice(0, 4);
  const soonCount = OPPS.filter(o => daysUntil(o.deadline) <= 30 && daysUntil(o.deadline) >= 0).length;
  const mnCount = OPPS.filter(o => o.origin === "mongolia").length;
  const intlCount = OPPS.filter(o => o.origin === "international").length;

  const goExplore = (origin, category, query) => {
    setOriginFilter(origin || null); setCategoryFilter(category || null); setQueryFilter(query || "");
    setView("browse");
  };

  return (
    <div>
      <div className="np-hero" ref={heroRef}>
        <BackgroundWorld items={HERO_MOTIFS} parallax />
        <div className="np-hero-eyebrow"><Sparkles size={13} /> МОНГОЛ СУРАГЧДАД ЗОРИУЛАВ</div>
        <h1>Өөрт тохирох боломжоо ол.</h1>
        <p>Судалгаа, тэтгэлэг, уралдаан, дадлага, хөтөлбөр болон бусад боломжуудыг нэг дороос хайж олоорой.</p>
        <div className="np-hero-closer"><span>Дараагийн алхмаа эндээс.</span></div>
      </div>

      <div className="np-section" style={{ position: "relative" }}>
        <BackgroundWorld items={SPARSE.showcase} />
        <SectionHead title="Онцлох боломжууд" sub="Энэ долоо хоногийн онцлох боломжуудтай танилцаарай." onSeeAll={() => setView("browse")} />
        <div className="np-grid">{showcase.map(o => <OpportunityCard key={o.id} opp={o} onClick={openDetail} />)}</div>
      </div>

      <div className="np-section" style={{ paddingTop: 0, position: "relative" }}>
        <BackgroundWorld items={SPARSE.explore} />
        <SectionHead eyebrow="/// НЭЭЖ ЭХЭЛ" title="Хаанаас эхлэх вэ?" sub="Сонирхлоороо, эсвэл гарал/хугацаагаар хайж эхэл" />
        <div className="np-exploregrid g5">
          {INTEREST_AREAS.map(a => (
            <button key={a.label} className="np-exploretile" style={{ "--accent": `var(--${a.accent}-deep)`, background: `var(--${a.accent}-soft)` }} onClick={() => goExplore(null, null, a.query)}>
              <div className="icon"><a.Icon size={19} /></div>
              <div><div className="lbl">{a.label}</div><div className="sub">{a.sub}</div></div>
            </button>
          ))}
        </div>
        <div className="np-explore-divider"><div className="ln" /><span>Эсвэл</span><div className="ln" /></div>
        <div className="np-exploregrid g3">
          <button className="np-exploretile" style={{ "--accent": "var(--teal-deep)", background: "var(--teal-soft)" }} onClick={() => goExplore("mongolia", null, "")}>
            <div className="icon"><Flag size={19} /></div>
            <div><div className="lbl">Монголд</div><div className="sub">ДОТООДЫН БОЛОМЖУУД</div></div>
            <div className="count">{mnCount}</div>
          </button>
          <button className="np-exploretile" style={{ "--accent": "var(--violet-deep)", background: "var(--violet-soft)" }} onClick={() => goExplore("international", null, "")}>
            <div className="icon"><Globe2 size={19} /></div>
            <div><div className="lbl">Олон улсад</div><div className="sub">ГАДААД / ОНЛАЙН</div></div>
            <div className="count">{intlCount}</div>
          </button>
          <button className="np-exploretile" style={{ "--accent": "var(--magenta-deep)", background: "var(--magenta-soft)" }} onClick={() => goExplore(null, null, "")}>
            <div className="icon"><Clock size={19} /></div>
            <div><div className="lbl">Хугацаа нь ойртож буй</div><div className="sub">30 ХОНОГИЙН ДОТОР</div></div>
            <div className="count">{soonCount}</div>
          </button>
        </div>
      </div>

      <div className="np-why">
        <BackgroundWorld items={SPARSE.why} />
        <div className="np-why-top">
          <h2>Дараагийн алхам эндээс.</h2>
          <p>Заримдаа дараагийн алхам чинь юу байхыг шууд мэдэх албагүй. Сонирхож байгаа зүйлээ туршиж үзэхэд л хангалттай.</p>
          <p><strong>Нэг боломж</strong> шинэ сонирхол нээж болно. <strong>Нэг хөтөлбөр</strong> шинэ хүнтэй танилцуулж болно. <strong>Нэг туршлага</strong> цааш явах чиглэлийг ч өөрчлөх боломжтой.</p>
          <p className="np-why-strong">Тиймээс хайж үз. Сонирх. Туршиж үз. Өөрийн дараагийн алхмыг олоорой.</p>
        </div>
        <div className="np-principles">
          <div className="np-principle"><div className="t">ХАЙ</div><p>Өөрт сонирхолтой боломжуудаа ол.</p></div>
          <div className="np-principle"><div className="t">СОНГО</div><p>Өөрт тохирохыг нь харьцуулж үз.</p></div>
          <div className="np-principle"><div className="t">АЛХ</div><p>Олсон боломжоо дараагийн алхам болго.</p></div>
        </div>
      </div>

      <div className="np-addcta">
        <div className="np-addcta-inner">
          <BackgroundWorld items={SPARSE.addcta} />
          <h3>Мэдэх ёстой боломж байна уу?</h3>
          <p>Чи мэддэг сайхан боломжоо бидэнд хэлээрэй — бусад сурагчдад тус болно.</p>
          <button onClick={() => setView("add")}>Боломж санал болгох <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function Browse({ openDetail, initialCategory, initialOrigin, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [type, setType] = useState(initialCategory || null);
  const [origin, setOrigin] = useState(initialOrigin || null);
  const [format, setFormat] = useState("");
  const [cost, setCost] = useState("");
  const [level, setLevel] = useState("");
  const [mnOnly, setMnOnly] = useState(false);
  const [soonFirst, setSoonFirst] = useState(false);

  const formats = [...new Set(OPPS.map(o => o.format))];
  const costs = [...new Set(OPPS.map(o => o.cost))];
  const levels = [...new Set(OPPS.map(o => o.experienceLevel))];

  let filtered = OPPS.filter(o => {
    if (type && o.type !== type) return false;
    if (origin && o.origin !== origin) return false;
    if (format && o.format !== format) return false;
    if (cost && o.cost !== cost) return false;
    if (level && o.experienceLevel !== level) return false;
    if (mnOnly && !o.mongoliaEligible) return false;
    if (query && !(`${o.name} ${o.org} ${o.field} ${o.description}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });
  if (soonFirst) filtered = [...filtered].sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));

  return (
    <div>
      <div className="np-browse-top">
        <BackgroundWorld items={SPARSE.browseTop} />
        <h2>Боломжуудын сан</h2>
        <p>{OPPS.length}+ БОЛОМЖООС ЧАМД ТОХИРОХЫГ ОЛ</p>
      </div>
      <div className="np-browse-wrap">
        <div className="np-browse-search">
          <Search size={16} style={{ color: "var(--ink-soft)" }} />
          <input aria-label="Боломж хайх" placeholder="Нэр, байгууллага, чиглэлээр хайх..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        <div className="np-hero-tags" style={{ justifyContent: "flex-start", marginTop: 0, marginBottom: 20 }}>
          <Tag label="Бүгд" accent="cobalt" filled={!type} onClick={() => setType(null)} />
          {CATEGORIES.map(c => <Tag key={c} label={c} accent={accentFor(c)} filled={type === c} onClick={() => setType(c)} />)}
        </div>

        <div className="np-toolbar">
          <div className="np-toolbar-group">
            <button className={`np-switch ${origin === "mongolia" ? "on" : ""}`} onClick={() => setOrigin(origin === "mongolia" ? null : "mongolia")}>Монголд</button>
            <button className={`np-switch ${origin === "international" ? "on" : ""}`} onClick={() => setOrigin(origin === "international" ? null : "international")}>Олон улсад</button>
          </div>
          <div className="np-toolbar-sep" />
          <div className="np-toolbar-group">
            <select className="np-select" aria-label="Хэлбэр" value={format} onChange={e => setFormat(e.target.value)}>
              <option value="">Хэлбэр: бүгд</option>{formats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select className="np-select" aria-label="Үнэ" value={cost} onChange={e => setCost(e.target.value)}>
              <option value="">Үнэ: бүгд</option>{costs.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="np-select" aria-label="Түвшин" value={level} onChange={e => setLevel(e.target.value)}>
              <option value="">Түвшин: бүгд</option>{levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="np-toolbar-sep" />
          <div className="np-toolbar-group">
            <button className={`np-switch ${mnOnly ? "on" : ""}`} onClick={() => setMnOnly(!mnOnly)}>Монголд нээлттэй</button>
            <button className={`np-switch ${soonFirst ? "on" : ""}`} onClick={() => setSoonFirst(!soonFirst)}>Хугацаагаар эрэмбэлэх</button>
          </div>
        </div>

        <div className="np-browse-count">{filtered.length} БОЛОМЖ ОЛДЛОО</div>
        <div className="np-grid">{filtered.map(o => <OpportunityCard key={o.id} opp={o} onClick={openDetail} />)}</div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--ink-soft)" }}>Тохирох боломж олдсонгүй. Шүүлтүүрээ өөрчилж үзнэ үү.</div>}
      </div>
    </div>
  );
}

function Detail({ opp, back }) {
  if (!opp) return null;
  const days = daysUntil(opp.deadline);
  const related = OPPS.filter(o => o.id !== opp.id && o.type === opp.type).slice(0, 3);
  const accent = accentFor(opp.type);
  const Sticker = STICKERS[opp.type] || StickerMolecule;
  return (
    <div className="np-enter">
      <div className="np-detail-top">
        <BackgroundWorld items={SPARSE.detailTop} />
        <div style={{ maxWidth: 720, margin: "0 auto" }}><button className="np-back" onClick={back}><ChevronLeft size={15} /> Буцах</button></div>
      </div>
      <div className="np-detail">
        <div className="np-detail-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div className="np-card-sticker" style={{ position: "static", transform: "none", background: `var(--${accent}-soft)`, boxShadow: "none", border: "none" }}><Sticker color={`var(--${accent}-deep)`} /></div>
            <span className="np-card-typelabel" style={{ color: `var(--${accent}-deep)`, marginBottom: 0 }}>{opp.type}</span>
          </div>
          <h1>{opp.name}</h1>
          <div className="org">{opp.org}{opp.mongoliaEligible ? ` · ${opp.origin === "mongolia" ? "Монгол" : "Олон улс, Монголд нээлттэй"}` : ""}</div>
          <p className="lede">{opp.description}</p>
          <div className="np-quickfacts">
            <div className="np-qf-item"><div className="k">Анги</div><div className="v"><GraduationCap size={13} />{opp.grade}</div></div>
            <div className="np-qf-item"><div className="k">Хэлбэр</div><div className="v">{opp.format === "Онлайн" ? <Wifi size={13} /> : <MapPin size={13} />}{opp.format}</div></div>
            <div className="np-qf-item"><div className="k">Үнэ</div><div className="v">{opp.cost}</div></div>
            <div className="np-qf-item"><div className="k">Байршил</div><div className="v"><Flag size={13} />{opp.location}</div></div>
            <div className="np-qf-item"><div className="k">Бүртгэл дуусах</div><div className="v" style={{ color: days <= 21 ? "var(--magenta-deep)" : "var(--ink)" }}><Clock size={13} />{formatDate(opp.deadline)}</div></div>
            {opp.programStart && <div className="np-qf-item"><div className="k">Хөтөлбөр эхлэх</div><div className="v"><Clock size={13} />{formatDate(opp.programStart)}</div></div>}
            {opp.programEnd && <div className="np-qf-item"><div className="k">Хөтөлбөр дуусах</div><div className="v"><Clock size={13} />{formatDate(opp.programEnd)}</div></div>}
            <div className="np-qf-item"><div className="k">Түвшин</div><div className="v"><Users2 size={13} />{opp.experienceLevel}</div></div>
          </div>
        </div>

        <div className="np-realtalk" style={{ "--accent": `var(--${accent})` }}>
          <span className="kicker">Юу хийх вэ?</span>
          <p>{opp.whatYouDo}</p>
        </div>

        {opp.competitiveness && (
          <div className="np-flowsection"><h3>Хэр өрсөлдөөнтэй вэ?</h3><p>{opp.competitiveness}</p></div>
        )}
        <div className="np-flowsection"><h3>Юу хэрэгтэй вэ?</h3><p>{opp.requirements}</p></div>
        {opp.bestFor && <div className="np-flowsection"><h3>Хэнд илүү тохирох вэ?</h3><p>{opp.bestFor}</p></div>}
        {opp.timeCommitment && <div className="np-flowsection"><h3>Хэдий хэмжээний цаг зарцуулах вэ?</h3><p>{opp.timeCommitment}</p></div>}
        <div className="np-flowsection"><h3>Юу олж авах вэ?</h3><p>{opp.whatYouGet}</p></div>

        <div className="np-trust">
          <CheckCircle2 size={16} />
          <span><b>NextPath-аар шалгагдсан</b> · Сүүлд шалгасан: {formatDate(opp.verifiedDate)} · <a href="#">Хуучирсан мэдээлэл мэдэгдэх</a></span>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 6, marginBottom: 10 }}>
            <SectionHead title="Төстэй боломжууд" />
            <div className="np-row">{related.map(r => <OpportunityCard key={r.id} opp={r} onClick={() => {}} />)}</div>
          </div>
        )}

        <div className="np-applybar"><div className="txt">Албан ёсны эх сурвалж дээр өргөдлөө гарга</div><a href={opp.officialLink}>Өргөдөл гаргах <ExternalLink size={14} /></a></div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
      <div className="np-about-top">
        <BackgroundWorld items={SPARSE.aboutTop} />
        <h1>Бидний тухай</h1>
      </div>
      <div className="np-about">
        <div className="np-flowsection" style={{ borderTop: "none", paddingTop: 0 }}>
          <p style={{ fontSize: 16, lineHeight: 1.75 }}><strong>NextPath бол Монгол сурагчдад өөрт тохирох боломж, сонирхсон чиглэлээ олоход нь туслах газрын зураг.</strong></p>
        </div>
        <div className="np-flowsection">
          <p style={{ fontSize: 15, lineHeight: 1.8 }}>Судалгаа, тэтгэлэг, уралдаан, дадлага, хөтөлбөр гээд сонирхлоо хөгжүүлж, шинэ зүйл туршиж үзэхэд туслах маш олон боломж байдаг. Гэхдээ тэдгээрийг олох нь өөрөө заримдаа хамгийн хэцүү хэсэг нь болдог. Мэдээлэл нь олон газар тархсан байдаг болохоор яг өөрт тохирох боломжоо олоод, юу хийх, хэнд зориулсан, хэрхэн оролцохыг нь ойлгоход цаг их ордог.</p>
        </div>
        <div className="np-flowsection">
          <p style={{ fontSize: 15, lineHeight: 1.8 }}>Үүнээс болоод олон сонирхолтой, үр өгөөжтэй боломж сурагчдын хажуугаар зүгээр л өнгөрчихдөг.</p>
        </div>
        <div className="np-flowsection">
          <p style={{ fontSize: 15, lineHeight: 1.8 }}>Гэхдээ боломжууд зөвхөн их сургуульд ороход хэрэгтэй зүйл биш. Ямар нэг хөтөлбөрт орж үзээд шинэ зүйл сурч, өөрийнхөө юу сонирхдгийг илүү сайн ойлгож, шинэ хүмүүстэй танилцаж, туршлага хуримтлуулж, өмнө нь бодож байгаагүй чиглэлээ ч олж болно.</p>
        </div>
        <div className="np-flowsection">
          <p style={{ fontSize: 15, lineHeight: 1.8 }}>Тиймээс NextPath-ийн зорилго нь боломжуудыг зүгээр нэг жагсааж тавих биш. <strong>Яг юу болох, хэнд тохирох, хэрхэн оролцохыг нь ойлгоход хялбар болгож, сурагч бүр өөрт тохирох зүйлээ олж, дараагийн алхмаа өөрөө хийхэд нь туслах юм.</strong></p>
        </div>
        <div className="np-flowsection">
          <p style={{ fontSize: 15.5, lineHeight: 1.8 }}><strong>Дараагийн алхмаа эндээс.</strong></p>
        </div>
      </div>
    </div>
  );
}

function AddOpportunity({ initialTab, back }) {
  const [tab, setTab] = useState(initialTab || "add");
  useEffect(() => { setTab(initialTab || "add"); }, [initialTab]);
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div>
      <div className="np-add-top">
        <div style={{ maxWidth: 620, margin: "0 auto 14px", textAlign: "left" }}>
          <button className="np-back" onClick={back}><ChevronLeft size={15} /> Буцах</button>
        </div>
        <h1>Боломж нэмэх</h1>
        <p>Чи мэддэг боломжоо хуваалцаарай, эсвэл сайтад байгаа мэдээллийг сайжруулахад тусал.</p>
      </div>
      <div className="np-add-wrap">
        <div className="np-add-tabs">
          <button className={`np-add-tab ${tab === "add" ? "on" : ""}`} onClick={() => { setTab("add"); setSubmitted(false); }}>Боломж нэмэх</button>
          <button className={`np-add-tab ${tab === "report" ? "on" : ""}`} onClick={() => { setTab("report"); setSubmitted(false); }}>Сайжруулах санал</button>
        </div>

        {submitted ? (
          <div className="np-add-success">
            <div className="t">Баярлалаа!</div>
            <p>{tab === "add" ? "Таны илгээсэн боломжийг бид шалгаад, удахгүй сайтад нэмнэ." : "Таны саналыг хүлээн авлаа. NextPath-ыг сайжруулахад тусалсанд баярлалаа."}</p>
          </div>
        ) : tab === "add" ? (
          <form onSubmit={onSubmit}>
            <div className="np-field"><label>Боломжийн нэр</label><input required placeholder="Жишээ: Залуу Судлаачдын Хөтөлбөр" /></div>
            <div className="np-field"><label>Байгууллага</label><input required placeholder="Жишээ: ШУТИС" /></div>
            <div className="np-field"><label>Албан ёсны холбоос</label><input required type="url" placeholder="https://..." /></div>
            <div className="np-field"><label>Төрөл</label>
              <select required defaultValue="">
                <option value="" disabled>Сонгох...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="np-field"><label>Хэнд зориулагдсан бэ</label><input placeholder="Жишээ: 9–11 дүгээр ангийн сурагчид" /></div>
            <div className="np-field"><label>Бүртгэл дуусах хугацаа</label><input type="date" /></div>
            <div className="np-field"><label>Нэмэлт мэдээлэл</label><textarea placeholder="Бусад мэдэх ёстой зүйл..." /></div>
            <button className="np-submitbtn" type="submit"><SendIcon size={15} /> Илгээх</button>
          </form>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="np-field"><label>Асуудлын төрөл</label>
              <select required defaultValue="">
                <option value="" disabled>Сонгох...</option>
                <option>Буруу мэдээлэл</option>
                <option>Хуучирсан мэдээлэл</option>
                <option>Эвдэрсэн холбоос</option>
                <option>Дутуу мэдээлэл</option>
                <option>Сайт сайжруулах санал</option>
              </select>
            </div>
            <div className="np-field"><label>Аль боломжтой холбоотой вэ (мэдвэл)</label><input placeholder="Боломжийн нэр" /></div>
            <div className="np-field"><label>Дэлгэрэнгүй</label><textarea required placeholder="Юу буруу байгааг эсвэл юу сайжруулахыг тайлбарлаарай..." /></div>
            <button className="np-submitbtn" type="submit"><SendIcon size={15} /> Илгээх</button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------- App ---------------- */

export default function NextPathApp() {
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [originFilter, setOriginFilter] = useState(null);
  const [queryFilter, setQueryFilter] = useState("");
  const [addTab, setAddTab] = useState("add");

  const openDetail = (opp) => { setSelected(opp); setView("detail"); window.scrollTo?.(0, 0); };
  const goView = (v) => { setView(v); if (v !== "browse") { setCategoryFilter(null); setOriginFilter(null); setQueryFilter(""); } window.scrollTo?.(0, 0); };
  const openAdd = (tab) => { setAddTab(tab || "add"); };

  return (
    <div className="np-root">
      <GlobalStyles />
      <Nav view={view} setView={goView} openAdd={openAdd} />
      <main>
        {view === "home" && <Home setView={goView} openDetail={openDetail} setCategoryFilter={setCategoryFilter} setOriginFilter={setOriginFilter} setQueryFilter={setQueryFilter} />}
        {view === "browse" && <Browse openDetail={openDetail} initialCategory={categoryFilter} initialOrigin={originFilter} initialQuery={queryFilter} />}
        {view === "detail" && <Detail opp={selected} back={() => goView("browse")} />}
        {view === "about" && <About />}
        {view === "add" && <AddOpportunity initialTab={addTab} back={() => goView("home")} />}
      </main>
      <footer className="np-footer">
        <BackgroundWorld items={SPARSE.footer} />
        <div>
          <div className="np-logo np-display"><Compass size={17} /> NEXTPATH</div>
          <div className="desc">МОНГОЛ СУРАГЧДАД ЗОРИУЛСАН БОЛОМЖИЙН ГАЗРЫН ЗУРАГ</div>
        </div>
        <div className="np-footer-links">
          <button onClick={() => goView("home")}>Нүүр</button>
          <button onClick={() => goView("browse")}>Боломжууд</button>
          <button onClick={() => goView("about")}>Бидний тухай</button>
          <button onClick={() => { openAdd("add"); goView("add"); }}>Боломж нэмэх</button>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================================
   NOTE FOR NAMUUN — V10, final refinement pass

   LAYOUT / STRUCTURE / COLOR — UNCHANGED, AS REQUESTED
   Same nav, same hero copy and composition, same palette, same Opportunities
   filtering, same card alignment/sizing system, same Where to Start section
   (kept, not removed) — this pass only adds and polishes.

   "ХААНААС ЭХЛЭХ ВЭ?" — BROADENED
   Now two tiers: 5 broad interest areas (STEM, Нийгэм/хүмүүнлэг, Бизнес/
   эдийн засаг, Урлаг/бүтээлч, Эрүүл мэнд) as discovery shortcuts without
   invented counts, then a divider, then the original Монголд / Олон улсад /
   Ойртож буй хугацаа tiles with their real counts. Interest tiles route into
   Browse via a text search rather than a fake category filter, since the
   current catalog is still mostly STEM — clicking one that returns few or no
   results shows the existing honest empty state rather than fabricated
   matches. Populating non-STEM opportunities in Airtable will make these
   shortcuts genuinely productive.

   CARDS — STICKER NOW OVERLAPS THE CARD
   Kept the illustrated per-type stickers from the last pass, but moved each
   one to overlap the top-left edge of the card (mirroring the NEW ribbon on
   the top-right) so it reads as a sticker placed on an object rather than an
   inline icon. Card height, clamping, and the labeled БҮРТГЭЛ ДУУСАХ deadline
   line are unchanged.

   DATES — DISTINCT WHERE THE DATA EXISTS
   Detail pages now show ХӨТӨЛБӨР ЭХЛЭХ / ХӨТӨЛБӨР ДУУСАХ alongside БҮРТГЭЛ
   ДУУСАХ, but only for the two sample opportunities that have that data
   (a lab program with a start date, a summer program with both). No dates
   are invented for the rest.

   DETAIL PAGE — NEW QUESTION SET
   Юу хийх вэ? → Хэр өрсөлдөөнтэй вэ? (only when known) → Юу хэрэгтэй вэ? →
   Хэнд илүү тохирох вэ? → Хэдий хэмжээний цаг зарцуулах вэ? → Юу олж авах вэ?
   Verification, similar opportunities, and the official-site button are
   unchanged.

   ABOUT — REWRITTEN
   First person, no anecdote, built around the "map for ambitious Mongolian
   students" idea and why opportunities matter beyond university admissions,
   per your brief.

   ADD AN OPPORTUNITY — NOW A REAL PAGE
   Two tabs (Боломж нэмэх / Сайжруулах санал) with the fields you listed.
   Submission shows a confirmation state locally — there's no backend in
   this sandbox, so wiring it to actually write into Airtable is a Claude
   Code task, same as the rest of the data layer.

   BACKGROUND
   The same STEM motif set (plus a new open-book mark) now appears sparsely
   — one or two per section — behind the homepage sections, Browse/Detail/
   About headers, and the footer, instead of only in the hero.

   Still a single-file interactive prototype — no package installs or
   deploys available in this sandbox. This is the last planned major design
   pass; further changes from here should be small corrections rather than
   another redesign.
   ============================================================================ */
