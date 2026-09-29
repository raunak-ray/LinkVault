import type { Metadata } from "next";
import LinksView from "./components/LinksView";

export const metadata: Metadata = { title: "All Links" };

export default function LinkPage() {
  // const {data} = useGetAllLinks();
  return (
    <main className="max-w-md md:max-w-2xl lg:max-w-5xl mx-auto">
      <section>
        <LinksView />
      </section>
    </main>
  );
}
