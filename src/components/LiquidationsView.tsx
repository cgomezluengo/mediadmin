import React, { useState } from 'react';
import {
  FileCheck2,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Download,
  Send,
  Sparkles,
  Eye,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Liquidacion, LiquidacionDoctor } from '../types';

interface LiquidationsViewProps {
  liquidaciones: Liquidacion[];
  onGenerateDefinitive: (liqId: string) => void;
}

export const LiquidationsView: React.FC<LiquidationsViewProps> = ({
  liquidaciones,
  onGenerateDefinitive,
}) => {
  const [selectedLiqId, setSelectedLiqId] = useState(liquidaciones[0]?.id || 'liq-oct-2023-osde');
  const [modalidad, setModalidad] = useState<'agrupada' | 'directa'>('agrupada');
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState<LiquidacionDoctor | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const currentLiq = liquidaciones.find((l) => l.id === selectedLiqId) || liquidaciones[0];

  const handleGenerateClick = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    onGenerateDefinitive(currentLiq.id);
    setToastMsg(`¡Liquidación para ${currentLiq.obraSocial} generada y consolidada!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSendAutomaticBilling = () => {
    setToastMsg(`Lote de ${currentLiq.practicasCount} prácticas enviado al portal de ${currentLiq.obraSocial} vía API.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1b22] tracking-tight">Liquidaciones Mensuales</h2>
          <p className="text-xs text-[#454652]">
            Auditoría de prestaciones, consolidación por obra social y cierre contable
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSendAutomaticBilling}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#24389c] font-bold text-xs rounded-xl border border-[#24389c]/30 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar a Facturación Automática
          </button>
          <button
            id="btn-generar-liquidacion-definitiva"
            onClick={handleGenerateClick}
            className="px-4 py-2 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            Generar Liquidación Definitiva
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Filter Toolbar Card */}
      <div className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div>
            <label className="block text-[10px] font-bold text-[#757684] uppercase">Período</label>
            <select
              value={selectedLiqId}
              onChange={(e) => setSelectedLiqId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
            >
              {liquidaciones.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.period === '2023-10' ? 'Octubre 2023' : l.period} ({l.obraSocial.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#757684] uppercase">Obra Social</label>
            <span className="text-xs font-bold text-[#1a1b22] px-3 py-1.5 bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 block">
              {currentLiq.obraSocial}
            </span>
          </div>
        </div>

        {/* Modalidad Toggle */}
        <div className="flex items-center gap-1 bg-[#efedf6] p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setModalidad('agrupada')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              modalidad === 'agrupada' ? 'bg-white text-[#24389c] shadow-xs' : 'text-[#454652]'
            }`}
          >
            Facturación Agrupada
          </button>
          <button
            onClick={() => setModalidad('directa')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              modalidad === 'directa' ? 'bg-white text-[#24389c] shadow-xs' : 'text-[#454652]'
            }`}
          >
            Facturación Directa
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Total Facturado del Período</span>
          <p className="text-3xl font-black text-[#1a1b22] font-tabular mt-2">
            ${currentLiq.montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">✓ Lote verificado sin inconsistencias críticas</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Total de Prácticas Médicas</span>
          <p className="text-3xl font-black text-[#24389c] font-tabular mt-2">
            {currentLiq.practicasCount.toLocaleString()}
          </p>
          <p className="text-xs text-[#757684] mt-1">Consultas, ambulatorias e internación</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Médicos Incluidos en el Lote</span>
          <p className="text-3xl font-black text-slate-800 font-tabular mt-2">{currentLiq.doctorsCount}</p>
          <p className="text-xs text-[#757684] mt-1">Con retención de caja calculada</p>
        </div>
      </div>

      {/* Detalle por Profesional Table */}
      <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f4f2fc] border-b border-[#efedf6] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase text-[#1a1b22] tracking-wider">
            Detalle por Profesional
          </h3>
          <span className="text-xs text-[#757684] font-medium">
            Mostrando {currentLiq.doctorDetails.length} profesionales
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#454652] uppercase font-bold text-[10px] border-b border-[#efedf6] bg-white">
                <th className="py-3 px-4">Médico</th>
                <th className="py-3 px-4">Especialidad</th>
                <th className="py-3 px-4 text-center">Cant. Prácticas</th>
                <th className="py-3 px-4 text-right">Monto Total</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efedf6]">
              {currentLiq.doctorDetails.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#fbf8ff] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1a1b22]">{doc.doctorName}</td>
                  <td className="py-3 px-4 text-[#454652]">{doc.specialty}</td>
                  <td className="py-3 px-4 text-center font-semibold text-[#1a1b22]">{doc.cantPracticas}</td>
                  <td className="py-3 px-4 text-right font-black text-[#1a1b22] font-tabular">
                    ${doc.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        doc.status === 'VERIFICADOS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedDoctorDetail(doc)}
                      className="text-xs font-bold text-[#24389c] hover:underline"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Detail Popover */}
      {selectedDoctorDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#c5c5d4] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
              <h3 className="font-bold text-sm text-[#1a1b22]">{selectedDoctorDetail.doctorName}</h3>
              <button onClick={() => setSelectedDoctorDetail(null)} className="text-[#757684] hover:text-[#1a1b22]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#efedf6]">
                <span className="text-[#757684]">Especialidad:</span>
                <span className="font-semibold text-[#1a1b22]">{selectedDoctorDetail.specialty}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#efedf6]">
                <span className="text-[#757684]">Prácticas Presentadas:</span>
                <span className="font-semibold text-[#1a1b22]">{selectedDoctorDetail.cantPracticas}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#efedf6]">
                <span className="text-[#757684]">Subtotal Facturado:</span>
                <span className="font-bold text-[#1a1b22]">
                  ${selectedDoctorDetail.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#efedf6]">
                <span className="text-[#757684]">Retención Caja Médica (5%):</span>
                <span className="font-bold text-rose-600">
                  -${(selectedDoctorDetail.monto * 0.05).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-2 bg-[#f4f2fc] p-2 rounded-lg">
                <span className="font-bold text-[#1a1b22]">Neto a Transferir:</span>
                <span className="font-black text-emerald-700 text-sm">
                  ${(selectedDoctorDetail.monto * 0.95).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoctorDetail(null)}
                className="px-4 py-2 bg-[#24389c] text-white text-xs font-bold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
