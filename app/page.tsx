"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  Upload,
  Check,
  Car,
  Train,
  Phone,
  Bike,
  MapPin,
  HelpCircle,
  Heart,
  Camera,
  ChevronDown,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const navItems = [
  { label: "STARTSIDA", href: "#start" },
  { label: "O.S.A", href: "#osa" },
  { label: "TA DIG HIT", href: "#location" },
  { label: "FAQ", href: "#faq" },
  { label: "BILDER", href: "#photos" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-beige">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-beige/90 backdrop-blur-sm border-b border-green-dark/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-green-dark">
            <span className="text-sm md:text-base">15 AUGUSTI</span>
            <span className="mx-2">·</span>
            <span className="text-sm md:text-base">DALARÖ KYRKA</span>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="text-green-dark" />
            ) : (
              <Menu className="text-green-dark" />
            )}
          </button>
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-green-dark hover:text-green-light transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-beige border-t border-green-dark/10 px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-green-dark hover:text-green-light transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <HeroSection />
      <IntroSection />
      <OSASection />
      <LocationSection />
      <FAQSection />
      <PhotosSection />

      <footer className="bg-green-dark text-beige py-8 text-center">
        <p className="font-[family-name:var(--font-signature)] text-3xl mb-2">
          Vi ses där!
        </p>
        <Heart className="w-6 h-6 mx-auto text-pink-medium" />
      </footer>
    </main>
  );
}

function HeroSection() {
  return (
    <section
      id="start"
      className="min-h-screen w-full flex flex-col md:flex-row"
    >
      <div className="relative w-full md:w-1/2 h-[65vh] md:h-screen">
        <Image
          src="/half-hero-img.jpg"
          alt="Axel & Vendela"
          fill
          className="object-cover object-top md:object-center"
          priority
        />
      </div>
      <div className="w-full md:w-1/2 bg-pink-light flex flex-col items-center justify-center px-8 py-16 md:py-0">
        <h1 className="font-[family-name:var(--font-signature)] text-6xl md:text-8xl text-green-dark text-center mb-6">
          Axel & Vendela
        </h1>
        <p className="text-lg md:text-xl text-green-dark mb-1">
          Lördagen 15 augusti
        </p>
        <p className="text-lg md:text-xl text-green-dark mb-1">Klockan 14.30</p>
        <a
          href="#location"
          className="text-lg md:text-xl text-green-dark/70 mb-8 block"
        >
          Dalarö Kyrka, Haninge
        </a>
        <a
          href="#osa"
          className="bg-green-dark hover:bg-green-light text-white px-8 py-3 rounded-full transition-colors"
        >
          O.S.A
        </a>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="py-16 px-4 bg-beige">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg md:text-xl text-green-dark leading-relaxed">
          Vi är så glada att ni vill dela den här dagen med oss. Här hittar ni
          allt ni kan tänkas behöva veta inför bröllopet – tider, platser och
          lite praktiskt smått och gott. Vi ser verkligen fram emot att få fira
          tillsammans med er!
        </p>
      </div>
    </section>
  );
}

