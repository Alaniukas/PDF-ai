import Image from "next/image";

export function AboutUs() {
  return (
    <section id="apie-mus" className="section-space border-y border-cream-dark bg-white">
      <div className="layout-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-3 rounded-3xl bg-sage-light/30 blur-xl" />
          <div className="relative overflow-hidden rounded-2xl border border-cream-dark shadow-md">
            <Image
              src="/images/about-us.png"
              alt="Moteris biure prie darbo stalo"
              width={600}
              height={500}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="section-number mb-4 text-sm font-medium uppercase tracking-widest text-sage">
            Kodėl tai sukūrėme
          </p>
          <h2 className="font-serif text-3xl text-ink md:text-4xl">
            Nes matėme, kaip skaudžiai baigiasi, kai niekas neparodo kaip
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-ink-muted">
            <p>
              Mano mama daugelį metų dirbo biure — tvarkė dokumentus, ruošė ataskaitas,
              atsakinėjo į laiškus. Darbą atlikdavo kruopščiai. Bet kai įmonė pradėjo
              kalbėti apie „skaitmenizaciją“ ir DI, niekas jos neišmokė — nei kaip naudoti
              ChatGPT, nei nuo ko pradėti.
            </p>
            <p>
              Galiausiai ją atleido. Ne dėl to, kad blogai dirbo — o dėl to, kad{" "}
              <strong className="font-medium text-ink">
                niekas neparodė paprastų, konkrečių žingsnių
              </strong>
              , kaip pritaikyti DI savo kasdieniam darbui.
            </p>
            <p>
              Šį projektą sukūrėme tam, kad to nebereikėtų patirti kitiems: užpildote anketą,
              papasakojate apie savo darbą — ir per 24 valandas gaunate asmeninį PDF gidą
              su žingsniais, programų naudojimu ir ekrano paaiškinimais — Jūsų kalba,
              Jūsų programoms, Jūsų užduotims.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
