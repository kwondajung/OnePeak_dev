import Header from "@/components/header/Header";
import "../globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MobileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="w-full min-w-[320px] max-w-[600px] mx-auto my-0  min-h-full">
        <Header />
        {children}
      </div>
    </div>
  );
}
