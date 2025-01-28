import React from 'react';
import { useState } from 'react';

const ThemeSwitcher = () => {
  const [selectedTheme, setSelectedTheme] = useState('artsy-light');
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'artsy-light', name: 'Artsy Light', bg: 'bg-[#f8f4ec]', text: 'text-[#3a2d32]', border: 'border-[#d4c8b9]' },
    { id: 'functional-light', name: 'Functional Light', bg: 'bg-[#f8f9fa]', text: 'text-[#212529]', border: 'border-[#dee2e6]' },
    { id: 'artsy-dark', name: 'Artsy Dark', bg: 'bg-[#2d3436]', text: 'text-[#dfe6e9]', border: 'border-[#636e72]' },
    { id: 'functional-dark', name: 'Functional Dark', bg: 'bg-[#1a1a1a]', text: 'text-[#e6e6e6]', border: 'border-[#404040]' }
  ];

  const currentTheme = themes.find(t => t.id === selectedTheme);

  return (
    <div
      className="relative ml-auto flex "
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={`bg-black text-white ${currentTheme?.text} hover:bg-red-600 ease-in cursor-pointer px-10 content-center`}>
        Style
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full w-48 rounded-lg shadow-xl overflow-hidden px-4">
          <div className={`${currentTheme?.bg} ${currentTheme?.border} border rounded-lg p-1 content-center`}>
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`w-full p-3 text-left flex items-center gap-3 hover:opacity-90 transition-opacity ${theme.bg} ${theme.text} ${
                  selectedTheme === theme.id ? 'font-bold' : ''
                }`}
              >
                <span
                  className={`w-6 h-6 rounded border-2 ${theme.border} ${theme.bg.replace('bg-', 'bg-')}`}
                  style={{ backgroundColor: theme.bg.split('-')[1] }}
                />
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
