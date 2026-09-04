import "./globals.css";

export const metadata = {
  title: "NextPath — Монгол сурагчдад зориулсан боломжийн платформ",
  description:
    "Судалгаа, тэтгэлэг, уралдаан, дадлага, хөтөлбөр болон бусад боломжуудыг нэг дороос хайж олоорой.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
