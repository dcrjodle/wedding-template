"use client";

import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Lock, LogOut, Users, Camera, Download, Trash2, X } from "lucide-react";

type RSVP = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  attending: string;
  wants_speech: boolean;
  song: string;
  has_dietary: boolean;
  dietary: string;
  fun_fact: string;
};

type Photo = {
  id: string;
  file_name: string;
  uploader_name: string;
  show_on_homepage: boolean;
  url: string;
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<RSVP | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isSupabaseConfigured() || !supabase) {
        setError("Supabase ej konfigurerat");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email.trim())
        .eq("password_hash", password)
        .maybeSingle();

      console.log("Query result:", { data, queryError });

      if (queryError) {
        setError(`Fel: ${queryError.message}`);
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Fel e-post eller lösenord");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("admin_logged_in", "true");
      setIsLoggedIn(true);
      fetchRSVPs();
      fetchPhotos();
    } catch {
      setError("Något gick fel");
    }
    setLoading(false);
  };

  const fetchRSVPs = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("rsvp")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRsvps(data);
  };

  const fetchPhotos = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      const photosWithUrls = data.map((photo) => {
        const { data: urlData } = supabase!.storage
          .from("wedding-photos")
          .getPublicUrl(photo.file_name);
        return { ...photo, url: urlData.publicUrl };
      });
      setPhotos(photosWithUrls);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Namn",
      "E-post",
      "Status",
      "Tal",
      "Specialkost",
      "Kost",
      "Låt",
      "Fun fact",
    ];
    const rows = rsvps.map((r) => [
      r.name,
      r.email,
      r.attending === "yes"
        ? "Kommer"
        : r.attending === "ceremony_only"
          ? "Endast vigsel"
          : "Kommer ej",
      r.wants_speech ? "Ja" : "Nej",
      r.has_dietary ? "Ja" : "Nej",
      r.dietary || "",
      r.song || "",
      r.fun_fact || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gastlista.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteRSVP = async () => {
    if (!supabase || !deleteTarget) return;
    await supabase.from("rsvp").delete().eq("id", deleteTarget.id);
    setRsvps(rsvps.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const toggleHomepage = async (photo: Photo) => {
    if (!supabase) return;
    const newValue = !photo.show_on_homepage;
    await supabase
      .from("photos")
      .update({ show_on_homepage: newValue })
      .eq("id", photo.id);
    setPhotos(
      photos.map((p) =>
        p.id === photo.id ? { ...p, show_on_homepage: newValue } : p,
      ),
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
    setRsvps([]);
    setPhotos([]);
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_logged_in") === "true") {
      setIsLoggedIn(true);
      fetchRSVPs();
      fetchPhotos();
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-beige flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/50 rounded-2xl p-8 border border-green-dark/10">
            <div className="flex items-center justify-center mb-6">
              <Lock className="w-12 h-12 text-green-dark" />
            </div>
            <h1 className="text-2xl font-semibold text-green-dark text-center mb-8">
              Admin
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-green-dark mb-2">E-post</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-green-dark/20 bg-white/50 focus:outline-none focus:border-green-light"
                />
              </div>
              <div>
                <label className="block text-green-dark mb-2">Lösenord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-green-dark/20 bg-white/50 focus:outline-none focus:border-green-light"
                />
              </div>
              {error && (
                <p className="text-pink-dark text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-dark hover:bg-green-light text-white py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Loggar in..." : "Logga in"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  const attending = rsvps.filter((r) => r.attending === "yes");
  const notAttending = rsvps.filter((r) => r.attending === "no");
  const ceremonyOnly = rsvps.filter((r) => r.attending === "ceremony_only");

  return (
    <main className="min-h-screen bg-beige py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-dark" />
            <h1 className="text-2xl font-semibold text-green-dark">
              Gästlista
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 text-green-dark hover:text-green-light transition-colors"
            >
              <Download className="w-5 h-5" />
              Ladda ner CSV
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-green-dark hover:text-green-light transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logga ut
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-light/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-semibold text-green-dark">
              {attending.length}
            </p>
            <p className="text-green-dark">Kommer</p>
          </div>
          <div className="bg-pink-light/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-semibold text-green-dark">
              {ceremonyOnly.length}
            </p>
            <p className="text-green-dark">Endast vigsel</p>
          </div>
          <div className="bg-pink-dark/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-semibold text-green-dark">
              {notAttending.length}
            </p>
            <p className="text-green-dark">Kan ej komma</p>
          </div>
        </div>

        <div className="bg-white/50 rounded-2xl border border-green-dark/10 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-dark/5">
                <tr>
                  <th className="text-left p-4 text-green-dark font-medium">
                    Namn
                  </th>
                  <th className="text-left p-4 text-green-dark font-medium">
                    E-post
                  </th>
                  <th className="text-left p-4 text-green-dark font-medium">
                    Status
                  </th>
                  <th className="text-left p-4 text-green-dark font-medium">
                    Tal
                  </th>
                  <th className="text-left p-4 text-green-dark font-medium">
                    Kost
                  </th>
                  <th className="text-left p-4 text-green-dark font-medium">
                    Låt
                  </th>
                  <th className="text-left p-4 text-green-dark font-medium">
                    Fun fact
                  </th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-t border-green-dark/10">
                    <td className="p-4 text-green-dark">{rsvp.name}</td>
                    <td className="p-4 text-green-dark">{rsvp.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          rsvp.attending === "yes"
                            ? "bg-green-light/20 text-green-dark"
                            : rsvp.attending === "ceremony_only"
                              ? "bg-pink-light text-green-dark"
                              : "bg-pink-dark/20 text-green-dark"
                        }`}
                      >
                        {rsvp.attending === "yes"
                          ? "Kommer"
                          : rsvp.attending === "ceremony_only"
                            ? "Vigsel"
                            : "Nej"}
                      </span>
                    </td>
                    <td className="p-4 text-green-dark">
                      {rsvp.wants_speech ? "Ja" : "-"}
                    </td>
                    <td className="p-4 text-green-dark">
                      {rsvp.has_dietary ? rsvp.dietary : "-"}
                    </td>
                    <td className="p-4 text-green-dark">{rsvp.song || "-"}</td>
                    <td className="p-4 text-green-dark max-w-xs truncate">
                      {rsvp.fun_fact || "-"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setDeleteTarget(rsvp)}
                        className="text-pink-dark hover:text-pink-dark/70 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Camera className="w-8 h-8 text-green-dark" />
          <h2 className="text-2xl font-semibold text-green-dark">
            Bilder ({photos.length})
          </h2>
        </div>

        {photos.length === 0 ? (
          <p className="text-green-dark/70">Inga bilder uppladdade än.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`rounded-xl overflow-hidden bg-white/50 border-2 ${
                  photo.show_on_homepage
                    ? "border-green-light"
                    : "border-green-dark/10"
                }`}
              >
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square hover:opacity-90 transition-opacity"
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </a>
                <div className="p-3">
                  <p className="text-sm text-green-dark truncate mb-2">
                    {photo.uploader_name}
                  </p>
                  <button
                    onClick={() => toggleHomepage(photo)}
                    className={`w-full text-sm py-2 px-3 rounded-lg transition-colors ${
                      photo.show_on_homepage
                        ? "bg-green-light text-white"
                        : "bg-green-dark/10 text-green-dark hover:bg-green-dark/20"
                    }`}
                  >
                    {photo.show_on_homepage
                      ? "Visas på startsidan"
                      : "Visa på startsidan"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-beige rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-dark">
                Bekräfta borttagning
              </h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-green-dark hover:text-green-light"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-green-dark mb-6">
              Är du säker på att du vill ta bort{" "}
              <strong>{deleteTarget.name}</strong> från gästlistan?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-lg border border-green-dark/20 text-green-dark hover:bg-green-dark/5 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={deleteRSVP}
                className="flex-1 py-3 rounded-lg bg-pink-dark text-white hover:bg-pink-dark/80 transition-colors"
              >
                Ta bort
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