function OSASection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "",
    wantsSpeech: "",
    song: "",
    hasDietary: "",
    dietary: "",
    funFact: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isSupabaseConfigured() || !supabase) {
        console.log("RSVP data:", formData);
        alert("Supabase ej konfigurerat. Data loggas till konsolen.");
        setSubmitted(true);
        setLoading(false);
        return;
      }
      const { error } = await supabase.from("rsvp").insert([
        {
          name: formData.name,
          email: formData.email,
          attending: formData.attending,
          wants_speech: formData.wantsSpeech === "yes",
          song: formData.song,
          has_dietary: formData.hasDietary === "yes",
          dietary: formData.dietary,
          fun_fact: formData.funFact,
        },
      ]);
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Något gick fel. Försök igen.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <section id="osa" className="py-24 px-4 bg-pink-light/30">
        <div className="max-w-2xl mx-auto text-center">
          <Check className="w-16 h-16 text-green-light mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-signature)] text-5xl text-green-dark mb-4">
            Tack!
          </h2>
          <p className="text-lg text-green-dark">
            Vi har tagit emot ditt svar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="osa" className="py-24 px-4 bg-pink-light/30">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-[family-name:var(--font-signature)] text-5xl md:text-6xl text-green-dark text-center mb-12">
          O.S.A
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-green-dark mb-2">Namn *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-green-dark/20 bg-white/50 focus:outline-none focus:border-green-light"
            />
          </div>
          <div>
            <label className="block text-green-dark mb-2">E-post *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-green-dark/20 bg-white/50 focus:outline-none focus:border-green-light"
            />
          </div>
          <div>
            <label className="block text-green-dark mb-4 text-lg font-medium">
              Vill ni fira den här dagen med oss? *
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-green-dark/20 bg-white/50 hover:bg-white/70 transition-colors">
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, attending: e.target.value })
                  }
                  className="accent-green-light w-5 h-5"
                />
                <span className="text-green-dark">Jag kommer!</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-green-dark/20 bg-white/50 hover:bg-white/70 transition-colors">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  onChange={(e) =>
                    setFormData({ ...formData, attending: e.target.value })
                  }
                  className="accent-green-light w-5 h-5"
                />
                <span className="text-green-dark">
                  Jag kan tyvärr inte komma
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-green-dark/20 bg-white/50 hover:bg-white/70 transition-colors">
                <input
                  type="radio"
                  name="attending"
                  value="ceremony_only"
                  onChange={(e) =>
                    setFormData({ ...formData, attending: e.target.value })
                  }
                  className="accent-green-light w-5 h-5"
                />
                <span className="text-green-dark">
                  Jag kan bara komma på vigseln
                </span>
              </label>
            </div>
          </div>

          {formData.attending === "yes" && (
            <div className="space-y-6 pt-4 border-t border-green-dark/10">
              <div>
                <label className="block text-green-dark mb-4">
                  Jag vill hålla tal
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-green-dark/20 bg-white/50 hover:bg-white/70 transition-colors">
                    <input
                      type="radio"
                      name="wantsSpeech"
                      value="yes"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wantsSpeech: e.target.value,
                        })
                      }
                      className="accent-green-light w-5 h-5"
                    />
                    <span className="text-green-dark">Ja</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-green-dark/20 bg-white/50 hover:bg-white/70 transition-colors">
                    <input
                      type="radio"
                      name="wantsSpeech"
                      value="no"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wantsSpeech: e.target.value,
                        })
                      }
                      className="accent-green-light w-5 h-5"
                    />
                    <span className="text-green-dark">Nej</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-green-dark mb-2">Favoritlåt</label>
                <input
                  type="text"
                  value={formData.song}
                  onChange={(e) =>
                    setFormData({ ...formData, song: e.target.value })
                  }
                  placeholder="Artist - Låtnamn"
                  className="w-full px-4 py-3 rounded-lg border border-green-dark/20 bg-white/50 focus:outline-none focus:border-green-light"
                />
              </div>
              <div>
                <label className="block text-green-dark mb-4">
                  Har du specialkost?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-green-dark/20 bg-white/50 hover:bg-white/70 transition-colors">
                    <input
                      type="radio"
                      name="hasDietary"
                      value="yes"
                      onChange={(e) =>
                        setFormData({ ...formData, hasDietary: e.target.value })
                      }
                      className="accent-green-light w-5 h-5"
                    />
                    <span className="text-green-dark">Ja</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-green-dark/20 bg-white/50 hover:bg-white/70 transition-colors">
                    <input
                      type="radio"
                      name="hasDietary"
                      value="no"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasDietary: e.target.value,
                          dietary: "",
                        })
                      }
                      className="accent-green-light w-5 h-5"
                    />
                    <span className="text-green-dark">Nej</span>
                  </label>
                </div>
                {formData.hasDietary === "yes" && (
                  <input
                    type="text"
                    value={formData.dietary}
                    onChange={(e) =>
                      setFormData({ ...formData, dietary: e.target.value })
                    }
                    placeholder="T.ex. vegetarian, glutenfri, allergier..."
                    className="w-full mt-4 px-4 py-3 rounded-lg border border-green-dark/20 bg-white/50 focus:outline-none focus:border-green-light"
                  />
                )}
              </div>
              <div>
                <label className="block text-green-dark mb-2">
                  Fun fact om dig själv
                </label>
                <textarea
                  value={formData.funFact}
                  onChange={(e) =>
                    setFormData({ ...formData, funFact: e.target.value })
                  }
                  rows={3}
                  placeholder="Dela med dig av något roligt eller oväntat..."
                  className="w-full px-4 py-3 rounded-lg border border-green-dark/20 bg-white/50 focus:outline-none focus:border-green-light resize-none"
                />
              </div>
            </div>
          )}

          {formData.attending === "no" && (
            <div className="p-4 rounded-lg bg-pink-light/50 border border-pink-medium/30">
              <p className="text-green-dark">
                Så tråkigt att du inte kan komma. Om du ändå vill bidra till
                dagen på något sätt är du varmt välkommen att höra av dig till
                vårt toastpar, Ana och Joel (ana.tramosljanin@hotmail.com).
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-dark hover:bg-green-light text-white py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Skickar..." : "Skicka svar"}
          </button>
        </form>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="location" className="py-24 px-4 bg-beige">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-[family-name:var(--font-signature)] text-5xl md:text-6xl text-green-dark text-center mb-12">
          Ta dig hit
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/50 rounded-2xl p-6 border border-green-dark/10">
            <Car className="w-10 h-10 text-green-dark mb-4" />
            <h3 className="text-xl font-semibold text-green-dark mb-3">Bil</h3>
            <p className="text-green-dark">
              Dalarö ligger ca 40 minuter med bil från Stockholm. Följ väg 73
              mot Nynäshamn och sväng av mot Dalarö. Kyrkan och festlokalen
              ligger centralt på Dalarö och det finns parkeringsmöjligheter i
              närheten.
            </p>
          </div>
          <div className="bg-white/50 rounded-2xl p-6 border border-green-dark/10">
            <Train className="w-10 h-10 text-green-dark mb-4" />
            <h3 className="text-xl font-semibold text-green-dark mb-3">
              Kommunalt
            </h3>
            <p className="text-green-dark">
              Ta pendeltåg till Handen, och därefter buss 839 mot
              Dalarö/Smådalarö. Gå av vid Dalarö torg, därifrån är det en kort
              promenad till kyrkan.
            </p>
          </div>
          <div className="bg-white/50 rounded-2xl p-6 border border-green-dark/10">
            <Phone className="w-10 h-10 text-green-dark mb-4" />
            <h3 className="text-xl font-semibold text-green-dark mb-3">Taxi</h3>
            <p className="text-green-dark">
              Taxi fungerar bra hela vägen ut till Dalarö. Det kan vara bra att
              boka i förväg, särskilt om ni är flera som vill samåka.
            </p>
          </div>
          <div className="bg-white/50 rounded-2xl p-6 border border-green-dark/10">
            <Bike className="w-10 h-10 text-green-dark mb-4" />
            <h3 className="text-xl font-semibold text-green-dark mb-3">
              För den äventyrlige
            </h3>
            <p className="text-green-dark">
              Om du bor i närheten är Dalarö en vacker cykeltur bort – men räkna
              med några backar och lite tid.
            </p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-green-dark/10 h-96">
          <iframe
            src="https://www.google.com/maps?q=Odinsvägen+4,+137+70+Dalarö,+Sweden&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dalarö kyrka"
          />
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Vad är klädkoden?",
      a: `Kavaj. Tänk "uppklätt men inte så uppklätt att du börjar tala med kunglig dialekt".

För herrar betyder det kostym (ja, hela kostymen – inte bara kavajen som namnet luras med), skjorta och gärna något runt halsen som antyder att du försökt: slips, fluga eller ett riktigt självsäkert leende.

För damer är det fritt fram med klänning, kjol eller byxdress som känns festlig men inte kräver att någon rullar ut en röd matta. Snyggt, stiligt och redo för att dansa utan att behöva oroa sig för att trampa på en golvlång klänning.

Kort sagt: kom som den bästa versionen av dig själv – den som både kan skåla elegant och dansa obekymrat.`,
    },
    {
      q: "Är barn välkomna?",
      a: "Barn är varmt välkomna på vigseln, men därefter önskar vi fira dagen utan de små. Spädbarn är självklart välkomna.",
    },
    {
      q: "Får vi fota under dagen?",
      a: "Ja! Fota gärna och dela med er via bilduppladdningen på denna sida.",
    },
    {
      q: "Kommer vi att vara inom- eller utomhus?",
      a: "Vi kommer, om vädret tillåter, att fira delar av dagen utomhus, men både vigseln och middagen är sittandes inomhus.",
    },
    {
      q: "Behöver jag ta mig mellan vigseln och middagen?",
      a: "Nej, vigseln och festlokalen ligger precis bredvid varandra.",
    },
    {
      q: "Var finns parkering?",
      a: `Dalarö kyrka har egna parkeringsplatser. Det finns även flera andra parkeringsområden i närheten av kyrkan:

• Dalarö torg – centralt och nära kyrkan
• Askfatshamnen – större parkering nära vattnet
• Dalarö begravningsplats – avgiftsfri parkering i 6 timmar
• Vadviken – här finns även en avgiftsfri parkering mittemot Vadviken (max 12 timmar)`,
    },
    {
      q: "När och var ska jag O.S.A?",
      a: "Vi tackar för svar på inbjudan senast 15 juni. O.S.A via hemsidan.",
    },
    {
      q: "Vem kontaktar jag vid frågor?",
      a: "Hör av er till oss, Axel och Vendela, eller vårt toastpar Ana och Joel (ana.tramosljanin@hotmail.com).",
    },
    {
      q: "Jag vill anmäla tal eller annat inslag under kvällen. Hur går jag tillväga?",
      a: "Kontakta vårt toastpar Ana och Joel (ana.tramosljanin@hotmail.com).",
    },
    {
      q: "Jag kan tyvärr inte komma, men vill bidra till dagen på annat sätt. Hur gör jag?",
      a: "Kontakta vårt toastpar Ana och Joel (ana.tramosljanin@hotmail.com).",
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 bg-pink-light/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-[family-name:var(--font-signature)] text-5xl md:text-6xl text-green-dark text-center mb-12">
          FAQ
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/50 rounded-xl border border-green-dark/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle className="w-5 h-5 text-green-dark shrink-0" />
                  <h3 className="text-lg font-medium text-green-dark">
                    {faq.q}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-green-dark transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 pl-15">
                  <p className="text-green-dark whitespace-pre-line ml-9">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotosSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [homepagePhotos, setHomepagePhotos] = useState<string[]>([]);

  useEffect(() => {
    fetchHomepagePhotos();
  }, []);

  const fetchHomepagePhotos = async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    const { data } = await supabase
      .from("photos")
      .select("file_name")
      .eq("show_on_homepage", true);
    if (data) {
      const urls = data.map((p) => {
        const { data: urlData } = supabase!.storage
          .from("wedding-photos")
          .getPublicUrl(p.file_name);
        return urlData.publicUrl;
      });
      setHomepagePhotos(urls);
    }
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 1920;
        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) =>
            blob ? resolve(blob) : reject(new Error("Compression failed")),
          "image/jpeg",
          0.8,
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
      setShowModal(true);
    }
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!uploaderName.trim() || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      if (!isSupabaseConfigured() || !supabase) {
        alert("Supabase ej konfigurerat.");
        setUploading(false);
        return;
      }
      for (const file of selectedFiles) {
        const compressed = await compressImage(file);
        const fileName = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("wedding-photos")
          .upload(fileName, compressed, { contentType: "image/jpeg" });
        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from("photos").insert({
          file_name: fileName,
          uploader_name: uploaderName.trim(),
        });
        if (dbError) throw dbError;
      }
      setUploaded(true);
      setShowModal(false);
      setSelectedFiles([]);
      setUploaderName("");
      setTimeout(() => setUploaded(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Något gick fel vid uppladdning.");
    }
    setUploading(false);
  };

  return (
    <section id="photos" className="py-24 px-4 bg-beige">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Camera className="w-12 h-12 text-green-dark mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-signature)] text-5xl md:text-6xl text-green-dark mb-4">
            Dela dina bilder
          </h2>
          <p className="text-green-dark mb-8">
            Hjälp oss samla minnen från dagen! Ladda upp dina bilder här.
          </p>
          <label className="inline-flex items-center gap-3 px-8 py-4 rounded-full cursor-pointer transition-colors bg-green-dark hover:bg-green-light text-white">
            <Upload className="w-5 h-5" />
            Välj bilder
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          {uploaded && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-light">
              <Check className="w-5 h-5" />
              <span>Bilderna är uppladdade!</span>
            </div>
          )}
        </div>

        {homepagePhotos.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {homepagePhotos.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-beige rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-green-dark">
                Ladda upp bilder
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFiles([]);
                  setUploaderName("");
                }}
                className="text-green-dark hover:text-green-light"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-green-dark mb-2">Ditt namn *</label>
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="Förnamn Efternamn"
                className="w-full px-4 py-3 rounded-lg border border-green-dark/20 bg-white/50 focus:outline-none focus:border-green-light"
              />
            </div>

            <div className="mb-6">
              <p className="text-green-dark mb-3">
                {selectedFiles.length} bild{selectedFiles.length !== 1 && "er"}{" "}
                valda
              </p>
              <div className="grid grid-cols-3 gap-2">
                {selectedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden bg-green-dark/10"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !uploaderName.trim()}
              className="w-full bg-green-dark hover:bg-green-light text-white py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {uploading ? "Laddar upp..." : "Ladda upp"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
