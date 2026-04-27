-- Migration: Replace Stripe columns with Mercado Pago equivalents
-- Stripe was never used in production (all TODO stubs), so renaming is safe.

ALTER TABLE public.professional_profiles
  RENAME COLUMN stripe_customer_id TO mercadopago_customer_id;

ALTER TABLE public.professional_subscriptions
  RENAME COLUMN stripe_subscription_id TO mercadopago_subscription_id,
  RENAME COLUMN stripe_price_id TO mercadopago_plan_id;

ALTER TABLE public.payment_transactions
  RENAME COLUMN stripe_payment_id TO mercadopago_payment_id;

ALTER TABLE public.payment_transactions
  DROP COLUMN IF EXISTS stripe_invoice_id;
