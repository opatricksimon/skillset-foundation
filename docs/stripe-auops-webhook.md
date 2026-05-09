# Stripe AUOPS Webhook

Environment: test
Stripe account email: auopscourses@gmail.com
Firebase project: skillsetusaofficial
Webhook URL: https://stripewebhook-7foyhb2owa-uc.a.run.app
Webhook endpoint ID: we_1TUr26LBNBLcXCLg49xLHyos
Enabled events:
- checkout.session.completed
- checkout.session.expired
- payment_intent.payment_failed
- charge.refunded

Secrets are stored in Firebase Secret Manager:
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Do not commit or paste secret values into source files.
