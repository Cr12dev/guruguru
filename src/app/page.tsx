'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Message, Avatar, UserAvatar, UserPresence } from '@/types';
import { AVATARS, getRandomAvatar, getAvatarsByType } from '@/lib/avatars';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Header } from '@/components/Header';
import { MessageItem } from '@/components/MessageItem';
import { AvatarSelector } from '@/components/AvatarSelector';
import { MessageInput } from '@/components/MessageInput';
import { Footer } from '@/components/Footer';

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
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  const [userPresence, setUserPresence] = useState<{ [key: string]: UserPresence }>({});
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef<{ [key: string]: number }>({});
  const clickTimerRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
  const presenceUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useWindowSize();
  const isOnline = useOnlineStatus();

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

  // Handle user presence
  useEffect(() => {
    if (!mounted || !userId) return;

    // Subscribe to presence changes
    const channel = supabase
      .channel('user_presence')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_presence',
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const presence = payload.new as UserPresence;
          setUserPresence(prev => ({
            ...prev,
            [presence.user_id]: presence
          }));
        } else if (payload.eventType === 'DELETE') {
          const presence = payload.old as UserPresence;
          setUserPresence(prev => {
            const updated = { ...prev };
            delete updated[presence.user_id];
            return updated;
          });
        }
      })
      .subscribe();

    // Update own presence periodically
    const updateOwnPresence = async () => {
      if (!isOnline) return;
      
      await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          online: true,
          last_seen: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });
    };

    // Initial presence update
    updateOwnPresence();

    // Update presence every 30 seconds
    presenceUpdateIntervalRef.current = setInterval(updateOwnPresence, 30000);

    // Set offline when unmounting
    const setOffline = async () => {
      await supabase
        .from('user_presence')
        .update({ online: false, last_seen: new Date().toISOString() })
        .eq('user_id', userId);
    };

    window.addEventListener('beforeunload', setOffline);

    return () => {
      channel.unsubscribe();
      if (presenceUpdateIntervalRef.current) {
        clearInterval(presenceUpdateIntervalRef.current);
      }
      window.removeEventListener('beforeunload', setOffline);
      setOffline();
    };
  }, [mounted, userId, isOnline]);

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

  const togglePinMessage = async (messageId: string, currentPinned: boolean) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_pinned: !currentPinned })
      .eq('id', messageId);

    if (error) {
      console.error('Error pinning message:', error);
    }
  };

  const startEditMessage = (message: Message) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const saveEditMessage = async () => {
    if (!editingMessage || !editContent.trim()) return;

    const { error } = await supabase
      .from('messages')
      .update({ 
        content: editContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingMessage);

    if (error) {
      console.error('Error editing message:', error);
    } else {
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const cancelEditMessage = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) return;

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
    }
    setMessageMenuOpen(null);
  };

  const handleLongPress = (messageId: string) => {
    setMessageMenuOpen(messageId);
  };

  const handleMenuAction = (action: string, message: Message) => {
    setMessageMenuOpen(null);
    switch (action) {
      case 'pin':
        togglePinMessage(message.id, message.is_pinned);
        break;
      case 'edit':
        startEditMessage(message);
        break;
      case 'delete':
        deleteMessage(message.id);
        break;
    }
  };

  const startLongPress = (messageId: string) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = setTimeout(() => {
      handleLongPress(messageId);
    }, 500);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleDoubleClick = (messageId: string) => {
    if (!isMobile) return;
    
    const currentCount = (clickCountRef.current[messageId] || 0) + 1;
    clickCountRef.current[messageId] = currentCount;
    
    if (clickTimerRef.current[messageId]) {
      clearTimeout(clickTimerRef.current[messageId]!);
    }
    
    if (currentCount === 2) {
      handleLongPress(messageId);
      clickCountRef.current[messageId] = 0;
    } else {
      clickTimerRef.current[messageId] = setTimeout(() => {
        clickCountRef.current[messageId] = 0;
      }, 300);
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

  // Sort messages: pinned first, then by date
  const sortedMessages = [...messages].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.97), rgba(0,0,0,0.97)), url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23333\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
      <Header messageCount={messages.length} />

      <main className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto ${isMobile ? 'p-2' : 'p-4'}`}>
        <div className="bg-gray-900 border-4 border-double border-red-600 rounded-lg overflow-hidden shadow-2xl shadow-red-900/30" style={{ boxShadow: 'inset 0 0 20px rgba(139,0,0,0.3), 0 0 30px rgba(139,0,0,0.2)' }}>
          <div className={`${isMobile ? 'h-[50vh]' : 'h-[60vh]'} overflow-y-auto ${isMobile ? 'p-2' : 'p-4'} space-y-4 bg-black`} style={{ backgroundImage: 'linear-gradient(rgba(20,0,0,0.3), rgba(0,0,0,0.5))' }}>
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-red-800 rounded-lg">
                <p className={`${isMobile ? 'text-base' : 'text-lg'}`} style={{ fontFamily: 'Times New Roman, serif' }}>📭 No hay mensajes aún</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>¡Sé el primero en escribir!</p>
              </div>
            )}
            {sortedMessages.map((message) => {
              const avatar = getAvatarFromName(message.avatar_name);
              const isOwnMessage = message.user_id === userId;
              const isEditing = editingMessage === message.id;
              const menuOpen = messageMenuOpen === message.id;
              
              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  userId={userId}
                  userPresence={userPresence}
                  isEditing={isEditing}
                  editContent={editContent}
                  menuOpen={menuOpen}
                  isOwnMessage={isOwnMessage}
                  avatar={avatar}
                  onDoubleClick={handleDoubleClick}
                  onStartLongPress={startLongPress}
                  onCancelLongPress={cancelLongPress}
                  onEditContentChange={setEditContent}
                  onSaveEdit={saveEditMessage}
                  onCancelEdit={cancelEditMessage}
                  onMenuAction={handleMenuAction}
                  parseMentions={parseMentions}
                  formatTime={formatTime}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className={`${isMobile ? 'p-2' : 'p-4'} bg-gradient-to-b from-gray-900 to-black border-t-4 border-red-600`} style={{ borderTop: '3px solid #8b0000', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
            <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-3'}`}>
              <AvatarSelector
                selectedAvatar={selectedAvatar}
                showDropdown={showAvatarDropdown}
                filter={avatarFilter}
                isOnline={isOnline}
                onToggle={() => setShowAvatarDropdown(!showAvatarDropdown)}
                onFilterChange={setAvatarFilter}
                onAvatarChange={handleAvatarChange}
              />
              <MessageInput
                value={newMessage}
                onChange={setNewMessage}
                onSend={sendMessage}
              />
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
}
