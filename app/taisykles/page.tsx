import { COMPANY } from "@/lib/company";
import { LegalCompanyBlock, LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata = {
  title: "Paslaugos taisyklės | DI darbo gidas",
};

export default function TaisyklesPage() {
  return (
    <LegalPageShell title="Paslaugos taisyklės ir vidaus tvarka">
      <section>
        <h2 className="font-serif text-xl text-ink">1. Bendrosios nuostatos</h2>
        <p className="mt-2">
          Šios taisyklės reglamentuoja naudojimąsi {COMPANY.name} teikiama skaitmenine paslauga{" "}
          <strong className="text-ink">„{COMPANY.productName}“</strong> (toliau — Paslauga).
          Užpildydami anketą ir apmokėdami, Jūs patvirtinate, kad susipažinote su šiomis
          taisyklėmis ir sutinkate jų laikytis.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">2. Paslaugos teikėjas</h2>
        <LegalCompanyBlock />
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">3. Paslaugos aprašymas</h2>
        <p className="mt-2">
          Paslauga apima: (a) internetinę anketą apie Jūsų darbo situaciją; (b) saugų mokėjimą
          per Stripe; (c) individualiai paruoštą PDF gidą su DI taikymo rekomendacijomis, žingsniais,
          programų naudojimu ir — pasirinktinai — ekrano paaiškinimais. Premium pakete gali būti
          ir trumpas video skambutis pagalbai įdiegti.
        </p>
        <p className="mt-3">
          PDF turinys priklauso nuo Jūsų pateiktos informacijos. Tai nėra teisinė, buhalterinė ar
          IT konsultacija — praktinis gidas kasdieniam darbui.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">4. Užsakymo eiga</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5">
          <li>Pasirenkate paketą ir užpildote anketą (tikslūs, išsamūs atsakymai).</li>
          <li>Peržiūrite santrauką ir apmokate per Stripe — vienkartinis mokestis, be prenumeratos.</li>
          <li>Gavę apmokėjimo patvirtinimą, pradedame PDF rengimą.</li>
          <li>PDF siunčiame Jūsų nurodytu el. paštu per 24 valandas (darbo dienomis; vėlavimas gali kilti dėl force majeure).</li>
        </ol>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">5. Kainos ir apmokėjimas</h2>
        <p className="mt-2">
          Kainos nurodytos svetainėje eurais (€), su PVM, jei taikoma pagal Lietuvos
          reglamentus. Galutinė suma rodoma prieš apmokėjimą Stripe lange. Mes nekaupiame
          Jūsų kortelės duomenų — juos tvarko Stripe.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">6. Atšaukimas ir grąžinimai</h2>
        <p className="mt-2">
          Kadangi Paslauga yra skaitmeninis, individualiai kuriamas turinys, po apmokėjimo ir
          darbo pradžios standartinis grąžinimas netaikomas (BDAR 16 ir vartotojų teisių
          direktyvos išlygos skaitmeniniam turiniui).
        </p>
        <p className="mt-3">
          Jei PDF nebuvo pristatytas per sutartą terminą dėl mūsų kaltės, grąžiname sumą arba
          pristatome gidą be papildomo mokesčio — susisiekite{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-sage hover:underline">
            {COMPANY.email}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">7. Vartotojo pareigos</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>Pateikti tikslią ir teisingą informaciją anketoje.</li>
          <li>Neįkelti ekrano kopijų su slaptažodžiais, asmens kodais, medicinine ar kita itin jautria informacija.</li>
          <li>Laikytis darbdavio ir galiojančių teisės aktų dėl konfidencialios informacijos ir DI naudojimo.</li>
          <li>Naudoti gautą PDF tik asmeniniams darbo tikslams, neplatinti tretiesiems asmenims.</li>
          <li>Nepiktnaudžiauti paslauga (automatiniai botai, netikri užsakymai, bandymai pažeisti sistemą).</li>
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">8. Intelektinė nuosavybė</h2>
        <p className="mt-2">
          Svetainės dizainas, tekstai, struktūra ir paruošto PDF turinio autorinės teisės priklauso{" "}
          {COMPANY.name} arba teisėtiems savininkams. Jums suteikiama ribota, neperleidžiama licencija
          naudoti PDF savo darbe. Draudžiama kopijuoti, platinti, parduoti ar viešai skelbti be
          rašytinio sutikimo.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">9. Atsakomybės ribojimas</h2>
        <p className="mt-2">
          Paslauga teikiama „kaip yra“. Mes dedame pastangas, kad gidas būtų naudingas ir tikslus
          pagal Jūsų duomenis, tačiau negarantuojame konkretaus verslo rezultato, pelno ar
          darbdavio patvirtinimo. Jūs esate atsakingi už sprendimus, priimtus naudojant DI, ir
          už duomenų saugumą savo darbo aplinkoje.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">10. Vidaus tvarka ir komunikacija</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>Visi oficialūs pranešimai dėl užsakymo siunčiami el. paštu, kurį nurodote anketoje.</li>
          <li>Atsakome į užklausas per 2–5 darbo dienas.</li>
          <li>Premium paketo video skambutis derinamas el. paštu per 5 darbo dienas po PDF pristatymo.</li>
          <li>Ne toleruojame įžeidžiančios, grasinančios ar diskriminuojančios komunikacijos — pasiliekame teisę atsisakyti paslaugos.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">11. Ginčai</h2>
        <p className="mt-2">
          Ginčus siekiame spręsti taikiai — rašykite{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-sage hover:underline">
            {COMPANY.email}
          </a>
          . Nepavykus susitarti per 30 dienų, ginčai sprendžiami Lietuvos Respublikos teismuose
          pagal {COMPANY.name} registracijos vietos teismų kompetenciją ir Lietuvos materialinę
          teisę.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">12. Taisyklių pakeitimai</h2>
        <p className="mt-2">
          Taisykles galime keisti. Nauja redakcija skelbiama svetainėje. Esami užsakymai vertinami
          pagal taisykles, galiojančias užsakymo metu, nebent pakeitimai būtų Jums palankesni.
        </p>
      </section>
    </LegalPageShell>
  );
}
