# Supabase setup — org **PDF**, project **alaniukas**

## 1. Atidaryk teisingą projektą

1. [supabase.com/dashboard/organizations](https://supabase.com/dashboard/organizations)
2. Pasirink organizaciją **PDF** (ne „Alaniukas's Org“)
3. Atidaryk projektą **alaniukas**
4. Nukopijuok **Project ref** iš URL: `https://supabase.com/dashboard/project/XXXXXXXX`

## 2. Paleisk schemą (vieną kartą)

1. Projektas **alaniukas** → **SQL Editor** → New query
2. Nukopijuok visą `supabase/migrations/001_initial_schema.sql` turinį
3. Spausk **Run**

Turi atsirasti lentelės: `orders`, `form_responses`, `uploads` ir bucket `intake-uploads`.

## 3. API raktai → `.env.local`

Projektas **alaniukas** → **Settings** → **API**:

| Kintamasis | Kur |
|------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (secret) |

**Visi trys raktai turi būti iš to paties projekto (alaniukas).**

## 4. Patikrink

```text
http://localhost:3456/api/health
```

Turėtų grąžinti `"ok": true`.

## Cursor MCP (jei nori, kad agentas matytų PDF org)

Jei MCP rodo tik „Alaniukas's Org“:

1. Cursor → Settings → MCP → **user-supabase**
2. Atsijunk / prisijunk iš naujo su paskyra, kuri turi prieigą prie org **PDF**
3. Po to `list_organizations` turėtų rodyti ir **PDF**

## Vercel

Tuos pačius Supabase kintamuosius įdėk į Vercel → Project → Settings → Environment Variables.
