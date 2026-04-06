interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <div>
      <h1>Boa, {name}!</h1>
      <p>
        Bem-vindo ao Prumo. Agora é só preencher o seu perfil e começar a receber clientes.
      </p>
      <p>Sua obra no prumo.</p>
    </div>
  );
}
