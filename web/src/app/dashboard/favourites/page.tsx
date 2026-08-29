import LinksView from "../links/components/LinksView";

export default function FavouritePage() {
    return(
        <main>
            <section>
                <LinksView showOnlyFavourite={true} />
            </section>
        </main>
    )
}
