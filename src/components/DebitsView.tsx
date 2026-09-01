import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Upload,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Paperclip,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DebitItem } from '../types';

interface DebitsViewProps {
  debits: DebitItem[];
  onRefacturar: (id: string, file?: string) => void;
  onAcceptLoss: (id: string) => void;
}

export const DebitsView: React.FC<DebitsViewProps> = ({
  debits,
  onRefacturar,
  onAcceptLoss,
}) => {
  const [selectedDebit, setSelectedDebit] = useState<DebitItem | null>(debits[0] || null);
  const [filterOS, setFilterOS] = useState('ALL');
  const [filterReason, setFilterReason] = useState('ALL');
  const [justificationFile, setJustificationFile] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const pendingDebits = debits.filter((d) => d.status === 'Pendiente');
  const totalAmount = pendingDebits.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredDebits = debits.filter((d) => {
    const matchOS = filterOS === 'ALL' || d.obraSocial.includes(filterOS);
    const matchReason = filterReason === 'ALL' || d.rejectionReason === filterReason;
    return matchOS && matchReason;
  });

  const handleRefacturarClick = (debit: DebitItem) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onRefacturar(debit.id, justificationFile || 'historia_clinica_anexada.pdf');
    setToastMsg(`Débito de ${debit.patientName} enviado a refacturación.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAcceptLossClick = (debit: DebitItem) => {
    onAcceptLoss(debit.id);
    setToastMsg(`Débito de ${debit.patientName} aceptado como pérdida.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-[#1a1b22] tracking-tight">Gestión de Débitos Médicos</h2>
        <p className="text-xs text-[#454652]">
          Auditoría de rechazos, anexado de documentación clínica y refacturación ágil
        </p>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Débitos Pendientes</span>
          <p className="text-2xl font-black text-rose-700 font-tabular mt-1">{pendingDebits.length}</p>
          <p className="text-[11px] text-[#757684] mt-0.5">Requieren acción administrativa</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Monto Total Retenido</span>
          <p className="text-2xl font-black text-[#1a1b22] font-tabular mt-1">
            ${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-[#757684] mt-0.5">En proceso de recuperación</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Recuperados Este Mes</span>
          <p className="text-2xl font-black text-emerald-600 font-tabular mt-1">18 Débitos</p>
          <p className="text-[11px] text-[#757684] mt-0.5">Refacturados con éxito</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#c5c5d4]/70 shadow-xs flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-[#454652]">
          <Filter className="w-4 h-4 text-[#757684]" />
          <span className="font-semibold">Filtrar por:</span>
        </div>
        <select
          value={filterOS}
          onChange={(e) => setFilterOS(e.target.value)}
          className="px-3 py-1.5 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
        >
          <option value="ALL">Todas las Obras Sociales</option>
          <option value="OSDE">OSDE</option>
          <option value="Swiss Medical">Swiss Medical</option>
          <option value="Galeno">Galeno</option>
        </select>
        <select
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
          className="px-3 py-1.5 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
        >
          <option value="ALL">Todos los Motivos de Débito</option>
          <option value="Falta Historia Clínica">Falta Historia Clínica</option>
          <option value="Tope Excedido">Tope Excedido</option>
          <option value="Código Inexistente">Código Inexistente</option>
          <option value="Documentación Ilegible">Documentación Ilegible</option>
        </select>
      </div>

      {/* 2 Column Layout: Debit List vs Detail / Justification Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Debit Cards List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredDebits.map((debit) => {
            const isSelected = selectedDebit?.id === debit.id;
            return (
              <div
                key={debit.id}
                onClick={() => setSelectedDebit(debit)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#24389c] shadow-md ring-1 ring-[#24389c]/40'
                    : 'bg-white border-[#c5c5d4]/70 hover:border-[#24389c]/60 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#1a1b22]">{debit.patientName}</h4>
                      <span className="text-[10px] text-[#757684]">{debit.patientId}</span>
                    </div>
                    <p className="text-[11px] text-[#454652] mt-0.5 font-medium">
                      {debit.obraSocial} • Factura {debit.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-700 font-tabular block">
                      ${debit.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        debit.status === 'Refacturado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : debit.status === 'Aceptado Pérdida'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {debit.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#efedf6] flex items-center justify-between text-[11px] text-[#757684]">
                  <span className="flex items-center gap-1 font-semibold text-rose-900 bg-rose-50 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    {debit.rejectionReason}
                  </span>
                  <span>{debit.doctorName} (MN {debit.doctorMatricula})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Detail & Justification Editor */}
        <div className="lg:col-span-6">
          {selectedDebit ? (
            <div className="bg-white p-5 rounded-2xl border border-[#c5c5d4]/70 shadow-xs space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1b22]">Auditoría y Justificación de Débito</h3>
                  <p className="text-xs text-[#757684]">Expediente {selectedDebit.invoiceNumber}</p>
                </div>
                <span className="text-xs font-black text-rose-700 font-tabular bg-rose-50 px-2.5 py-1 rounded-lg">
                  ${selectedDebit.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#f4f2fc] rounded-xl space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#757684]">Paciente:</span>
                    <span className="font-bold text-[#1a1b22]">{selectedDebit.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757684]">Práctica:</span>
                    <span className="font-semibold text-[#1a1b22]">{selectedDebit.practice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757684]">Médico:</span>
                    <span className="font-semibold text-[#1a1b22]">
                      {selectedDebit.doctorName} (MN {selectedDebit.doctorMatricula})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757684]">Fecha de Servicio:</span>
                    <span className="text-[#1a1b22]">{selectedDebit.serviceDate}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
                  <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block mb-1">
                    Motivo Dictaminado por Auditoría O.S.
                  </span>
                  <p className="text-xs text-rose-950 font-medium">{selectedDebit.rejectionReason}</p>
                  <p className="text-[11px] text-[#454652] mt-1">{selectedDebit.auditNotes}</p>
                </div>

                {/* Attach File Section */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-[#1a1b22]">
                    Documentación de Respaldo / Historia Clínica
                  </label>
                  <div className="border border-dashed border-[#c5c5d4] p-3 rounded-xl text-center hover:bg-[#fbf8ff] transition-colors">
                    <input
                      type="file"
                      id="debit-file-input"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setJustificationFile(e.target.files[0].name);
                        }
                      }}
                    />
                    <label htmlFor="debit-file-input" className="cursor-pointer">
                      <Paperclip className="w-4 h-4 text-[#757684] mx-auto mb-1" />
                      <span className="text-xs text-[#24389c] font-bold block">
                        {justificationFile || selectedDebit.attachedFile || 'Adjuntar archivo PDF o imagen médica'}
                      </span>
                      <span className="text-[10px] text-[#757684]">
                        Haga clic para adjuntar comprobante
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#efedf6] flex items-center justify-between gap-3">
                <button
                  id="btn-aceptar-debito-perdida"
                  onClick={() => handleAcceptLossClick(selectedDebit)}
                  disabled={selectedDebit.status !== 'Pendiente'}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5 text-slate-600" />
                  Aceptar Débito (Pérdida)
                </button>
                <button
                  id="btn-refacturar-debito"
                  onClick={() => handleRefacturarClick(selectedDebit)}
                  disabled={selectedDebit.status !== 'Pendiente'}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#24389c] hover:bg-[#1a2975] disabled:opacity-50 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refacturar Práctica
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#757684] bg-white rounded-2xl border border-[#c5c5d4]/70">
              Seleccione un débito para auditar y anexar justificación.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
