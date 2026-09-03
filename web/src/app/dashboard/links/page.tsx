import LinksView from "./components/LinksView";

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
