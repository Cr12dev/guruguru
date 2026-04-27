import { Avatar, UserAvatar } from '@/types';
import { AVATARS, getAvatarsByType } from '@/lib/avatars';
import { useWindowSize } from '@/hooks/useWindowSize';

interface AvatarSelectorProps {
  selectedAvatar: UserAvatar;
  showDropdown: boolean;
  filter: 'all' | 'videojuego' | 'coche' | 'actor';
  isOnline: boolean;
  onToggle: () => void;
  onFilterChange: (filter: 'all' | 'videojuego' | 'coche' | 'actor') => void;
  onAvatarChange: (avatar: Avatar) => void;
}

export function AvatarSelector({
  selectedAvatar,
  showDropdown,
  filter,
  isOnline,
  onToggle,
  onFilterChange,
  onAvatarChange,
}: AvatarSelectorProps) {
  const { isMobile, isTablet } = useWindowSize();
  const filteredAvatars = filter === 'all' ? AVATARS : getAvatarsByType(filter);

  return (
    <div className={`relative ${isMobile ? 'w-full flex justify-center' : ''}`}>
      <button
        onClick={onToggle}
        className={`${isMobile ? 'w-12 h-12 text-2xl border-3' : isTablet ? 'w-13 h-13 text-2xl border-3' : 'w-14 h-14 text-3xl border-4'} bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center border-red-500 hover:from-red-600 hover:to-red-800 transition-all shadow-lg`}
        style={{ boxShadow: '0 0 20px rgba(255,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)' }}
      >
        {selectedAvatar.avatar.emoji}
      </button>
      {/* Online Status Indicator */}
      <div
        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${
          isOnline ? 'bg-green-500' : 'bg-gray-500'
        }`}
        style={{ 
          boxShadow: isOnline ? '0 0 10px rgba(34, 197, 94, 0.8)' : 'none',
          transform: 'translate(25%, 25%)'
        }}
      />
      
      {showDropdown && (
        <div className={`${isMobile ? 'absolute bottom-14 left-1/2 -translate-x-1/2 w-64' : 'absolute bottom-16 left-0 w-72'} bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-double border-red-600 rounded-lg ${isMobile ? 'p-3' : 'p-4'} z-10 shadow-2xl`} style={{ boxShadow: '0 0 30px rgba(139,0,0,0.5)' }}>
          {/* Filter Buttons */}
          <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'} mb-3 flex-wrap`}>
            <button
              onClick={() => onFilterChange('all')}
              className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-xs'} font-bold rounded border-2 ${
                filter === 'all' 
                  ? 'bg-red-600 border-red-400 text-white' 
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              Todos
            </button>
            <button
              onClick={() => onFilterChange('videojuego')}
              className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-xs'} font-bold rounded border-2 ${
                filter === 'videojuego' 
                  ? 'bg-red-600 border-red-400 text-white' 
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              🎮 Videojuegos
            </button>
            <button
              onClick={() => onFilterChange('coche')}
              className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-xs'} font-bold rounded border-2 ${
                filter === 'coche' 
                  ? 'bg-red-600 border-red-400 text-white' 
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              🏎️ Coches
            </button>
            <button
              onClick={() => onFilterChange('actor')}
              className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-xs'} font-bold rounded border-2 ${
                filter === 'actor' 
                  ? 'bg-red-600 border-red-400 text-white' 
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              🎬 Actores
            </button>
          </div>
          
          {/* Avatar Grid */}
          <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-5'} gap-2 max-h-48 overflow-y-auto p-2 bg-black/50 rounded border border-red-900`}>
            {filteredAvatars.map((avatar) => (
              <button
                key={avatar.name}
                onClick={() => onAvatarChange(avatar)}
                className={`${isMobile ? 'w-10 h-10 text-xl' : 'w-12 h-12 text-2xl'} rounded flex items-center justify-center hover:scale-110 transition-all border-2 ${
                  selectedAvatar.avatar.name === avatar.name 
                    ? 'bg-red-600 border-red-400 shadow-lg' 
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
                style={{ boxShadow: selectedAvatar.avatar.name === avatar.name ? '0 0 15px rgba(255,0,0,0.5)' : 'none' }}
                title={avatar.name}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
