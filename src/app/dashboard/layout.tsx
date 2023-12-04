import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News Summariser | Dashboard",
  description: "View generated news headline rhymes and summaries",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
