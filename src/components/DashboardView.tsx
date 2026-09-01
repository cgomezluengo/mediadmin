import React from 'react';
import {
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  Plus,
  CheckSquare,
} from 'lucide-react';
import { Doctor, TaskItem, AutomationLog, TabKey } from '../types';

interface DashboardViewProps {
  doctors: Doctor[];
  tasks: TaskItem[];
  logs: AutomationLog[];
  onNavigate: (tab: TabKey) => void;
  onOpenDoctor: (doc: Doctor) => void;
  onToggleTask: (taskId: string) => void;
  onOpenNewTaskModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  doctors,
  tasks,
  logs,
  onNavigate,
  onOpenDoctor,
  onToggleTask,
  onOpenNewTaskModal,
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1e2b6e] via-[#24389c] to-[#3f51b5] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Panel de Control Central
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Bienvenido al Sistema de Gestión Médica</h2>
          <p className="text-xs text-indigo-100/90 mt-1 max-w-2xl">
            Monitoreo en tiempo real de liquidaciones, débitos, autorizaciones y caja de médicos con persistencia local y sincronización en la nube.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('bonos')}
            className="px-4 py-2 bg-white text-[#24389c] hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Cargar Bonos
          </button>
          <button
            onClick={() => onNavigate('liquidaciones')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/20 transition-colors"
          >
            Ver Liquidaciones
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div
          onClick={() => onNavigate('liquidaciones')}
          className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 shadow-xs hover:border-[#24389c] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#454652]">Total Liquidado Este Mes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1a1b22] font-tabular">$4.250.000</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +12%
            </span>
          </div>
          <p className="text-[11px] text-[#757684] mt-1">1,452 prácticas procesadas</p>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onNavigate('bonos')}
          className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 shadow-xs hover:border-[#24389c] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#454652]">Bonos Pendientes</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#24389c] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1a1b22] font-tabular">142</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              4 Lotes
            </span>
          </div>
          <p className="text-[11px] text-[#757684] mt-1">En espera de cierre mensual</p>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onNavigate('debitos')}
          className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 shadow-xs hover:border-[#24389c] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#454652]">Débitos a Auditar</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1a1b22] font-tabular">28</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              $340.000
            </span>
          </div>
          <p className="text-[11px] text-[#757684] mt-1">Requiere justificación médica</p>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => onNavigate('autorizaciones')}
          className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 shadow-xs hover:border-[#24389c] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#454652]">Autorizaciones en Trámite</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1a1b22] font-tabular">356</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              98% Auto
            </span>
          </div>
          <p className="text-[11px] text-[#757684] mt-1">Conectadas por API en tiempo real</p>
        </div>
      </div>

      {/* Main Grid: Vencimientos & Automatizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Vencimientos Próximos de Documentación */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
            <div>
              <h3 className="text-sm font-bold text-[#1a1b22] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#24389c]" />
                Vencimientos Próximos de Documentación
              </h3>
              <p className="text-xs text-[#757684]">Médicos con pólizas o matrículas en revisión</p>
            </div>
            <button
              onClick={() => onNavigate('medicos')}
              className="text-xs font-semibold text-[#24389c] hover:underline flex items-center gap-1"
            >
              Ver todos los médicos
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#757684] border-b border-[#efedf6] uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">Médico</th>
                  <th className="py-2.5 px-3">Especialidad</th>
                  <th className="py-2.5 px-3">Documento</th>
                  <th className="py-2.5 px-3">Vencimiento</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efedf6]">
                {doctors.slice(0, 4).map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => onOpenDoctor(doc)}
                    className="hover:bg-[#f4f2fc] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-semibold text-[#1a1b22] flex items-center gap-2.5">
                      <img
                        src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256'}
                        alt={doc.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#c5c5d4]/60"
                      />
                      <span>{doc.name}</span>
                    </td>
                    <td className="py-3 px-3 text-[#454652]">{doc.specialty}</td>
                    <td className="py-3 px-3">
                      <span className="text-[#1a1b22] font-medium">Seguro Mala Praxis</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          doc.documentation.seguroMalaPraxisStatus === 'Vigente'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {doc.documentation.seguroMalaPraxisExpiry || '15/11/2023'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-xs font-semibold text-[#24389c] group-hover:underline">
                        Ver Ficha
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Últimas Automatizaciones */}
        <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
            <div>
              <h3 className="text-sm font-bold text-[#1a1b22] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Últimas Automatizaciones
              </h3>
              <p className="text-xs text-[#757684]">Actividad de scripts y APIs</p>
            </div>
            <button
              onClick={() => onNavigate('configuraciones')}
              className="text-xs font-medium text-[#24389c] hover:underline"
            >
              Configurar
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#f4f2fc] text-xs">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    log.type === 'email'
                      ? 'bg-blue-100 text-blue-700'
                      : log.type === 'api'
                      ? 'bg-indigo-100 text-indigo-700'
                      : log.type === 'sync'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {log.type === 'email' && <Send className="w-3.5 h-3.5" />}
                  {log.type === 'api' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {log.type === 'sync' && <RefreshCw className="w-3.5 h-3.5" />}
                  {log.type === 'error' && <AlertTriangle className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-[#1a1b22] truncate">{log.title}</p>
                    <span className="text-[10px] text-[#757684] shrink-0">{log.timeAgo}</span>
                  </div>
                  <p className="text-[11px] text-[#454652] mt-0.5">{log.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Task List Section (Integrated UX) */}
      <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1b22]">Lista Dinámica de Tareas y Pendientes</h3>
              <p className="text-xs text-[#757684]">
                {pendingTasks.length} tareas activas sincronizadas con la base local SQLite
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewTaskModal}
              className="px-3 py-1.5 bg-[#24389c] text-white text-xs font-bold rounded-lg hover:bg-[#1a2975] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Tarea
            </button>
            <button
              onClick={() => onNavigate('tareas')}
              className="text-xs font-semibold text-[#24389c] hover:underline px-2 py-1"
            >
              Ver Todas
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                task.completed
                  ? 'bg-[#f4f2fc]/60 border-[#c5c5d4]/40 opacity-75'
                  : 'bg-white border-[#c5c5d4]/80 hover:border-[#24389c] hover:shadow-xs'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="mt-0.5 w-4 h-4 text-[#24389c] rounded focus:ring-0 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    task.completed ? 'line-through text-[#757684]' : 'text-[#1a1b22]'
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-[11px] text-[#454652] mt-1 line-clamp-2">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#efedf6] text-[#454652]">
                    {task.category}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      task.priority === 'Alta'
                        ? 'bg-rose-100 text-rose-800'
                        : task.priority === 'Media'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-[10px] text-[#757684] ml-auto">Vence: {task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
