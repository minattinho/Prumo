import MercadoPagoConfig from "mercadopago";

let _mp: MercadoPagoConfig | null = null;

export function getMercadoPago(): MercadoPagoConfig {
  if (!_mp) {
    if (!process.env.MP_ACCESS_TOKEN) {
      throw new Error("MP_ACCESS_TOKEN is not set");
    }
    _mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
  }
  return _mp;
}
