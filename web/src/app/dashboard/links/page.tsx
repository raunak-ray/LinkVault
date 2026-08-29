import LinksView from "./components/LinksView";
import useGetAllLinks from "./hooks/useGetAllLinks";

export default function LinkPage() {
  // const {data} = useGetAllLinks();
  return (
    <main>
      <section>
        <LinksView />
      </section>
    </main>
  );
}
