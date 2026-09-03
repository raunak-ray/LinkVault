import LinkDetailView from "./components/LinkDetailView";

export default async function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LinkDetailView id={id} />;
}
