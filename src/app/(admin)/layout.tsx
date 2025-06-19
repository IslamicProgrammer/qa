import "@/styles/globals.css";

import Layout from "@/components/layout/layout";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Layout>{children}</Layout>;
}
