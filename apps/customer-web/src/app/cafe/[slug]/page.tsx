export default async function CafePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main style={{ padding: 32 }}>
      <h1>{slug}</h1>
      <p>Cafe storefront placeholder.</p>
    </main>
  );
}
