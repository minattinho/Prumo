// Tipos de domínio do Prumo

export type UserRole = "contractor" | "professional";

export type ProfessionalStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "BANNED";

export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "CANCELLED"
  | "SUSPENDED";

export type ContactChannelType =
  | "WHATSAPP"
  | "PHONE"
  | "EMAIL"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "SITE"
  | "OTHER";

export type SocialNetwork =
  | "INSTAGRAM"
  | "FACEBOOK"
  | "TIKTOK"
  | "LINKEDIN"
  | "YOUTUBE";

export type BudgetRequestStatus =
  | "NEW"
  | "REPLIED"
  | "IN_NEGOTIATION"
  | "REFUSED";

export type MediaModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ServiceOrigin = "PRUMO" | "REFERRAL" | "OTHER";

export type ServiceStatus = "IN_PROGRESS" | "COMPLETED";

export type BadgeType = "VERIFIED" | "TRUSTWORTHY" | "CERTIFIED";

export type ContactLogType =
  | "VIEWED_WHATSAPP"
  | "VIEWED_PHONE"
  | "VIEWED_EMAIL";

export type VerificationStatus = "APPROVED" | "REJECTED";

// Categorias de serviço
export const SERVICE_CATEGORIES = [
  { value: "construcao", label: "Construção" },
  { value: "eletrica", label: "Elétrica" },
  { value: "hidraulica", label: "Hidráulica" },
  { value: "acabamento", label: "Acabamento" },
  { value: "pisos", label: "Pisos" },
  { value: "serralheria", label: "Serralheria" },
  { value: "marcenaria", label: "Marcenaria" },
  { value: "jardinagem", label: "Jardinagem" },
  { value: "limpeza", label: "Limpeza" },
  { value: "projeto", label: "Projeto" },
  { value: "engenharia", label: "Engenharia" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "climatizacao", label: "Climatização" },
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]["value"];
