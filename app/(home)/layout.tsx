import Header from "@/components/home/header";
import Menu from "@/components/home/menu";
import ThemeToggle from "@/components/home/theme-toggle";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ThemeToggle />

      <div className="absolute top-0 left-0 w-full">
        <Header />
      </div>

      <div className="flex min-h-screen items-center justify-center font-mono">
        {children}
      </div>

      <Menu />
    </div>
  );
}
