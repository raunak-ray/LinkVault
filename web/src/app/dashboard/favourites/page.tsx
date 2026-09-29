import type { Metadata } from "next";
import LinksView from "../links/components/LinksView";

export const metadata: Metadata = { title: "Favourites" };

export default function FavouritePage() {
  return (
    <main className="max-w-md md:max-w-2xl lg:max-w-5xl mx-auto">
      <section>
        <LinksView showOnlyFavourite={true} showAddButton={false} />
      </section>
    </main>
  );
}
