import { useWindowSize } from '@/hooks/useWindowSize';

export function Footer() {
  const { isMobile } = useWindowSize();

  return (
    <div className="mt-4 text-center text-red-700 text-xs" style={{ fontFamily: 'Times New Roman, serif' }}>
      <p className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>✦ Guruguru Forum © 2000s Style • Powered by Supabase • Realtime Chat ✦</p>
    </div>
  );
}
