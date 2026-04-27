import { Message, Avatar, UserPresence } from '@/types';
import { useWindowSize } from '@/hooks/useWindowSize';

interface MessageItemProps {
  message: Message;
  userId: string;
  userPresence: { [key: string]: UserPresence };
  isEditing: boolean;
  editContent: string;
  menuOpen: boolean;
  isOwnMessage: boolean;
  avatar: Avatar;
  onDoubleClick: (messageId: string) => void;
  onStartLongPress: (messageId: string) => void;
  onCancelLongPress: () => void;
  onEditContentChange: (content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onMenuAction: (action: string, message: Message) => void;
  parseMentions: (text: string) => React.ReactNode[];
  formatTime: (dateString: string) => string;
}

export function MessageItem({
  message,
  userId,
  userPresence,
  isEditing,
  editContent,
  menuOpen,
  isOwnMessage,
  avatar,
  onDoubleClick,
  onStartLongPress,
  onCancelLongPress,
  onEditContentChange,
  onSaveEdit,
  onCancelEdit,
  onMenuAction,
  parseMentions,
  formatTime,
}: MessageItemProps) {
  const { isMobile, isTablet } = useWindowSize();
  const userOnline = userPresence[message.user_id]?.online || false;

  return (
    <div
      className={`flex gap-3 ${isMobile ? 'p-2' : 'p-3'} rounded-lg relative ${
        isOwnMessage ? 'flex-row-reverse bg-red-950/30' : 'flex-row bg-gray-900/50'
      } ${message.is_pinned ? 'border-2 border-yellow-500' : ''}`}
      style={{ 
        border: message.is_pinned ? '2px solid #ffd700' : '1px solid rgba(139,0,0,0.3)', 
        boxShadow: message.is_pinned 
          ? '0 0 20px rgba(255,215,0,0.3), inset 0 1px 3px rgba(0,0,0,0.3)' 
          : 'inset 0 1px 3px rgba(0,0,0,0.3)'
      }}
      onClick={() => isOwnMessage && onDoubleClick(message.id)}
      onMouseDown={() => !isMobile && isOwnMessage && onStartLongPress(message.id)}
      onMouseUp={onCancelLongPress}
      onMouseLeave={onCancelLongPress}
    >
      <div className="flex-shrink-0 relative">
        <div className={`${isMobile ? 'w-10 h-10 text-2xl border-3' : isTablet ? 'w-12 h-12 text-2xl border-3' : 'w-14 h-14 text-3xl border-4'} bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center border-red-500 shadow-lg`} style={{ boxShadow: '0 0 15px rgba(255,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)' }}>
          {avatar.emoji}
        </div>
        {/* Online Status Indicator for other users */}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
            userOnline ? 'bg-green-500' : 'bg-gray-500'
          }`}
          style={{ 
            boxShadow: userOnline ? '0 0 8px rgba(34, 197, 94, 0.8)' : 'none',
            transform: 'translate(25%, 25%)'
          }}
        />
      </div>
      <div
        className={`flex flex-col ${isMobile ? 'max-w-[80%]' : 'max-w-[70%]'} ${
          isOwnMessage ? 'items-end' : 'items-start'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-400 mb-1 font-bold uppercase tracking-wide`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {message.avatar_name} • {formatTime(message.created_at)}
            {message.is_pinned && <span className="text-yellow-400"> 📌</span>}
            {message.updated_at && <span className="text-gray-500">(editado)</span>}
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={editContent}
              onChange={(e) => onEditContentChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSaveEdit()}
              className={`flex-1 ${isMobile ? 'px-2 py-1 text-sm' : 'px-3 py-2'} bg-black border-2 border-red-600 rounded text-white text-sm focus:outline-none focus:border-red-400`}
              style={{ fontFamily: 'Arial, sans-serif' }}
            />
            <button
              onClick={onSaveEdit}
              className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-green-600 text-white rounded border border-green-400 hover:bg-green-500`}
            >
              ✓
            </button>
            <button
              onClick={onCancelEdit}
              className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-gray-600 text-white rounded border border-gray-400 hover:bg-gray-500`}
            >
              ✗
            </button>
          </div>
        ) : (
          <div
            className={`${isMobile ? 'p-2 text-sm' : 'p-4'} rounded-lg border-2 ${
              isOwnMessage
                ? 'bg-gradient-to-br from-red-800 to-red-950 border-red-500 text-white'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 border-red-700 text-gray-100'
            }`}
            style={{ 
              fontFamily: 'Arial, sans-serif',
              boxShadow: isOwnMessage 
                ? '0 4px 15px rgba(139,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.1)' 
                : '0 4px 15px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.05)'
            }}
          >
            {parseMentions(message.content)}
          </div>
        )}
        
        {menuOpen && isOwnMessage && !isEditing && (
          <div className={`absolute ${isOwnMessage ? 'right-0' : 'left-0'} top-0 mt-8 bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-double border-red-600 rounded-lg p-2 z-20 shadow-2xl`} style={{ boxShadow: '0 0 30px rgba(139,0,0,0.5)' }}>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onMenuAction('pin', message)}
                className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} rounded border ${
                  message.is_pinned 
                    ? 'bg-yellow-600 border-yellow-400 text-white' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                } text-left`}
              >
                {message.is_pinned ? '📌 Desfijar' : '📌 Fijar'}
              </button>
              <button
                onClick={() => onMenuAction('edit', message)}
                className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} rounded border bg-blue-600 border-blue-400 text-white hover:bg-blue-500 text-left`}
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onMenuAction('delete', message)}
                className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} rounded border bg-red-600 border-red-400 text-white hover:bg-red-500 text-left`}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
