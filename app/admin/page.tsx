"use client";

import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Lock, LogOut, Users } from "lucide-react";

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

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

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

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
    setRsvps([]);
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_logged_in") === "true") {
      setIsLoggedIn(true);
      fetchRSVPs();
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-green-dark hover:text-green-light transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logga ut
          </button>
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

        <div className="bg-white/50 rounded-2xl border border-green-dark/10 overflow-hidden">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
