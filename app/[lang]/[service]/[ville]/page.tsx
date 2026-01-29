export default function Page({ params }: { params?: any }) {
  return (
    <div style={{ padding: 20, fontSize: 20 }}>
      Lang: {params?.lang ?? "undefined"}, 
      Service: {params?.service ?? "undefined"}, 
      Ville: {params?.ville ?? "undefined"}
    </div>
  );
}