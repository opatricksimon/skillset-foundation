# TEST RESULTS — pagamento marketplace

> Sessão autônoma 2026-05-19. Validação determinística do split financeiro.
> Script: `node scripts/stripe-test-e2e.mjs`

## 1. MATH mode — VERIFICADO ✅ (rodado nesta sessão)

Espelha as fórmulas exatas de `functions/src/index.ts`:

```
scenario               |     gross | platform15% |  stripeFee |   teacherNet |  platformNet
--------------------------------------------------------------------------------------------
$10 course (USD)       |    $10.00 |       $1.50 |      $0.59 |        $7.91 |        $1.50
$50 course (USD)       |    $50.00 |       $7.50 |      $1.75 |       $40.75 |        $7.50
$100 course (USD)      |   $100.00 |      $15.00 |      $3.20 |       $81.80 |       $15.00
$200 course (USD)      |   $200.00 |      $30.00 |      $6.10 |      $163.90 |       $30.00
$100 course (intl)     |   $100.00 |      $15.00 |      $4.20 |       $80.80 |       $15.00
```

**Confirmado:**
- Professor absorve a taxa Stripe; `teacherNet = gross − 15% − stripeFee`.
- Plataforma mantém os 15% cheios (`platformNet` = comissão integral).
- USD = 2.9%+$0.30; internacional = 3.9%+$0.30.
- Caso $100 USD: aluno paga $100 → professor recebe **$81.80** após D+7 → plataforma **$15.00**.

## 2. Caso feliz manual (a fazer quando tiver chave TEST — BLOCKERS B1)

Pré-requisitos: `STRIPE_SECRET_KEY=sk_test_...` como secret do Firebase, professor com Stripe Connect (test) concluído, 1 curso publicado a $100.

Passos:
1. `STRIPE_SECRET_KEY=sk_test_xxx node scripts/stripe-test-e2e.mjs` → cria Checkout Session TEST real, imprime URL.
2. Abrir URL, pagar com `4242 4242 4242 4242`, validade futura, CVC qualquer.
3. Stripe webhook dispara `checkout.session.completed` → `stripeWebhook`.

**Output esperado no Firestore:**
| Coleção | Doc | Campos-chave esperados |
|---|---|---|
| `orders` | o id do pedido | `status: "paid"`, `paymentIntentId` preenchido, `payoutModel: "separate_charges_and_transfers"` |
| `payments` | paymentIntentId | `status: "succeeded"`, `amountMinor: 10000` |
| `payoutLedger` | auto id | `grossAmountMinor: 10000`, `skillsetFeeMinor: 1500`, `stripeFeeMinor: 320`, `netAmountMinor: 8180`, `status: "in_release"`, `releaseAt ≈ now + 7d` |
| `enrollments` | `{uid}__{courseId}` | `status: "active"` |

**Output esperado no Stripe Dashboard (test):**
- Payments: 1 pagamento de $100 capturado.
- Após `releaseAt` (7 dias) e job de release: 1 Transfer de **$81.80** para a conta conectada do professor.
- Webhook deliveries: `checkout.session.completed` com resposta **200**.

## 3. Bloqueio
LIVE-TEST mode não rodou nesta sessão: sem `sk_test_` no ambiente (esperado — ver BLOCKERS.md **B1**). Código e script prontos; falta só a chave.
