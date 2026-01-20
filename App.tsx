
import React, { useState, useEffect } from 'react';
import { Smartphone, LayoutDashboard, Sparkles, Settings, Bell, User, MapPin, Search } from 'lucide-react';
import DeviceTracker from './components/DeviceTracker';
import GeminiTools from './components/GeminiTools';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'ai-hub'>('dashboard');
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Check for API Key on mount (mock check)
  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) setShowKeyModal(true);
      }
    };
    checkKey();
  }, []);

  const openKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setShowKeyModal(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Sidebar - Persistent Navigation */}
      <aside className="lg:w-72 bg-white border-r border-slate-200 lg:fixed lg:h-full flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">UniTrace</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Powered by Gemini</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('ai-hub')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'ai-hub' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Centro de IA</span>
          </button>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Utilidades</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
              <Bell className="w-5 h-5" />
              <span className="font-medium">Notificaciones</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Ajustes</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
               <img src="https://picsum.photos/id/64/100/100" alt="user" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">Soporte Técnico</p>
              <p className="text-[10px] text-slate-500 truncate">Premium Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="lg:hidden bg-blue-600 p-1.5 rounded-lg text-white mr-2">
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              {activeView === 'dashboard' ? 'Rastreo Universal' : 'Herramientas de Inteligencia'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Servicios Online
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-6 max-w-7xl mx-auto w-full space-y-8 pb-20">
          {activeView === 'dashboard' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-200">
                  <p className="text-blue-100 text-sm mb-1">Dispositivos Vinculados</p>
                  <p className="text-3xl font-bold">3</p>
                  <div className="mt-4 flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-white/20" />)}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-slate-500 text-sm mb-1">Alertas Recientes</p>
                  <p className="text-3xl font-bold text-slate-800">0</p>
                  <p className="text-xs text-green-600 mt-2 font-medium">Todo bajo control</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-slate-500 text-sm mb-1">Uso de IA (Mensual)</p>
                  <p className="text-3xl font-bold text-slate-800">12</p>
                  <p className="text-xs text-slate-400 mt-2">Créditos: Ilimitado</p>
                </div>
              </div>
              
              <DeviceTracker />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl text-white">
                 <h2 className="text-3xl font-bold mb-2">OmniTool Hub</h2>
                 <p className="text-indigo-100 max-w-xl">
                   Potencia tus búsquedas y edición multimedia con los últimos modelos de Gemini. 
                   Desde encontrar restaurantes cercanos hasta generar arte digital de alta resolución.
                 </p>
               </div>
               <GeminiTools />
            </div>
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-auto p-8 text-center text-slate-400 text-xs border-t bg-white">
          <p>© 2024 UniTrace AI. Localización universal impulsada por Google Gemini.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-blue-600">Privacidad</a>
            <a href="#" className="hover:text-blue-600">Términos</a>
            <a href="#" className="hover:text-blue-600">Documentación</a>
          </div>
        </footer>
      </main>

      {/* Key Selection Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center text-amber-600 mb-6 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">Configuración Requerida</h3>
            <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
              Para utilizar las funciones avanzadas de generación de imágenes de alta resolución (Gemini 3 Pro), debes seleccionar una API Key de un proyecto con facturación habilitada.
            </p>
            <div className="space-y-4">
              <button 
                onClick={openKeySelector}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Seleccionar API Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="block text-center text-xs text-blue-600 hover:underline"
              >
                Más información sobre facturación →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
