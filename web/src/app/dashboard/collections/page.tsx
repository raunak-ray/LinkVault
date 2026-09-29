import type { Metadata } from "next";
import CollectionView from "./components/CollectionView";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <main>
      <section>
        <CollectionView />
      </section>
    </main>
  );
}
