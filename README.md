# DI darbo gidas — MVP

Lietuviškas landing page su Stripe Checkout ir intake forma. Duomenys saugomi Supabase projekte **alaniukas** (organizacija **PDF**).

## Greitas startas

1. Užbaik [Supabase setup](supabase/SETUP.md) (schema + API raktai)
2. Dukart spustelėk **`dev.bat`** arba `npm run dev`
3. Atidaryk **http://localhost:3456**

Jei neveikia — `npm run stop`, tada vėl `npm run dev`.

## Env kintamieji

Nukopijuok `.env.example` → `.env.local` ir užpildyk:

| Kintamasis | Kur gauti |
|------------|-----------|
| `STRIPE_*` | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook arba CLI: `stripe listen --forward-to localhost:3456/api/webhook` |
| `SUPABASE_*` | Supabase → org **PDF** → project **alaniukas** → Settings → API |

## Supabase

- **Organizacija:** PDF
- **Projektas:** alaniukas
- **Lentelės:** `orders`, `form_responses`, `uploads`
- **Storage:** `intake-uploads` (private)

Užsakymus peržiūrėk: Table Editor → `orders`

## Vercel deploy

Žr. [DEPLOY.md](DEPLOY.md).

## Stripe test kortelė

`4242 4242 4242 4242` — bet koks CVV, bet kokia ateities data.

## PDF pavyzdys

Landing'e yra vizualinis PDF preview (modal). Tikrą PDF failą galima vėliau įdėti į `public/sample-guide.pdf`.
