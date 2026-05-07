import { Globe } from 'lucide-react';
import { useState } from 'react';

type Language = 'ru' | 'kk';

interface TopHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function TopHeader({ language, onLanguageChange }: TopHeaderProps) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'ru' as Language, label: 'Русский', flag: '🇷🇺' },
    { code: 'kk' as Language, label: 'Қазақша', flag: '🇰🇿' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-end">
      <div className="relative">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{currentLang.flag} {currentLang.label}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showLangMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowLangMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    language === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
