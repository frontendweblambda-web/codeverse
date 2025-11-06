import Footer from "@/src/components/layout/footer";
import Header from "@/src/components/layout/header";
import Screen from "@/src/components/ui/screen";
import { ReactNode } from "react";

/**
 * Auth layout
 * @param param0
 * @returns
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Screen className="flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </Screen>
  );
}
