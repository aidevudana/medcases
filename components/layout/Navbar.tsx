'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, BookOpen, Info, Home } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const [q, setQ] = useState('');

  const navLinks = [
    { href: '/',        label: 'Home',    icon: Home },
    { href: '/about',   label: 'About',   icon: Info },
  ];

  return (
    <nav style={{ background: '#0E2440', borderBottom: '3px solid #E39B2E' }}
      className="sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: '#132C55', border: '1px solid #1E4278' }}>
              <span className="font-bold text-base leading-none" style={{ color: '#E39B2E', fontFamily: 'Space Grotesk' }}>M</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
                Medicine Kuppiya
              </div>
              <div className="text-xs leading-tight" style={{ color: '#7A94B8', fontFamily: 'IBM Plex Mono' }}>
                13th Batch · RUSL
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xs mx-4 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#7A94B8' }} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && q.trim()) { router.push(`/?q=${encodeURIComponent(q.trim())}`); } }}
              placeholder="Search topics…"
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg outline-none text-white placeholder:text-gray-500 focus:ring-1"
              style={{ background: '#132C55', border: '1px solid #1E4278', fontFamily: 'Inter' }}
            />
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = path === href;
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={{
                    color: active ? '#E39B2E' : '#9AB0CC',
                    background: active ? '#132C55' : 'transparent',
                    fontFamily: 'Space Grotesk',
                    fontWeight: active ? 600 : 400,
                  }}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
