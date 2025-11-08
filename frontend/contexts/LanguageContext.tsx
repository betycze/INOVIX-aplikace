import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'cs' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  cs: {
    // Welcome Screen
    welcome: 'Vítejte na',
    customerPortal: 'Zákaznickém portálu',
    fairEndsIn: 'Konec veletrhu za',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    viewCatalog: 'Zobrazit katalog',
    rateOurBooth: 'Ohodnoťte náš stánek',
    faq: 'Časté dotazy',
    
    // Catalog
    productCatalog: 'Katalog produktů',
    downloadCatalog: 'Stáhnout katalog',
    viewPDF: 'Zobrazit PDF',
    catalogDescription: 'Prohlédněte si naše produkty a služby',
    downloading: 'Stahuji...',
    openingCatalog: 'Otevírám katalog...',
    
    // Rating
    rateUs: 'Ohodnoťte nás',
    selectRating: 'Vyberte hodnocení',
    addComment: 'Přidat komentář (volitelné)',
    commentPlaceholder: 'Sdělte nám svůj názor...',
    addPhoto: 'Přidat fotku (volitelné)',
    companyName: 'Název společnosti (volitelné)',
    companyPlaceholder: 'Vaše společnost',
    takePhoto: 'Vyfotit',
    chooseFromGallery: 'Vybrat z galerie',
    removePhoto: 'Odebrat fotku',
    submitRating: 'Odeslat hodnocení',
    submitting: 'Odesílám...',
    thankYou: 'Děkujeme!',
    ratingSuccess: 'Vaše hodnocení bylo úspěšně odesláno',
    ratingError: 'Chyba při odesílání hodnocení',
    selectStars: 'Vyberte prosím hodnocení hvězdičkami',
    
    // FAQ
    frequentlyAsked: 'Často kladené otázky',
    faqQ1: 'Kde najdu více informací o produktech INOVIX?',
    faqA1: 'Navštivte náš katalog produktů nebo se zeptejte našich zástupců na stánku.',
    faqQ2: 'Nabízíte technickou podporu?',
    faqA2: 'Ano, poskytujeme komplexní technickou podporu pro všechny naše produkty.',
    faqQ3: 'Jak mohu objednat produkty?',
    faqA3: 'Kontaktujte nás prostřednictvím našeho webu nebo přímo na veletrhu.',
    faqQ4: 'Dodáváte i do zahraničí?',
    faqA4: 'Ano, dodáváme po celé Evropě i do dalších zemí.',
    faqQ5: 'Jaká je záruka na vaše produkty?',
    faqA5: 'Všechny naše produkty mají standardní záruku 24 měsíců.',
    
    // Common
    back: 'Zpět',
    close: 'Zavřít',
    ok: 'OK',
    cancel: 'Zrušit',
    error: 'Chyba',
  },
  en: {
    // Welcome Screen
    welcome: 'Welcome to',
    customerPortal: 'Customer Portal',
    fairEndsIn: 'Fair ends in',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    viewCatalog: 'View Catalog',
    rateOurBooth: 'Rate Our Booth',
    faq: 'FAQ',
    
    // Catalog
    productCatalog: 'Product Catalog',
    downloadCatalog: 'Download Catalog',
    viewPDF: 'View PDF',
    catalogDescription: 'Browse our products and services',
    downloading: 'Downloading...',
    openingCatalog: 'Opening catalog...',
    
    // Rating
    rateUs: 'Rate Us',
    selectRating: 'Select your rating',
    addComment: 'Add a comment (optional)',
    commentPlaceholder: 'Share your thoughts...',
    addPhoto: 'Add a photo (optional)',
    companyName: 'Company name (optional)',
    companyPlaceholder: 'Your company',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    removePhoto: 'Remove Photo',
    submitRating: 'Submit Rating',
    submitting: 'Submitting...',
    thankYou: 'Thank You!',
    ratingSuccess: 'Your rating has been submitted successfully',
    ratingError: 'Error submitting rating',
    selectStars: 'Please select a star rating',
    
    // FAQ
    frequentlyAsked: 'Frequently Asked Questions',
    faqQ1: 'Where can I find more information about INOVIX products?',
    faqA1: 'Visit our product catalog or ask our representatives at the booth.',
    faqQ2: 'Do you offer technical support?',
    faqA2: 'Yes, we provide comprehensive technical support for all our products.',
    faqQ3: 'How can I order products?',
    faqA3: 'Contact us through our website or directly at the fair.',
    faqQ4: 'Do you ship internationally?',
    faqA4: 'Yes, we deliver throughout Europe and other countries.',
    faqQ5: 'What warranty do your products have?',
    faqA5: 'All our products come with a standard 24-month warranty.',
    
    // Common
    back: 'Back',
    close: 'Close',
    ok: 'OK',
    cancel: 'Cancel',
    error: 'Error',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('cs');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};