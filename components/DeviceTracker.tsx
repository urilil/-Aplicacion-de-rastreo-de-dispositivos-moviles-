
import React, { useState, useEffect } from 'react';
import { DeviceType, TrackedDevice } from '../types';
import { MapPin, Battery, Wifi, WifiOff, Smartphone, Apple, Monitor } from 'lucide-react';
import QRCode from './QRCode';

const mockDevices: TrackedDevice[] = [
  { id: '1', name: 'iPhone 15 Pro', type: DeviceType.IOS, lastSeen: 'Just now', battery: 85, latitude: 40.7128, longitude: -74.006, status: 'online' },
  { id: '2', name: 'Pixel 8', type: DeviceType.ANDROID, lastSeen: '2h ago', battery: 42, latitude: 34.0522, longitude: -118.2437, status: 'offline' },
  { id: '3', name: 'MacBook Air', type: DeviceType.MAC, lastSeen: '5m ago', battery: 100, latitude: 51.5074, longitude: -0.1278, status: 'online' }
];

const DeviceTracker: React.FC = () => {
  const [devices, setDevices] = useState<TrackedDevice[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<TrackedDevice | null>(null);

  const getIcon = (type: DeviceType) => {
    switch (type) {
      case DeviceType.ANDROID: return <Smartphone className="w-5 h-5" />;
      case DeviceType.IOS: return <Apple className="w-5 h-5" />;
      case DeviceType.MAC:
      case DeviceType.WINDOWS: return <Monitor className="w-5 h-5" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="text-blue-500" />
          Activos Localizados
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Mapa de Dispositivos</span>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-green-600"><Wifi className="w-3 h-3"/> Online</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><WifiOff className="w-3 h-3"/> Offline</span>
            </div>
          </div>
          <div className="h-[400px] bg-slate-200 relative flex items-center justify-center overflow-hidden">
             {/* Mock Map View */}
             <div className="absolute inset-0 opacity-40">
                <img src="https://picsum.photos/1200/800?blur=5" className="w-full h-full object-cover" alt="map" />
             </div>
             {devices.map((d, i) => (
                <div 
                  key={d.id}
                  className="absolute cursor-pointer transition-transform hover:scale-110"
                  style={{ top: `${20 + (i * 20)}%`, left: `${30 + (i * 15)}%` }}
                  onClick={() => setSelectedDevice(d)}
                >
                  <div className={`p-2 rounded-full shadow-lg ${d.status === 'online' ? 'bg-blue-600' : 'bg-slate-500'} text-white`}>
                    {getIcon(d.type)}
                  </div>
                </div>
             ))}
             <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg border text-xs text-slate-600">
               Interactúa con los iconos para ver detalles del dispositivo.
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold mb-4 text-slate-700">Tus Dispositivos</h3>
          <div className="space-y-3">
            {devices.map(device => (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedDevice?.id === device.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-100 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${device.status === 'online' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    {getIcon(device.type)}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-800 text-sm">{device.name}</p>
                    <p className="text-xs text-slate-500">{device.lastSeen}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Battery className="w-4 h-4" />
                  <span className="text-xs font-semibold">{device.battery}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedDevice && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold mb-4 text-slate-700 flex items-center justify-between">
              Código de Enlace
              <button onClick={() => setSelectedDevice(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Escanea este código para transferir la información de rastreo a otro dispositivo.</p>
            <div className="flex justify-center mb-4">
              <QRCode value={`unitrace://device/${selectedDevice.id}/track`} size={180} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500">Latitud:</span>
                <span className="font-mono text-slate-700">{selectedDevice.latitude}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500">Longitud:</span>
                <span className="font-mono text-slate-700">{selectedDevice.longitude}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Activar Alerta Sonora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceTracker;
