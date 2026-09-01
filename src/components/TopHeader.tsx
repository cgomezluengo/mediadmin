import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  RefreshCw,
  Download,
  Database,
  User,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { TabKey } from '../types';

interface TopHeaderProps {
  currentTab: TabKey;
  onOpenTaskManager: () => void;
  pendingTasksCount: number;
  onExportJson: () => void;
  onSyncCloud: () => void;
  isSyncing: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const TAB_TITLES: Record<TabKey, { title: string; subtitle: string }> = {
  inicio: { title: 'Inicio / Resumen General', subtitle: 'Monitoreo de liquidaciones, débitos y automatizaciones' },
  medicos: { title: 'Padrón de Médicos', subtitle: 'Gestión de matrículas, convenios y documentación' },
  bonos: { title: 'Carga y Lotes de Bonos', subtitle: 'Ingreso rápido de órdenes con autocompletado y validación' },
  liquidaciones: { title: 'Liquidaciones Mensuales', subtitle: 'Cierre de períodos, totales por obra social y envío a facturación' },
  tesoreria: { title: 'Tesorería y Cobranzas', subtitle: 'Imputación de transferencias bancarias y control de morosos' },
  debitos: { title: 'Gestión de Débitos Médicos', subtitle: 'Auditoría, justificación con PDF y refacturación' },
  autorizaciones: { title: 'Autorizaciones en Tiempo Real', subtitle: 'Padrón en línea, validación por API y estado de trámites' },
  caja: { title: 'Caja de Médicos (Aportes)', subtitle: 'Cálculo automático de retenciones estatutarias (5%)' },
  tareas: { title: 'Lista Dinámica de Tareas', subtitle: 'Organizador de tareas con persistencia SQLite y automatizaciones' },
  configuraciones: { title: 'Configuraciones y Conexiones API', subtitle: 'Integraciones con obras sociales, reglas y backups seguros' },
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onOpenTaskManager,
  pendingTasksCount,
  onExportJson,
  onSyncCloud,
  isSyncing,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const info = TAB_TITLES[currentTab] || { title: 'MediAdmin', subtitle: 'Sistema de Gestión Médica' };

  return (
    <header className="h-16 bg-[#ffffff] border-b border-[#e3e1ea] px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Title / Breadcrumb */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-[#1a1b22] tracking-tight leading-tight">
          {info.title}
        </h1>
        <p className="text-xs text-[#454652] hidden md:block">{info.subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Quick Search */}
        <div className="relative hidden lg:block w-64">
          <Search className="w-4 h-4 text-[#757684] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Buscar paciente, médico, bono..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f4f2fc] hover:bg-[#efedf6] focus:bg-white text-[#1a1b22] rounded-lg border border-[#c5c5d4]/60 focus:border-[#24389c] focus:outline-none transition-all"
          />
        </div>

        {/* Cloud Sync Button */}
        <button
          id="btn-cloud-sync"
          onClick={onSyncCloud}
          title="Sincronizar base de datos con la nube"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#24389c] bg-[#dee0ff]/60 hover:bg-[#dee0ff] rounded-lg transition-colors border border-[#24389c]/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#24389c]' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Sync Cloud'}</span>
        </button>

        {/* Dynamic Task Manager Trigger */}
        <button
          id="btn-header-task-manager"
          onClick={onOpenTaskManager}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300 relative"
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">Tareas</span>
          {pendingTasksCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingTasksCount}
            </span>
          )}
        </button>

        {/* JSON Export Button */}
        <button
          id="btn-quick-export-json"
          onClick={onExportJson}
          title="Exportar respaldo completo en formato JSON (SQLite)"
          className="p-2 text-[#454652] hover:text-[#1a1b22] hover:bg-[#efedf6] rounded-lg transition-colors border border-[#c5c5d4]/40"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-[#454652] hover:text-[#1a1b22] hover:bg-[#efedf6] rounded-lg transition-colors relative border border-[#c5c5d4]/40"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#c5c5d4]/70 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#efedf6]">
                <span className="font-semibold text-xs text-[#1a1b22]">Notificaciones del Sistema</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-medium">3 Nuevas</span>
              </div>
              <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                <div className="p-2 bg-[#f4f2fc] rounded-lg text-xs">
                  <p className="font-medium text-[#1a1b22]">Débito recibido de OSDE</p>
                  <p className="text-[11px] text-[#454652]">Paciente #88492 requiere historia clínica.</p>
                  <span className="text-[10px] text-[#757684]">Hace 10 min</span>
                </div>
                <div className="p-2 bg-[#f4f2fc] rounded-lg text-xs">
                  <p className="font-medium text-[#1a1b22]">Transferencia OSDE acreditada</p>
                  <p className="text-[11px] text-[#454652]">$1.450.000 disponible para imputar.</p>
                  <span className="text-[10px] text-[#757684]">Hace 1 hora</span>
                </div>
                <div className="p-2 bg-[#f4f2fc] rounded-lg text-xs">
                  <p className="font-medium text-[#1a1b22]">Póliza por vencer</p>
                  <p className="text-[11px] text-[#454652]">Dra. Ana Silva (vence 30/10/2023).</p>
                  <span className="text-[10px] text-[#757684]">Hace 3 horas</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            id="btn-user-profile-toggle"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#efedf6] transition-colors border border-transparent hover:border-[#c5c5d4]/60"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"
              alt="Administradora"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#24389c]/40"
            />
            <div className="text-left hidden xl:block">
              <span className="text-xs font-bold text-[#1a1b22] block leading-none">Dra. M. Soria</span>
              <span className="text-[10px] text-[#757684] block">Admin General</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#c5c5d4]/70 p-2 z-50">
              <div className="px-3 py-2 border-b border-[#efedf6]">
                <p className="text-xs font-bold text-[#1a1b22]">Dra. Mariana Soria</p>
                <p className="text-[11px] text-[#757684]">msoria@clinicas.com.ar</p>
                <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                  Sesión Encriptada
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={onExportJson}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#1a1b22] hover:bg-[#f4f2fc] rounded flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5 text-[#24389c]" />
                  <span>Descargar Backup SQLite</span>
                </button>
                <button
                  onClick={() => alert('Sistema MediAdmin v2.4.0 (Build 2026). Todos los módulos operativos.')}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#1a1b22] hover:bg-[#f4f2fc] rounded flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#454652]" />
                  <span>Acerca del Sistema</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
