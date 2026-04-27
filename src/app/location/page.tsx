"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-black font-sans" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.97), rgba(0,0,0,0.97)), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23333\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
      <Header messageCount={0} />
      
      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-gray-900 border-4 border-double border-red-600 rounded-lg overflow-hidden shadow-2xl shadow-red-900/30 p-8" style={{ boxShadow: 'inset 0 0 20px rgba(139,0,0,0.3), 0 0 30px rgba(139,0,0,0.2)' }}>
          <h1 className="text-4xl font-bold text-white text-center mb-6" style={{ fontFamily: 'Times New Roman, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.2)' }}>
            📍 Ubicación del Foro
          </h1>
          
          <div className="bg-black/50 border-2 border-red-700 rounded-lg p-6 mb-6" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
            <h2 className="text-2xl font-bold text-red-400 mb-4" style={{ fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              🏠 Sede Principal
            </h2>
            <p className="text-gray-300 text-lg mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
              <strong className="text-red-300">Manises, Valencia, España</strong>
            </p>
            <p className="text-gray-400" style={{ fontFamily: 'Arial, sans-serif' }}>
              El okupa rumano más legendario de la comarca. Donde nació el movimiento Guruguru.
              <br />
              <br />
              <em>C/ Olivo (Enfrente del Manisense)</em>
            </p>
            <img src="/ubicacion.png" alt="Ubicación" className="w-full h-auto rounded-lg mt-4" />
          </div>

          <div className="bg-black/50 border-2 border-red-700 rounded-lg p-6" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
            <h2 className="text-2xl font-bold text-red-400 mb-4" style={{ fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              🗺️ Cómo llegar
            </h2>
            <ul className="text-gray-300 space-y-2" style={{ fontFamily: 'Arial, sans-serif' }}>
              <li>🚗 En coche: Desde Valencia, toma la A-3 hacia Manises</li>
              <li>🚌 En autobús: Líneas 150, 151 desde Valencia</li>
              <li>✈️ En avión: Aeropuerto de Manises está al lado</li>
              <li>🚇 En metro: Línea 3 y 5 hasta la estación Manises</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="inline-block px-8 py-3 bg-gradient-to-b from-red-600 to-red-900 text-white font-bold rounded border-4 border-red-500 hover:from-red-500 hover:to-red-800 transition-all shadow-lg"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                boxShadow: '0 4px 15px rgba(139,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)'
              }}
            >
              💬 Volver al Foro
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}