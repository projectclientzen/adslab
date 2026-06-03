'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { BrandId, DateRange, UserRole } from '@/lib/types';
import { BRANDS } from '@/lib/mockData';
import { isSupabaseAvailable } from '@/lib/supabase';

interface AppContextType {
  activeBrand:    BrandId;
  setActiveBrand: (id: BrandId) => void;
  dateRange:      DateRange;
  setDateRange:   (r: DateRange) => void;
  role:           UserRole;
  setRole:        (r: UserRole) => void;
  sidebarOpen:    boolean;
  setSidebarOpen: (v: boolean) => void;
  isLiveData:     boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeBrand, setActiveBrand] = useState<BrandId>('ngajigaes');
  const [dateRange, setDateRange]     = useState<DateRange>('7d');
  const [role, setRole]               = useState<UserRole>('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppContext.Provider value={{
      activeBrand, setActiveBrand,
      dateRange, setDateRange,
      role, setRole,
      sidebarOpen, setSidebarOpen,
      isLiveData: isSupabaseAvailable,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export function useActiveBrand() {
  const { activeBrand } = useApp();
  return BRANDS.find(b => b.id === activeBrand)!;
}
