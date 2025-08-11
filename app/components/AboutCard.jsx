import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AboutCard() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStore() {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("about_store")
        .select("title, description, image_url, last_updated")
        .order("last_updated", { ascending: false })
        .limit(1)
        .single();
      if (error) {
        setError("Could not load store info.");
        setLoading(false);
        return;
      }
      setStore(data);
      setLoading(false);
    }
    fetchStore();
  }, []);

  if (loading) {
    return (
  <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[180px]">
        <span className="text-gray-400">Loading store info...</span>
      </div>
    );
  }
  if (error) {
    return (
  <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-6 flex items-center justify-center min-h-[180px]">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }
  if (!store) return null;

  return (
  <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
        {store.image_url ? (
          <img src={store.image_url} alt={store.title} className="object-cover w-full h-full" />
        ) : (
          <span className="text-4xl text-gray-400">🏪</span>
        )}
      </div>
      <div className="flex-1">
  <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">{store.title}</h2>
  <p className="text-gray-800 dark:text-gray-100 mb-2">{store.description}</p>
        {/* You can add more fields here if your table has them */}
      </div>
    </div>
  );
}
