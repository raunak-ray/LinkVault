import CollectionDetailView from "../components/CollectionDetailView";

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CollectionDetailView id={id} />;
}
