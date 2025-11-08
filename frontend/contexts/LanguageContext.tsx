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
    pageOf: 'Stránka',
    of: 'z',
    loading: 'Načítám...',
    previousPage: 'Předchozí',
    nextPage: 'Další',
    catalogEnd: 'Jste na konci katalogu! Pokud máte vybráno, obraťte se na náš staff tým.',
    catalogEndTitle: 'Konec katalogu',
    
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
    faqQ1: 'Můžu si u vás fyzicky zakoupit nějaký produkt?',
    faqA1: 'Co se týká produktů, tak ty fyzicky nenabízíme, avšak můžete se zapojit do tomboly po zakoupení produktů „fiktivně" a vyhrát fyzickou cenu. Šance na výhru je velká.',
    faqQ2: 'Nevím si rady, kdo mi pomůže?',
    faqA2: 'Na našem stánku jsou vám k dispozici naši zaměstnanci v černém tričku s visačkou INOVIX.',
    faqQ3: 'Co nabízí Game Zone?',
    faqA3: 'Pro Game Zone jsme si pro vás připravili virtuální realitu – neváhejte ji vyzkoušet!',
    faqQ4: 'Jste autorizovaný prodejce?',
    faqA4: 'Nejsme, jsme pouze fiktivní firma zaměřující se na prodej elektroniky. Nabízíme Game Zone a snažíme se vám udělat co nejlepší zážitek jako v reálném elektro shopu.',
    faqContact: 'Pokud máte další dotazy, kontaktujte nás na e-mailu kontakt@inovix.cz',
    
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
    pageOf: 'Page',
    of: 'of',
    loading: 'Loading...',
    previousPage: 'Previous',
    nextPage: 'Next',
    catalogEnd: 'You\'ve reached the end of the catalog! If you\'ve made your choice, please contact our staff team.',
    catalogEndTitle: 'End of Catalog',
    
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
    faqQ1: 'Can I buy a physical product from you?',
    faqA1: 'We don\'t sell real products, but you can enter our tombola after a "fictional" purchase and win real prizes. The chance of winning is high!',
    faqQ2: 'I\'m not sure what to do — who can help me?',
    faqA2: 'Our staff members in black INOVIX T-shirts with name badges are ready to help you at the booth.',
    faqQ3: 'What does the Game Zone offer?',
    faqA3: 'We have prepared a virtual reality experience for you — don\'t hesitate to try it!',
    faqQ4: 'Are you an authorized retailer?',
    faqA4: 'No, we are a fictional company focused on selling electronics. We offer a Game Zone and aim to give you the best experience possible, like in a real electronics store.',
    faqContact: 'For more questions, contact us at kontakt@inovix.cz',
    
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