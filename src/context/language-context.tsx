"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageCode = "en" | "hi" | "hinglish" | "es" | "fr";

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "hinglish", label: "Hinglish", nativeName: "Hinglish", flag: "🇮🇳" },
  { code: "es", label: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", label: "French", nativeName: "Français", flag: "🇫🇷" },
];

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav
    brand_sub: "PREMIUM MOBILITY",
    nav_home: "Home",
    nav_browse: "Browse Cars",
    nav_how: "How It Works",
    nav_dashboard: "Dashboard",
    nav_admin: "Admin Console",
    nav_login: "Sign In",
    nav_register: "Register",
    nav_signout: "Sign Out",
    
    // Hero
    hero_badge: "PREMIUM MOBILITY PLATFORM • UTTAR PRADESH",
    hero_title: "Experience Exceptional Drives Across Uttar Pradesh",
    hero_sub: "Reserve top-tier luxury sedans, electric SUVs, and high-performance vehicles across Prayagraj, Lucknow, and Varanasi hubs with zero paperwork friction.",
    hero_pickup_loc: "Pickup Station / Hub",
    hero_pickup_date: "Pickup Date",
    hero_return_date: "Return Date",
    hero_search_btn: "Find Available Vehicles",
    
    // Sections
    sec_popular_badge: "HANDPICKED FLEET",
    sec_popular_title: "Popular Premium Vehicles",
    sec_popular_sub: "Experience our highest-rated automobiles ready for instant departure.",
    sec_view_all: "View Complete Fleet",
    sec_categories_badge: "CURATED COLLECTIONS",
    sec_categories_title: "Browse by Vehicle Category",
    sec_how_badge: "SEAMLESS JOURNEY",
    sec_how_title: "How Rent a Ride Works",
    sec_reviews_badge: "TESTIMONIALS",
    sec_reviews_title: "Verified Driver Reviews",
    
    // Card & UI
    per_day: "/ day",
    view_details: "View Details",
    book_now: "Book Now",
    available_now: "Available Now",
    passengers: "Passengers",
    
    // Chatbot
    chat_header: "Rent-a-Ride AI Assistant",
    chat_status: "Online • Ready to Answer Anything",
    chat_prompt_placeholder: "Ask about cars, pricing, Prayagraj hubs, booking steps...",
    chat_send: "Send",
    chat_welcome: "Namaste! I am your Rent-a-Ride AI Assistant. Ask me anything about our fleet, rates in ₹, pickup hubs in Prayagraj & UP, or booking guidelines!",
  },
  hi: {
    // Nav
    brand_sub: "प्रीमियम मोबिलिटी",
    nav_home: "होम",
    nav_browse: "गाड़ियाँ देखें",
    nav_how: "यह कैसे काम करता है",
    nav_dashboard: "डैशबोर्ड",
    nav_admin: "एडमिन कंसोल",
    nav_login: "साइन इन करें",
    nav_register: "रजिस्टर करें",
    nav_signout: "साइन आउट",
    
    // Hero
    hero_badge: "प्रीमियम मोबिलिटी प्लेटफॉर्म • उत्तर प्रदेश",
    hero_title: "उत्तर प्रदेश में बेहतरीन ड्राइविंग का अनुभव करें",
    hero_sub: "प्रयागराज, लखनऊ और वाराणसी हब में बिना किसी परेशानी के टॉप-टियर लग्जरी सेडान, इलेक्ट्रिक एसयूवी और प्रीमियम गाड़ियाँ बुक करें।",
    hero_pickup_loc: "पिकअप स्टेशन / हब",
    hero_pickup_date: "पिकअप तिथि",
    hero_return_date: "वापसी तिथि",
    hero_search_btn: "उपलब्ध गाड़ियाँ खोजें",
    
    // Sections
    sec_popular_badge: "सर्वश्रेष्ठ फ्लीट",
    sec_popular_title: "लोकप्रिय प्रीमियम गाड़ियाँ",
    sec_popular_sub: "तत्काल यात्रा के लिए तैयार हमारी उच्चतम रेटिंग वाली गाड़ियाँ।",
    sec_view_all: "पूरी फ्लीट देखें",
    sec_categories_badge: "श्रेणियाँ",
    sec_categories_title: "श्रेणी के अनुसार गाड़ियाँ खोजें",
    sec_how_badge: "सरल प्रक्रिया",
    sec_how_title: "रेंट-ए-राइड कैसे काम करता है",
    sec_reviews_badge: "ग्राहक समीक्षा",
    sec_reviews_title: "सत्यापित ग्राहकों की समीक्षाएं",
    
    // Card & UI
    per_day: "/ दिन",
    view_details: "विवरण देखें",
    book_now: "अभी बुक करें",
    available_now: "अभी उपलब्ध",
    passengers: "सवारियां",
    
    // Chatbot
    chat_header: "रेंट-ए-राइड एआई सहायक",
    chat_status: "ऑनलाइन • सभी उत्तर देने के लिए तैयार",
    chat_prompt_placeholder: "गाड़ियों, किराए, प्रयागराज हब या बुकिंग के बारे में पूछें...",
    chat_send: "भेजें",
    chat_welcome: "नमस्ते! मैं आपका रेंट-ए-राइड एआई सहायक हूँ। हमारी गाड़ियों, ₹ में किराए, प्रयागराज एवं यूपी हब या बुकिंग प्रक्रिया के बारे में कुछ भी पूछें!",
  },
  hinglish: {
    // Nav
    brand_sub: "PREMIUM MOBILITY",
    nav_home: "Home",
    nav_browse: "Cars Dekhein",
    nav_how: "Kaise Kaam Karta Hai",
    nav_dashboard: "Dashboard",
    nav_admin: "Admin Panel",
    nav_login: "Login Karein",
    nav_register: "Naya Account",
    nav_signout: "Logout",
    
    // Hero
    hero_badge: "PREMIUM MOBILITY • UP & PRAYAGRAJ",
    hero_title: "Uttar Pradesh Me Shandaar Drive Ka Anand Lein",
    hero_sub: "Prayagraj, Lucknow aur Varanasi me luxury sedans, electric SUVs aur premium cars bina kisi hassle ke book karein.",
    hero_pickup_loc: "Pickup Station / Hub",
    hero_pickup_date: "Pickup Date",
    hero_return_date: "Return Date",
    hero_search_btn: "Available Cars Search Karein",
    
    // Sections
    sec_popular_badge: "BEST FLEET",
    sec_popular_title: "Popular Premium Gaadiyan",
    sec_popular_sub: "Top-rated cars jo turant drive ke liye ready hain.",
    sec_view_all: "Saari Cars Dekhein",
    sec_categories_badge: "CATEGORIES",
    sec_categories_title: "Category Ke Mutabiq Chunein",
    sec_how_badge: "EASY STEPS",
    sec_how_title: "Rent a Ride Kaise Kaam Karta Hai",
    sec_reviews_badge: "REVIEWS",
    sec_reviews_title: "Verified Drivers Ke Reviews",
    
    // Card & UI
    per_day: "/ din",
    view_details: "Details Dekhein",
    book_now: "Abhi Book Karein",
    available_now: "Available Hai",
    passengers: "Seats",
    
    // Chatbot
    chat_header: "Rent-a-Ride AI Sahayak",
    chat_status: "Online • Sabhi Sawalon Ka Jawab",
    chat_prompt_placeholder: "Cars, pricing, Prayagraj location ke baare me poochein...",
    chat_send: "Bhejein",
    chat_welcome: "Namaste! Main aapka Rent-a-Ride AI Concierge hoon. Hamari fleet, rates, Prayagraj stations aur booking ke baare me kuch bhi pooch sakte hain!",
  },
  es: {
    brand_sub: "MOVILIDAD PREMIUM",
    nav_home: "Inicio",
    nav_browse: "Explorar Autos",
    nav_how: "Cómo Funciona",
    nav_dashboard: "Panel",
    nav_admin: "Consola Admin",
    nav_login: "Iniciar Sesión",
    nav_register: "Registrarse",
    nav_signout: "Cerrar Sesión",
    hero_badge: "PLATAFORMA PREMIUM • UTTAR PRADESH",
    hero_title: "Experiencias Excepcionales en Uttar Pradesh",
    hero_sub: "Reserve vehículos de lujo, SUVs eléctricos y autos de alto rendimiento en Prayagraj, Lucknow y Varanasi.",
    hero_pickup_loc: "Estación de Recogida",
    hero_pickup_date: "Fecha de Recogida",
    hero_return_date: "Fecha de Devolución",
    hero_search_btn: "Buscar Vehículos",
    sec_popular_badge: "FLOTA SELECCIONADA",
    sec_popular_title: "Vehículos Populares",
    sec_popular_sub: "Vehículos mejor calificados listos para salida inmediata.",
    sec_view_all: "Ver Toda la Flota",
    sec_categories_badge: "COLECCIONES",
    sec_categories_title: "Explorar por Categoría",
    sec_how_badge: "PROCESO SIMPLE",
    sec_how_title: "Cómo Funciona Rent a Ride",
    sec_reviews_badge: "OPINIONES",
    sec_reviews_title: "Opiniones Verificadas",
    per_day: "/ día",
    view_details: "Ver Detalles",
    book_now: "Reservar Ahora",
    available_now: "Disponible Ahora",
    passengers: "Pasajeros",
    chat_header: "Asistente IA Rent-a-Ride",
    chat_status: "En línea • Listo para responder todo",
    chat_prompt_placeholder: "Pregunte sobre vehículos, precios, ubicaciones...",
    chat_send: "Enviar",
    chat_welcome: "¡Hola! Soy tu asistente de IA de Rent-a-Ride. ¡Pregúntame cualquier cosa sobre nuestra flota, precios y cómo reservar!",
  },
  fr: {
    brand_sub: "MOBILITÉ HAUT DE GAMME",
    nav_home: "Accueil",
    nav_browse: "Parcourir Véhicules",
    nav_how: "Comment Ça Marche",
    nav_dashboard: "Tableau de Bord",
    nav_admin: "Console Admin",
    nav_login: "Connexion",
    nav_register: "S'inscrire",
    nav_signout: "Déconnexion",
    hero_badge: "MOBILITÉ PREMIUM • UTTAR PRADESH",
    hero_title: "Voyages d'Exception en Uttar Pradesh",
    hero_sub: "Réservez des berlines de luxe, SUV électriques et véhicules haute performance à Prayagraj, Lucknow et Varanasi.",
    hero_pickup_loc: "Station de Prise en Charge",
    hero_pickup_date: "Date de Départ",
    hero_return_date: "Date de Retour",
    hero_search_btn: "Rechercher Véhicules",
    sec_popular_badge: "SÉLECTION PREMIUM",
    sec_popular_title: "Véhicules les Plus Populaires",
    sec_popular_sub: "Nos véhicules les mieux notés disponibles immédiatement.",
    sec_view_all: "Voir Toute la Flotte",
    sec_categories_badge: "COLLECTIONS",
    sec_categories_title: "Parcourir par Catégorie",
    sec_how_badge: "VOYAGE FLUIDE",
    sec_how_title: "Comment Fonctionne Rent a Ride",
    sec_reviews_badge: "TÉMOIGNAGES",
    sec_reviews_title: "Avis Clients Vérifiés",
    per_day: "/ jour",
    view_details: "Voir Détails",
    book_now: "Réserver",
    available_now: "Disponible",
    passengers: "Passagers",
    chat_header: "Assistant IA Rent-a-Ride",
    chat_status: "En ligne • Prêt à répondre à tout",
    chat_prompt_placeholder: "Posez vos questions sur la flotte, tarifs, agences...",
    chat_send: "Envoyer",
    chat_welcome: "Bonjour ! Je suis votre concierge IA Rent-a-Ride. N'hésitez pas à me poser vos questions sur nos véhicules et réservations !",
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("rar_language") as LanguageCode | null;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("rar_language", lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en" as LanguageCode,
      setLanguage: () => {},
      t: (key: string) => key,
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
