export const defaultSkillsetCurrency = "USD";

export const topSkillsetCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "BRL",
  "MXN",
  "NGN",
  "ZAR",
  "GYD",
] as const;

export const supportedStripeCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "BRL",
  "MXN",
  "NGN",
  "ZAR",
  "GYD",
  "ARS",
  "BBD",
  "BMD",
  "CLP",
  "COP",
  "CRC",
  "DOP",
  "GHS",
  "GTQ",
  "HKD",
  "INR",
  "JMD",
  "JPY",
  "KES",
  "NZD",
  "PEN",
  "SGD",
  "TTD",
  "UYU",
  "XCD",
] as const;

const supportedCurrencySet = new Set<string>(supportedStripeCurrencies);

export function isSupportedStripeCurrency(currency: string): boolean {
  return supportedCurrencySet.has(currency.toUpperCase());
}

export function normalizeSkillsetCurrency(currency?: string | null): string {
  const normalizedCurrency = currency?.trim().toUpperCase() || defaultSkillsetCurrency;

  return isSupportedStripeCurrency(normalizedCurrency)
    ? normalizedCurrency
    : defaultSkillsetCurrency;
}

export function getCurrencyLabel(currency: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "currency" }).of(currency) ?? currency;
  } catch {
    return currency;
  }
}
