import React from 'react';
import type { Mosque } from '../types';
import { Search, MapPin, X, Menu } from 'lucide-react';

interface SidebarProps {
  mosques: Mosque[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  onMosqueClick: (mosque: Mosque) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mosques,
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  onMosqueClick,
  isOpen,
  setIsOpen
}) => {
  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[1000] p-2 bg-white rounded-md shadow-md text-gray-700 hover:bg-gray-50"
          aria-label="Menüyü Aç"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar / Bottom Sheet */}
      <div
        className={`fixed md:relative z-[1000] md:z-10 flex flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          w-full md:w-80 lg:w-96
          h-[50vh] md:h-full
          bottom-0 md:bottom-auto
          rounded-t-2xl md:rounded-none
        `}
      >
        <div className="p-4 border-b flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="text-blue-600" /> CamiMapTR
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
              aria-label="Menüyü Kapat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cami ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar">
            {['Tümü', 'Tarihi', 'Modern'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                  ${selectedType === type
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {mosques.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
              <Search size={32} className="opacity-50" />
              <p>Cami bulunamadı.</p>
            </div>
          ) : (
            mosques.map((mosque) => (
              <div
                key={mosque.id}
                onClick={() => onMosqueClick(mosque)}
                className="p-3 border rounded-xl cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all bg-white"
              >
                <h3 className="font-semibold text-gray-800 truncate" title={mosque.name}>{mosque.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-2 gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${mosque.type === 'Tarihi' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {mosque.type}
                  </span>
                  {mosque.buildYear && mosque.buildYear !== 'Bilinmiyor' && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                      Yıl: {mosque.buildYear}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t text-sm font-medium text-center text-gray-500 bg-gray-50">
          Toplam {mosques.length} kayıt bulundu
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[990] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
