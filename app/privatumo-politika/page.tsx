import { COMPANY } from "@/lib/company";
import { LegalCompanyBlock, LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata = {
  title: "Privatumo politika | DI darbo gidas",
};

export default function PrivatumoPolitikaPage() {
  return (
    <LegalPageShell title="Privatumo politika">
      <section>
        <h2 className="font-serif text-xl text-ink">1. Bendrosios nuostatos</h2>
        <p className="mt-2">
          Ši privatumo politika paaiškina, kaip {COMPANY.name} (toliau — „Mes“, „Duomenų
          valdytojas“) tvarko Jūsų asmens duomenis, kai naudojatės svetaine{" "}
          <strong className="text-ink">{COMPANY.productName}</strong>, užpildote anketą, apmokate
          paslaugą ir gaunate asmeninį PDF gidą. Mes laikomės Bendrojo duomenų apsaugos reglamento
          (BDAR) ir Lietuvos Respublikos teisės aktų.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">2. Duomenų valdytojas</h2>
        <LegalCompanyBlock />
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">3. Kokius duomenis renkame</h2>
        <p className="mt-2">Paslaugai teikti Mes galime tvarkyti šias duomenų kategorijas:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Identifikaciniai ir kontaktiniai duomenys:</strong> vardas,
            el. pašto adresas.
          </li>
          <li>
            <strong className="text-ink">Anketos atsakymai:</strong> amžiaus grupė, miestas, darbo
            pobūdis, pareigos, naudojamos programos, darbo aprašymai, pageidavimai dėl DI
            taikymo, baimės ir lūkesčiai.
          </li>
          <li>
            <strong className="text-ink">Nuotraukos ir komentarai:</strong> Jūsų savanoriškai
            įkeliamos ekrano kopijos su Jūsų pridėtais paaiškinimais.
          </li>
          <li>
            <strong className="text-ink">Užsakymo ir mokėjimo duomenys:</strong> pasirinktas paketas,
            užsakymo data, mokėjimo būsena. Mokėjimo kortelės duomenis tvarko Stripe — Mes
            nerenkame ir nesaugome pilno kortelės numerio, CVC ar PIN.
          </li>
          <li>
            <strong className="text-ink">Techniniai duomenys:</strong> IP adresas, naršyklės tipas,
            sesijos identifikatoriai, klaidų ir veikimo žurnalai (tik tiek, kiek reikia svetainės
            stabilumui ir saugumui).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">4. Duomenų tvarkymo tikslai ir teisiniai pagrindai</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Paslaugos sutarties vykdymas</strong> — paruošti ir
            pristatyti asmeninį PDF gidą, susisiekti dėl užsakymo (BDAR 6 str. 1 b).
          </li>
          <li>
            <strong className="text-ink">Teisinė prievolė</strong> — apskaita, mokesčių ir
            reglamentuojančių reikalavimų laikymasis (BDAR 6 str. 1 c).
          </li>
          <li>
            <strong className="text-ink">Teisėtas interesas</strong> — svetainės saugumas, sukčiavimo
            prevencija, paslaugos kokybės gerinimas (BDAR 6 str. 1 f).
          </li>
          <li>
            <strong className="text-ink">Sutikimas</strong> — kai pateikiate papildomą informaciją
            ar nuotraukas, nors tai nėra privaloma anketos dalis (BDAR 6 str. 1 a).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">5. Duomenų saugojimo terminai</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>Užsakymo ir anketos duomenys — iki 3 metų nuo paslaugos suteikimo (apskaitos ir ginčų terminai).</li>
          <li>Įkeltos nuotraukos — iki 12 mėnesių po PDF pristatymo, nebent anksčiau prašote ištrinti.</li>
          <li>Mokėjimo įrašai — pagal Stripe ir apskaitos reikalavimus.</li>
          <li>Techniniai žurnalai — iki 90 dienų.</li>
        </ul>
        <p className="mt-3">
          Pasibaigus terminui duomenys ištrinami arba anonimizuojami, jei nėra teisinio pagrindo
          saugoti ilgiau.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">6. Kam perduodame duomenis</h2>
        <p className="mt-2">
          Duomenis perduodame tik patikimiems tvarkytojams, reikalingiems paslaugai vykdyti:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Stripe</strong> — mokėjimų apdorojimas (JAV/EU, taikomos
            Standartinės sutarčių sąlygos).
          </li>
          <li>
            <strong className="text-ink">Supabase</strong> — duomenų bazė ir failų saugykla (ES
            regionas, eu-central-1).
          </li>
          <li>
            <strong className="text-ink">El. pašto paslaugų teikėjas</strong> — PDF ir pranešimų
            siuntimas Jūsų nurodytu adresu.
          </li>
        </ul>
        <p className="mt-3">
          Mes neparduodame Jūsų duomenų, nenaudojame jų reklamai ir neperduodame rinkodaros
          partneriams.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">7. Duomenų saugumas</h2>
        <p className="mt-2">
          Taikome organizacines ir technines priemones: šifruotus ryšius (HTTPS), prieigos
          kontrolę, atskirą saugyklą nuotraukoms, reguliarų prieigų peržiūrėjimą. Vis dėlto
          nė vienas perdavimo internetu būdas nėra 100 % saugus — prašome neįkelti slaptažodžių,
          asmens kodų ar itin jautrios informacijos ekrano kopijose.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">8. Jūsų teisės</h2>
        <p className="mt-2">Pagal BDAR Jūs turite teisę:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Gauti informaciją apie tvarkomus duomenis ir jų kopiją</li>
          <li>Reikalauti ištaisyti netikslius duomenis</li>
          <li>Reikalauti ištrinti duomenis („būti pamirštam“), kai taikoma</li>
          <li>Apriboti tvarkymą ar nesutikti su tvarkymu teisėto intereso pagrindu</li>
          <li>Gauti duomenis struktūruota forma (perkeliamumas)</li>
          <li>Pateikti skundą Valstybinei duomenų apsaugos inspekcijai (VDAI)</li>
        </ul>
        <p className="mt-3">
          Prašymams ir klausimams:{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-sage hover:underline">
            {COMPANY.email}
          </a>
          . Atsakome per 30 kalendorinių dienų.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">9. Slapukai ir stebėjimas</h2>
        <p className="mt-2">
          Naudojame būtinus techninius slapukus svetainės veikimui (sesija, saugumas, sutikimo
          pasirinkimo įsiminimas). Jūsų sutikimu taip pat naudojame:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-ink">Meta (Facebook) Pixel</strong> — lankymo, puslapių
            peržiūrų, mygtukų paspaudimų, laiko svetainėje, slinkimo gylio ir konversijų (anketa,
            apmokėjimas) stebėjimui bei Meta reklamų efektyvumui matuoti.
          </li>
          <li>
            <strong className="text-ink">Stripe</strong> — mokėjimo metu gali naudoti savo
            slapukus saugiam apmokėjimui.
          </li>
        </ul>
        <p className="mt-3">
          Analitikos slapukai įkeliami tik pasirinkus „Sutinku su visais“ slapukų juostoje. Galite
          bet kada atsisakyti — ištrinkite naršyklės slapukus arba susisiekite{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-sage hover:underline">
            {COMPANY.email}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">10. Politikos pakeitimai</h2>
        <p className="mt-2">
          Politiką galime atnaujinti. Esminiai pakeitimai bus paskelbti šiame puslapyje. Toliau
          naudodamiesi paslauga po pakeitimų, Jūs sutinkate su atnaujinta politika, jei
          taikytina pagal teisę.
        </p>
      </section>
    </LegalPageShell>
  );
}
