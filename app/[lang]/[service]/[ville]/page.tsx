export default function Page({ params }: { params: any }) {
  return (
    <div>
      Lang: {params?.lang}, Service: {params?.service}, Ville: {params?.ville}
    </div>
  );
}