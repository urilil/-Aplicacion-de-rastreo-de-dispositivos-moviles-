
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { Sparkles, Search, Map as MapIcon, Image as ImageIcon, Send, Loader2, Camera, Download } from 'lucide-react';

const GeminiTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'maps' | 'edit' | 'generate'>('search');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; links: any[]; image?: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [genSize, setGenSize] = useState<'1K' | '2K' | '4K'>('1K');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const gemini = new GeminiService();

  const handleAction = async () => {
    if (!input && activeTab !== 'edit') return;
    setLoading(true);
    setResult(null);

    try {
      if (activeTab === 'search') {
        const res = await gemini.searchInfo(input);
        setResult({ text: res.text, links: res.links });
      } else if (activeTab === 'maps') {
        // Try to get location
        let loc = undefined;
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej)
          );
          loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch (e) {}
        const res = await gemini.searchPlaces(input, loc);
        setResult({ text: res.text, links: res.links });
      } else if (activeTab === 'edit' && selectedImage) {
        const resImage = await gemini.editImage(selectedImage, input || "Mejora esta imagen");
        if (resImage) setResult({ text: "Imagen editada con éxito.", links: [], image: resImage });
      } else if (activeTab === 'generate') {
        const resImage = await gemini.generateImage(input, genSize);
        if (resImage) setResult({ text: `Imagen generada en ${genSize}`, links: [], image: resImage });
      }
    } catch (err) {
      console.error(err);
      setResult({ text: "Hubo un error al procesar tu solicitud.", links: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b overflow-x-auto">
        {[
          { id: 'search', label: 'Búsqueda IA', icon: <Search className="w-4 h-4"/> },
          { id: 'maps', label: 'Lugares', icon: <MapIcon className="w-4 h-4"/> },
          { id: 'edit', label: 'Editor IA', icon: <Camera className="w-4 h-4"/> },
          { id: 'generate', label: 'Generar', icon: <ImageIcon className="w-4 h-4"/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setResult(null); }}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 px-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {activeTab === 'edit' && (
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden"
              >
                {selectedImage ? (
                  <img src={selectedImage} className="w-full h-full object-contain" alt="Selected" />
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">Haz clic para subir imagen</p>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          )}

          {activeTab === 'generate' && (
             <div className="flex gap-2 mb-2">
                {['1K', '2K', '4K'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setGenSize(s as any)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${genSize === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeTab === 'search' ? "¿Quién ganó más medallas en París 2024?" :
                activeTab === 'maps' ? "¿Restaurantes italianos cerca de mí?" :
                activeTab === 'edit' ? "Ej: 'Añade un filtro retro' o 'Quita el fondo'" :
                "Ej: 'Un paisaje futurista de una ciudad inteligente'"
              }
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAction()}
            />
            <button 
              onClick={handleAction}
              disabled={loading}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>

          {(result || loading) && (
            <div className="mt-6 space-y-4 animate-in fade-in duration-500">
              {loading && !result && (
                <div className="flex items-center justify-center py-10">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-sm text-slate-500 animate-pulse">Consultando a Gemini...</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Respuesta IA</span>
                  </div>
                  
                  {result.image && (
                    <div className="mb-4 rounded-lg overflow-hidden border shadow-sm group relative">
                       <img src={result.image} className="w-full max-h-[400px] object-contain bg-white" alt="Gemini Output" />
                       <a href={result.image} download="gemini_output.png" className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <Download className="w-4 h-4 text-slate-700" />
                       </a>
                    </div>
                  )}

                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {result.text}
                  </p>

                  {result.links && result.links.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs font-bold text-slate-400 mb-2">FUENTES Y ENLACES:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.links.map((link: any, idx: number) => {
                          const item = link.web || link.maps;
                          if (!item) return null;
                          return (
                            <a 
                              key={idx}
                              href={item.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white border rounded-full text-xs text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              {link.maps ? <MapIcon className="w-3 h-3"/> : <Search className="w-3 h-3"/>}
                              {item.title || 'Ver fuente'}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiTools;
