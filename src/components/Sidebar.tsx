import React from 'react';
import {
  Home,
  Users,
  FileSpreadsheet,
  FileCheck2,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Settings,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { TabKey } from '../types';

interface SidebarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  pendingDebitsCount: number;
  pendingTasksCount: number;
  authorizationsInTransitCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingDebitsCount,
  pendingTasksCount,
  authorizationsInTransitCount,
}) => {
  const navItems = [
    { key: 'inicio' as TabKey, label: 'Inicio', icon: Home },
    { key: 'medicos' as TabKey, label: 'Médicos', icon: Users },
    { key: 'bonos' as TabKey, label: 'Carga de Bonos', icon: FileSpreadsheet },
    { key: 'liquidaciones' as TabKey, label: 'Liquidaciones', icon: FileCheck2 },
    { key: 'tesoreria' as TabKey, label: 'Tesorería', icon: DollarSign },
    {
      key: 'debitos' as TabKey,
      label: 'Débitos',
      icon: AlertTriangle,
      badge: pendingDebitsCount > 0 ? pendingDebitsCount : undefined,
      badgeColor: 'bg-amber-400 text-slate-900',
    },
    {
      key: 'autorizaciones' as TabKey,
      label: 'Autorizaciones',
      icon: ShieldCheck,
      badge: authorizationsInTransitCount > 0 ? authorizationsInTransitCount : undefined,
      badgeColor: 'bg-indigo-400 text-white',
    },
    { key: 'caja' as TabKey, label: 'Caja de Médicos', icon: Building2 },
    {
      key: 'tareas' as TabKey,
      label: 'Lista de Tareas',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-emerald-400 text-slate-950 font-bold',
    },
    { key: 'configuraciones' as TabKey, label: 'Configuraciones', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1e2b6e] text-white flex flex-col shrink-0 min-h-screen border-r border-[#2d3d8a] shadow-xl z-20">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-[#2d3d8a]/60 bg-[#19245f]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-white text-xl">local_hospital</span>
        </div>
        <div>
          <span className="font-bold tracking-tight text-lg leading-none block text-white">MediAdmin</span>
          <span className="text-[11px] text-indigo-200/80 font-medium tracking-wide">Gestión Médica</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-indigo-300/60">
          Módulos Principales
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;
          return (
            <button
              id={`nav-tab-${item.key}`}
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-[#2f42a0] text-white shadow-sm font-semibold relative overflow-hidden'
                  : 'text-indigo-100/80 hover:bg-[#253580] hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-300 rounded-r-full" />
              )}
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-indigo-200' : 'text-indigo-300/70'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold shadow-xs ${
                    item.badgeColor || 'bg-indigo-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Database / Quick Sync Footer Widget */}
      <div className="p-3.5 border-t border-[#2d3d8a]/60 bg-[#162054]">
        <div className="p-3 bg-[#1e2b6e]/80 rounded-xl border border-indigo-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-indigo-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SQLite & Cloud</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
              Sync Activo
            </span>
          </div>
          <p className="text-[11px] text-indigo-300/70 leading-tight">
            Persistencia local garantizada y encriptación end-to-end activa.
          </p>
        </div>
      </div>
    </aside>
  );
};
