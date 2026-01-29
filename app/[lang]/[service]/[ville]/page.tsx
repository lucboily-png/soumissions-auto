export default function Page({ params }: { params: any }) {
  console.log(params); // temporaire pour voir ce que Next.js reçoit
  return (
    <div>
      Lang: {params.lang}, Service: {params.service}, Ville: {params.ville}
    </div>
  );
}
