interface Props {
  params: Promise<{ id: string }>;
}

export default async function EnviarPropostaPage({ params }: Props) {
  const { id } = await params;
  return (
    <main>
      <h1>Enviar Proposta — Solicitação #{id}</h1>
    </main>
  );
}
