# Deploy checklist

## 1. Supabase (org PDF → project alaniukas)

1. Atidaryk [Supabase organizations](https://supabase.com/dashboard/organizations) → **PDF** → **alaniukas**
2. Jei dar nepadaryta — paleisk SQL iš `supabase/migrations/001_initial_schema.sql` (žr. [supabase/SETUP.md](supabase/SETUP.md))
3. Settings → API → nukopijuok **anon** ir **service_role** raktus
4. Įdėk į `.env.local` ir Vercel env

## 2. Vercel deploy

GitHub → [vercel.com](https://vercel.com) → Import Project.

Arba lokaliai:

```bash
npm run build
npx vercel
```

### Env variables Vercel'e

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_... |
| `STRIPE_SECRET_KEY` | sk_test_... |
| `STRIPE_WEBHOOK_SECRET` | whsec_... (žingsnis 3) |
| `NEXT_PUBLIC_SUPABASE_URL` | iš alaniukas projekto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `NEXT_PUBLIC_APP_URL` | https://tavo-domenas.vercel.app |
| `RESEND_API_KEY` | (nebūtina, admin laiškams) |
| `ADMIN_NOTIFICATION_EMAIL` | tavo el. paštas |

## 3. Stripe webhook (production)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://tavo-domenas.vercel.app/api/webhook`
3. Event: `checkout.session.completed`
4. Nukopijuok signing secret → `STRIPE_WEBHOOK_SECRET` Vercel'e

### Local test

```bash
stripe listen --forward-to localhost:3456/api/webhook
```

## 4. End-to-end test

1. `https://tavo-domenas.vercel.app/api/health` → `"ok": true`
2. Landing → `/anketa` → užpildyk formą
3. Stripe test: `4242 4242 4242 4242`
4. `/aciu` puslapis
5. Supabase → `orders` → `status: paid`
