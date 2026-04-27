import { Avatar } from '@/types';

export const AVATARS: Avatar[] = [
  // Videojuegos
  { name: 'Mario', emoji: '🍄', type: 'videojuego' },
  { name: 'Luigi', emoji: '💚', type: 'videojuego' },
  { name: 'Pikachu', emoji: '⚡', type: 'videojuego' },
  { name: 'Link', emoji: '🗡️', type: 'videojuego' },
  { name: 'Sonic', emoji: '💨', type: 'videojuego' },
  { name: 'Master Chief', emoji: '🎖️', type: 'videojuego' },
  { name: 'Kratos', emoji: '⚔️', type: 'videojuego' },
  { name: 'Lara Croft', emoji: '🔫', type: 'videojuego' },
  { name: 'Cloud', emoji: '⚔️', type: 'videojuego' },
  { name: 'Samus', emoji: '🚀', type: 'videojuego' },
  
  // Coches
  { name: 'Ferrari', emoji: '🏎️', type: 'coche' },
  { name: 'Lamborghini', emoji: '🏎️', type: 'coche' },
  { name: 'Porsche', emoji: '🚗', type: 'coche' },
  { name: 'Mustang', emoji: '🐎', type: 'coche' },
  { name: 'Corvette', emoji: '🏁', type: 'coche' },
  { name: 'Bugatti', emoji: '💨', type: 'coche' },
  { name: 'Tesla', emoji: '⚡', type: 'coche' },
  { name: 'BMW', emoji: '🔵', type: 'coche' },
  { name: 'Mercedes', emoji: '⭐', type: 'coche' },
  { name: 'Audi', emoji: '⭕', type: 'coche' },
  
  // Actores
  { name: 'Brad Pitt', emoji: '🎬', type: 'actor' },
  { name: 'Leonardo DiCaprio', emoji: '🎭', type: 'actor' },
  { name: 'Tom Cruise', emoji: '🎪', type: 'actor' },
  { name: 'Johnny Depp', emoji: '🎩', type: 'actor' },
  { name: 'Robert De Niro', emoji: '🎬', type: 'actor' },
  { name: 'Al Pacino', emoji: '🎭', type: 'actor' },
  { name: 'Morgan Freeman', emoji: '🎬', type: 'actor' },
  { name: 'Denzel Washington', emoji: '🎭', type: 'actor' },
  { name: 'Scarlett Johansson', emoji: '🌟', type: 'actor' },
  { name: 'Angelina Jolie', emoji: '💫', type: 'actor' },
];

export function getRandomAvatar(): Avatar {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex];
}

export function getAvatarsByType(type: 'videojuego' | 'coche' | 'actor'): Avatar[] {
  return AVATARS.filter(avatar => avatar.type === type);
}
