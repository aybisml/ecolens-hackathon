import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. LOGIKA DEFAULT:
  // Cek apakah user pernah menyimpan preferensi 'ecoTheme'.
  // Jika TIDAK ADA (pengunjung baru), paksa gunakan "dark".
  const [theme, setTheme] = useState(
    localStorage.getItem("ecoTheme") || "dark",
  );

  useEffect(() => {
    const root = document.documentElement;

    // 2. RESET CLASS HTML
    // Hapus class lama agar tidak bentrok, lalu tambahkan class tema saat ini
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // 3. SIMPAN KE LOCALSTORAGE
    // Agar saat di-refresh, browser mengingat pilihan terakhir user
    localStorage.setItem("ecoTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
