interface EvaluationInviteEmailProps {
  contractorName: string;
  professionalName: string;
  evaluationUrl: string;
}

export function EvaluationInviteEmail({
  contractorName,
  professionalName,
  evaluationUrl,
}: EvaluationInviteEmailProps) {
  return (
    <div>
      <h1>Olá, {contractorName}!</h1>
      <p>
        Como foi trabalhar com {professionalName}? Sua avaliação ajuda outros contratantes
        a encontrar bons profissionais.
      </p>
      <a href={evaluationUrl}>Avaliar agora</a>
    </div>
  );
}
