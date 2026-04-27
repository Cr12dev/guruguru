import { useWindowSize } from '@/hooks/useWindowSize';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function MessageInput({ value, onChange, onSend }: MessageInputProps) {
  const { isMobile } = useWindowSize();

  return (
    <div className={`${isMobile ? 'w-full' : 'flex-1'} ${isMobile ? 'flex flex-col gap-2' : 'flex gap-2'}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        placeholder="Escribe tu mensaje... Usa @ para mencionar"
        className={`${isMobile ? 'w-full' : 'flex-1'} ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3'} bg-black border-4 border-red-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-400 focus:shadow-lg transition-all`}
        style={{ 
          fontFamily: 'Arial, sans-serif',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}
      />
      <button
        onClick={onSend}
        className={`${isMobile ? 'w-full' : ''} ${isMobile ? 'px-4 py-2 text-sm' : 'px-8 py-3'} bg-gradient-to-b from-red-600 to-red-900 text-white font-bold rounded border-4 border-red-500 hover:from-red-500 hover:to-red-800 transition-all shadow-lg`}
        style={{ 
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          boxShadow: '0 4px 15px rgba(139,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)'
        }}
      >
        💬 ENVIAR
      </button>
    </div>
  );
}
