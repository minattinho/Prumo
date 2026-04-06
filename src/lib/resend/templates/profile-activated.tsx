interface ProfileActivatedEmailProps {
  name: string;
  profileUrl: string;
}

export function ProfileActivatedEmail({ name, profileUrl }: ProfileActivatedEmailProps) {
  return (
    <div>
      <h1>Pronto, {name}! Seu perfil está no ar.</h1>
      <p>
        Seu cadastro foi verificado e aprovado. A partir de agora, clientes podem encontrar
        você no Prumo e entrar em contato.
      </p>
      <a href={profileUrl}>Ver meu perfil</a>
    </div>
  );
}
