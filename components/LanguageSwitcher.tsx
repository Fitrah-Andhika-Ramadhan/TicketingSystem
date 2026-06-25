'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('id'); // Default is Indonesian

  useEffect(() => {
    // Check cookie on mount
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match && match[2]) {
      const parts = decodeURIComponent(match[2]).split('/');
      if (parts.length > 2) {
        setLang(parts[2]); // e.g. /id/en -> en
      }
    }
  }, []);

  const switchLang = (targetLang: string) => {
    // Determine the cookie value based on the target language.
    // Assuming the base language of the site is Indonesian (id).
    const cookieValue = targetLang === 'id' ? '/id/id' : `/id/${targetLang}`;
    
    // Set cookie for root domain
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${location.hostname};`;

    setLang(targetLang);
    window.location.reload();
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden"></div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
            <Globe className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem 
            className={`cursor-pointer ${lang === 'id' ? 'font-bold text-blue-600 bg-blue-50' : ''}`}
            onClick={() => switchLang('id')}
          >
            🇮🇩 Indonesia
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`cursor-pointer ${lang === 'en' ? 'font-bold text-blue-600 bg-blue-50' : ''}`}
            onClick={() => switchLang('en')}
          >
            🇺🇸 English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
