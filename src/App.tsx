import { useEffect, useState, useMemo } from 'react';
import { fetchMosques } from './services/api';
import type { Mosque } from './types';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import { Loader2 } from 'lucide-react';

function App() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Sidebar & Map logic
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMosques();
      setMosques(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredMosques = useMemo(() => {
    return mosques.filter((mosque) => {
      const matchesSearch = mosque.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'Tümü' || mosque.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [mosques, searchTerm, selectedType]);

  const handleMosqueClick = (mosque: Mosque) => {
    setSelectedMosque(mosque);
    if (window.innerWidth < 768) { // Mobile breakpoint
      setIsSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <h1 className="text-xl font-medium text-gray-700">Cami Verileri Yükleniyor...</h1>
        <p className="text-sm text-gray-500 mt-2">Bu işlem birkaç saniye sürebilir.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-gray-100">
      <Sidebar
        mosques={filteredMosques}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onMosqueClick={handleMosqueClick}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 relative h-full">
        <MapComponent
          mosques={filteredMosques}
          selectedMosque={selectedMosque}
        />
      </main>
    </div>
  );
}

export default App;
