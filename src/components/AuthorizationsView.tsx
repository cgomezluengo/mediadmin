import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthorizationItem, KanbanColumn, Doctor } from '../types';

interface AuthorizationsViewProps {
  authorizations: AuthorizationItem[];
  doctors: Doctor[];
  onUpdateStatus: (id: string, newStatus: KanbanColumn) => void;
  onAddAuthorization: (auth: AuthorizationItem) => void;
}

export const AuthorizationsView: React.FC<AuthorizationsViewProps> = ({
  authorizations,
  doctors,
  onUpdateStatus,
  onAddAuthorization,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState(doctors[0]?.name || 'Dr. Carlos Mendoza');
  const [obraSocial, setObraSocial] = useState('OSDE');
  const [isSimulating, setIsSimulating] = useState(false);

  const columns: { key: KanbanColumn; title: string; color: string; badge: string }[] = [
    { key: 'pendientes', title: 'Pendientes de Envío', color: 'border-amber-400', badge: 'bg-amber-100 text-amber-800' },
    { key: 'tramite', title: 'En Trámite (API)', color: 'border-indigo-500', badge: 'bg-indigo-100 text-indigo-800' },
    { key: 'observadas', title: 'Observadas', color: 'border-rose-400', badge: 'bg-rose-100 text-rose-800' },
    { key: 'aprobadas', title: 'Aprobadas', color: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-800' },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Ingrese el nombre del paciente');
      return;
    }

    const newAuth: AuthorizationItem = {
      id: `aut-${Date.now()}`,
      code: `AUT-${Math.floor(2000 + Math.random() * 8000)}`,
      patientName,
      doctorName,
      obraSocial,
      timeAgo: 'Reciente',
      status: 'pendientes',
      isAutomation: true,
      observation: 'Nueva solicitud registrada en cola.',
    };

    onAddAuthorization(newAuth);
    setShowModal(false);
    setPatientName('');
  };

  const handleSimulateApiSync = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Move one from tramite to aprobadas
      const inTransit = authorizations.find((a) => a.status === 'tramite');
      if (inTransit) {
        onUpdateStatus(inTransit.id, 'aprobadas');
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1b22] tracking-tight">Autorizaciones en Tiempo Real</h2>
          <p className="text-xs text-[#454652]">
            Interconexión directa con servidores de auditoría médica y token de seguridad
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateApiSync}
            disabled={isSimulating}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#24389c] font-bold text-xs rounded-xl border border-[#24389c]/30 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Sincronizando con Web API...' : 'Simular Validación API'}
          </button>
          <button
            id="btn-nueva-autorizacion"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nueva Solicitud
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = authorizations.filter((a) => a.status === col.key);
          return (
            <div
              key={col.key}
              className={`bg-[#f4f2fc] rounded-2xl p-3.5 border-t-4 ${col.color} border-x border-b border-[#c5c5d4]/60 flex flex-col min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#efedf6]">
                <h3 className="text-xs font-bold text-[#1a1b22] uppercase tracking-wider">{col.title}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${col.badge}`}>
                  {items.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3.5 rounded-xl border border-[#c5c5d4]/70 shadow-xs hover:shadow-md transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#24389c]">{item.code}</span>
                      <span className="text-[10px] font-bold text-[#757684]">{item.timeAgo}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#1a1b22]">{item.patientName}</h4>
                      <p className="text-[11px] text-[#454652]">
                        {item.doctorName} • <span className="font-semibold text-[#24389c]">{item.obraSocial}</span>
                      </p>
                    </div>

                    {item.progress !== undefined && item.status === 'tramite' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-[#757684]">
                          <span>Validando credencial</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#efedf6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {item.observation && (
                      <p className="text-[10px] text-[#757684] bg-[#f4f2fc] p-1.5 rounded line-clamp-2">
                        {item.observation}
                      </p>
                    )}

                    {/* Quick Move Navigation */}
                    <div className="pt-2 border-t border-[#efedf6] flex items-center justify-between">
                      {col.key !== 'pendientes' ? (
                        <button
                          onClick={() => {
                            const prevStatus: Record<KanbanColumn, KanbanColumn> = {
                              tramite: 'pendientes',
                              observadas: 'tramite',
                              aprobadas: 'tramite',
                              pendientes: 'pendientes',
                            };
                            onUpdateStatus(item.id, prevStatus[col.key]);
                          }}
                          className="p-1 text-[#757684] hover:text-[#24389c] hover:bg-[#efedf6] rounded"
                          title="Mover a etapa anterior"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div />
                      )}

                      {col.key !== 'aprobadas' && (
                        <button
                          onClick={() => {
                            const nextStatus: Record<KanbanColumn, KanbanColumn> = {
                              pendientes: 'tramite',
                              tramite: 'aprobadas',
                              observadas: 'tramite',
                              aprobadas: 'aprobadas',
                            };
                            onUpdateStatus(item.id, nextStatus[col.key]);
                          }}
                          className="px-2 py-1 bg-[#dee0ff] hover:bg-[#cacfff] text-[#24389c] text-[10px] font-bold rounded-lg flex items-center gap-1"
                        >
                          <span>Avanzar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nueva Solicitud */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#c5c5d4] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
              <h3 className="font-bold text-sm text-[#1a1b22]">Nueva Solicitud de Autorización</h3>
              <button onClick={() => setShowModal(false)} className="text-[#757684] hover:text-[#1a1b22]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Nombre del Paciente</label>
                <input
                  type="text"
                  placeholder="Ej: Ruiz, Gabriel"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Médico Solicitante</label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Obra Social / Prepaga</label>
                <select
                  value={obraSocial}
                  onChange={(e) => setObraSocial(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                >
                  <option value="OSDE">OSDE</option>
                  <option value="Swiss Medical">Swiss Medical</option>
                  <option value="Galeno">Galeno</option>
                  <option value="IOMA">IOMA</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-[#efedf6]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#454652]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#24389c] hover:bg-[#1a2975] rounded-xl shadow-xs"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
