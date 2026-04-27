import { useWindowSize } from '@/hooks/useWindowSize';

interface HeaderProps {
  messageCount: number;
}

export function Header({ messageCount }: HeaderProps) {
  const { isMobile, isTablet } = useWindowSize();

  return (
    <header className="bg-gradient-to-b from-red-800 via-red-700 to-red-900 border-b-4 border-red-500 shadow-lg shadow-red-900/50 p-4" style={{ borderBottom: '3px solid #8b0000', borderTop: '3px solid #ff4444' }}>
      <div className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto`}>
        <h1 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} font-bold text-white text-center tracking-wider`} style={{ fontFamily: 'Times New Roman, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.2)' }}>
          ✦ GURUGURU FORUM ✦
        </h1>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-200 text-center mt-2 font-semibold`} style={{ fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          El foro del okupa rumano de Manises • Estilo 2000s
        </p>
        <div className={`flex ${isMobile ? 'flex-col gap-1' : 'justify-center gap-4'} mt-3 ${isMobile ? 'text-[10px]' : 'text-xs'} text-red-300`}>
          <span>📜 {messageCount} mensajes</span>
          <span>👥 Online</span>
          <span>⚡ Realtime</span>
          <a href="/location" className="hover:underline">📍 Ubicación</a>
        </div>
      </div>
    </header>
  );
}
