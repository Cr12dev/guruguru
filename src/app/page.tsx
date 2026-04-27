'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Message, Avatar, UserAvatar } from '@/types';
import { AVATARS, getRandomAvatar, getAvatarsByType } from '@/lib/avatars';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<UserAvatar>(() => ({
    avatar: getRandomAvatar(),
    uniqueNumber: Math.floor(Math.random() * 9000000) + 1000000,
  }));
  const [userId, setUserId] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [avatarFilter, setAvatarFilter] = useState<'all' | 'videojuego' | 'coche' | 'actor'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, isDesktop } = useWindowSize();

  // Initialize localStorage-dependent state on client side
  useEffect(() => {
    setMounted(true);
    
    // Load saved avatar
    const savedAvatar = localStorage.getItem('guruguru_avatar');
    if (savedAvatar) {
      try {
        const parsed = JSON.parse(savedAvatar);
        // Check if it's in the old format (direct Avatar) or new format (UserAvatar)
        if (parsed.avatar && parsed.uniqueNumber) {
          setSelectedAvatar(parsed);
        } else {
          // Old format, convert to new format
          const uniqueNumber = Math.floor(Math.random() * 9000000) + 1000000;
          const userAvatar = { avatar: parsed, uniqueNumber };
          localStorage.setItem('guruguru_avatar', JSON.stringify(userAvatar));
          setSelectedAvatar(userAvatar);
        }
      } catch (e) {
        // Invalid data, generate new
        const random = getRandomAvatar();
        const uniqueNumber = Math.floor(Math.random() * 9000000) + 1000000;
        const userAvatar = { avatar: random, uniqueNumber };
        localStorage.setItem('guruguru_avatar', JSON.stringify(userAvatar));
        setSelectedAvatar(userAvatar);
      }
    } else {
      const random = getRandomAvatar();
      const uniqueNumber = Math.floor(Math.random() * 9000000) + 1000000;
      const userAvatar = { avatar: random, uniqueNumber };
      localStorage.setItem('guruguru_avatar', JSON.stringify(userAvatar));
      setSelectedAvatar(userAvatar);
    }
    
    // Load or generate user ID
    let id = localStorage.getItem('guruguru_user_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('guruguru_user_id', id);
    }
    setUserId(id);
  }, []);

  // Load initial messages
  useEffect(() => {
    if (mounted) {
      loadMessages();
    }
  }, [mounted]);

  // Subscribe to new messages
  useEffect(() => {
    if (!mounted) return;
    
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mounted]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        content: newMessage,
        avatar_name: `${selectedAvatar.avatar.name}${selectedAvatar.uniqueNumber}`,
        avatar_type: selectedAvatar.avatar.type,
        user_id: userId,
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  const handleAvatarChange = (avatar: Avatar) => {
    const newUniqueNumber = Math.floor(Math.random() * 9000000) + 1000000;
    const userAvatar = { avatar, uniqueNumber: newUniqueNumber };
    setSelectedAvatar(userAvatar);
    localStorage.setItem('guruguru_avatar', JSON.stringify(userAvatar));
    setShowAvatarDropdown(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatarFromName = (avatarName: string): Avatar => {
    // Extract base name (remove numbers)
    const baseName = avatarName.replace(/\d+$/, '');
    return AVATARS.find(a => a.name === baseName) || { name: 'Unknown', emoji: '👤', type: 'videojuego' };
  };

  const parseMentions = (text: string): React.ReactNode[] => {
    // Split by @ mentions
    const parts = text.split(/(@\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="font-bold underline text-red-300">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const filteredAvatars = avatarFilter === 'all' 
    ? AVATARS 
    : getAvatarsByType(avatarFilter);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.97), rgba(0,0,0,0.97)), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23333\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
      {/* Header */}
      <header className="bg-gradient-to-b from-red-800 via-red-700 to-red-900 border-b-4 border-red-500 shadow-lg shadow-red-900/50 p-4" style={{ borderBottom: '3px solid #8b0000', borderTop: '3px solid #ff4444' }}>
        <div className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto`}>
          <h1 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} font-bold text-white text-center tracking-wider`} style={{ fontFamily: 'Times New Roman, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.2)' }}>
            ✦ GURUGURU FORUM ✦
          </h1>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-200 text-center mt-2 font-semibold`} style={{ fontFamily: 'Arial, sans-serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            El foro del okupa rumano de Manises • Estilo 2000s
          </p>
          <div className={`flex ${isMobile ? 'flex-col gap-1' : 'justify-center gap-4'} mt-3 ${isMobile ? 'text-[10px]' : 'text-xs'} text-red-300`}>
            <span>📜 {messages.length} mensajes</span>
            <span>👥 Online</span>
            <span>⚡ Realtime</span>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto ${isMobile ? 'p-2' : 'p-4'}`}>
        <div className="bg-gray-900 border-4 border-double border-red-600 rounded-lg overflow-hidden shadow-2xl shadow-red-900/30" style={{ boxShadow: 'inset 0 0 20px rgba(139,0,0,0.3), 0 0 30px rgba(139,0,0,0.2)' }}>
          {/* Messages Area */}
          <div className={`${isMobile ? 'h-[50vh]' : 'h-[60vh]'} overflow-y-auto ${isMobile ? 'p-2' : 'p-4'} space-y-4 bg-black`} style={{ backgroundImage: 'linear-gradient(rgba(20,0,0,0.3), rgba(0,0,0,0.5))' }}>
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-red-800 rounded-lg">
                <p className={`${isMobile ? 'text-base' : 'text-lg'}`} style={{ fontFamily: 'Times New Roman, serif' }}>📭 No hay mensajes aún</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>¡Sé el primero en escribir!</p>
              </div>
            )}
            {messages.map((message) => {
              const avatar = getAvatarFromName(message.avatar_name);
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isMobile ? 'p-2' : 'p-3'} rounded-lg ${
                    message.user_id === userId ? 'flex-row-reverse bg-red-950/30' : 'flex-row bg-gray-900/50'
                  }`}
                  style={{ border: '1px solid rgba(139,0,0,0.3)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}
                >
                  <div className="flex-shrink-0">
                    <div className={`${isMobile ? 'w-10 h-10 text-2xl border-3' : isTablet ? 'w-12 h-12 text-2xl border-3' : 'w-14 h-14 text-3xl border-4'} bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center border-red-500 shadow-lg`} style={{ boxShadow: '0 0 15px rgba(255,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)' }}>
                      {avatar.emoji}
                    </div>
                  </div>
                  <div
                    className={`flex flex-col ${isMobile ? 'max-w-[80%]' : 'max-w-[70%]'} ${
                      message.user_id === userId ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-400 mb-1 font-bold uppercase tracking-wide`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                      {message.avatar_name} • {formatTime(message.created_at)}
                    </div>
                    <div
                      className={`${isMobile ? 'p-2 text-sm' : 'p-4'} rounded-lg border-2 ${
                        message.user_id === userId
                          ? 'bg-gradient-to-br from-red-800 to-red-950 border-red-500 text-white'
                          : 'bg-gradient-to-br from-gray-800 to-gray-900 border-red-700 text-gray-100'
                      }`}
                      style={{ 
                        fontFamily: 'Arial, sans-serif',
                        boxShadow: message.user_id === userId 
                          ? '0 4px 15px rgba(139,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.1)' 
                          : '0 4px 15px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.05)'
                      }}
                    >
                      {parseMentions(message.content)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`${isMobile ? 'p-2' : 'p-4'} bg-gradient-to-b from-gray-900 to-black border-t-4 border-red-600`} style={{ borderTop: '3px solid #8b0000', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
            <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-3'}`}>
              {/* Avatar Selector */}
              <div className={`relative ${isMobile ? 'w-full flex justify-center' : ''}`}>
                <button
                  onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                  className={`${isMobile ? 'w-12 h-12 text-2xl border-3' : isTablet ? 'w-13 h-13 text-2xl border-3' : 'w-14 h-14 text-3xl border-4'} bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center border-red-500 hover:from-red-600 hover:to-red-800 transition-all shadow-lg`}
                  style={{ boxShadow: '0 0 20px rgba(255,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)' }}
                >
                  {selectedAvatar.avatar.emoji}
                </button>
                
                {showAvatarDropdown && (
                  <div className={`${isMobile ? 'absolute bottom-14 left-1/2 -translate-x-1/2 w-64' : 'absolute bottom-16 left-0 w-72'} bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-double border-red-600 rounded-lg ${isMobile ? 'p-3' : 'p-4'} z-10 shadow-2xl`} style={{ boxShadow: '0 0 30px rgba(139,0,0,0.5)' }}>
                    {/* Filter Buttons */}
                    <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'} mb-3 flex-wrap`}>
                      <button
                        onClick={() => setAvatarFilter('all')}
                        className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-xs'} font-bold rounded border-2 ${
                          avatarFilter === 'all' 
                            ? 'bg-red-600 border-red-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => setAvatarFilter('videojuego')}
                        className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-xs'} font-bold rounded border-2 ${
                          avatarFilter === 'videojuego' 
                            ? 'bg-red-600 border-red-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        🎮 Videojuegos
                      </button>
                      <button
                        onClick={() => setAvatarFilter('coche')}
                        className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-xs'} font-bold rounded border-2 ${
                          avatarFilter === 'coche' 
                            ? 'bg-red-600 border-red-400 text-white' 
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        🏎️ Coches
                      </button>
                      <button
                        onClick={() => setAvatarFilter('actor')}
                        className={`${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-xs'} font-bold rounded border-2 ${
                          avatarFilter === 'actor' 
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
                          onClick={() => handleAvatarChange(avatar)}
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

              {/* Message Input */}
              <div className={`${isMobile ? 'w-full' : 'flex-1'} ${isMobile ? 'flex flex-col gap-2' : 'flex gap-2'}`}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe tu mensaje... Usa @ para mencionar"
                  className={`${isMobile ? 'w-full' : 'flex-1'} ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3'} bg-black border-4 border-red-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-400 focus:shadow-lg transition-all`}
                  style={{ 
                    fontFamily: 'Arial, sans-serif',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                />
                <button
                  onClick={sendMessage}
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
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center text-red-700 text-xs" style={{ fontFamily: 'Times New Roman, serif' }}>
          <p className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>✦ Guruguru Forum © 2000s Style • Powered by Supabase • Realtime Chat ✦</p>
        </div>
      </main>
    </div>
  );
}
