import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  Calendar,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PendingFund, DebtorAlert, TreasuryEntry } from '../types';

interface TreasuryViewProps {
  unallocatedTreasury: number;
  pendingFunds: PendingFund[];
  debtorAlerts: DebtorAlert[];
  onAddTreasuryEntry: (entry: TreasuryEntry) => void;
  onImputeFunds: (selectedIds: string[]) => void;
}

export const TreasuryView: React.FC<TreasuryViewProps> = ({
  unallocatedTreasury,
  pendingFunds,
  debtorAlerts,
  onAddTreasuryEntry,
  onImputeFunds,
}) => {
  const [obraSocial, setObraSocial] = useState('OSDE');
  const [amount, setAmount] = useState('500000');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [transferRef, setTransferRef] = useState('TRANSF-BCO-94821');
  const [selectedIds, setSelectedIds] = useState<string[]>(['pf-2', 'pf-4']);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const totalToImpute = pendingFunds
    .filter((pf) => selectedIds.includes(pf.id))
    .reduce((acc, curr) => acc + curr.montoTotal, 0);

  const handleRegisterEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount) || 0;
    if (num <= 0) {
      alert('Ingrese un monto válido.');
      return;
    }

    const newEntry: TreasuryEntry = {
      id: `tr-${Date.now()}`,
      obraSocial,
      amount: num,
      date,
      transferRef,
      createdAt: new Date().toISOString(),
    };

    onAddTreasuryEntry(newEntry);
    setToastMsg(`Transferencia de $${num.toLocaleString('es-AR')} registrada.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExecuteImputation = () => {
    if (selectedIds.length === 0) {
      alert('Seleccione al menos una liquidación para imputar.');
      return;
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onImputeFunds(selectedIds);
    setToastMsg(`¡$${totalToImpute.toLocaleString('es-AR')} imputados a las liquidaciones seleccionadas!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-[#1a1b22] tracking-tight">Tesorería y Cobranzas</h2>
        <p className="text-xs text-[#454652]">
          Conciliación de pagos bancarios, fondos sin imputar y gestión de mora
        </p>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Registro de Ingreso */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#c5c5d4]/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#efedf6]">
            <h3 className="text-xs font-bold uppercase text-[#1a1b22] tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#24389c]" />
              Registro de Ingreso Bancario
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Cobranza Real
            </span>
          </div>

          <form onSubmit={handleRegisterEntry} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Obra Social Pagadora</label>
              <select
                value={obraSocial}
                onChange={(e) => setObraSocial(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
              >
                <option value="OSDE">OSDE</option>
                <option value="Swiss Medical">Swiss Medical</option>
                <option value="Galeno">Galeno</option>
                <option value="IOMA">IOMA</option>
                <option value="PAMI">PAMI</option>
                <option value="SANCOR SALUD">Sancor Salud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Monto Depositado ($ ARS)</label>
              <input
                type="number"
                step="1000"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Fecha de Acreditación</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Nº Transferencia / Ref</label>
                <input
                  type="text"
                  required
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              id="btn-registrar-transferencia"
              type="submit"
              className="w-full py-2.5 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 mt-3"
            >
              <Plus className="w-4 h-4" />
              Registrar Cobranza
            </button>
          </form>
        </div>

        {/* Right Col: Fondo Sin Imputar & Imputación */}
        <div className="lg:col-span-7 space-y-4">
          {/* Fondo Sin Imputar Banner */}
          <div className="p-5 bg-gradient-to-br from-[#1e2b6e] to-[#24389c] text-white rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider block">
                Fondo Total Sin Imputar
              </span>
              <p className="text-3xl font-black font-tabular mt-1 text-white">
                ${unallocatedTreasury.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-indigo-200/90 mt-1">
                Saldo disponible para conciliar contra lotes facturados
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
              <DollarSign className="w-8 h-8 text-amber-300" />
            </div>
          </div>

          {/* Imputación Table */}
          <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#efedf6]">
              <div>
                <h4 className="text-xs font-bold text-[#1a1b22] uppercase tracking-wider">
                  Imputación de Fondos
                </h4>
                <p className="text-[11px] text-[#757684]">Seleccione las liquidaciones para aplicar el saldo</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#24389c] block font-tabular">
                  Total a imputar: ${totalToImpute.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {pendingFunds.map((pf) => {
                const isSelected = selectedIds.includes(pf.id);
                return (
                  <div
                    key={pf.id}
                    onClick={() => handleToggleSelect(pf.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-[#24389c] font-semibold text-[#1a1b22]'
                        : 'bg-white border-[#efedf6] hover:bg-[#f4f2fc] text-[#454652]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#24389c] rounded focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-[#1a1b22] block">
                          {pf.liqId} • {pf.obraSocial}
                        </span>
                        <span className="text-[10px] text-[#757684]">Período: {pf.period}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#1a1b22] font-tabular block">
                        ${pf.montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                        {pf.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                id="btn-imputar-fondos"
                onClick={handleExecuteImputation}
                disabled={selectedIds.length === 0}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Imputar Seleccionados (${totalToImpute.toLocaleString('es-AR')})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Pagos Atrasados (Morosos) */}
      <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1b22]">
                Alertas de Pagos Atrasados (Facturas Morosas)
              </h3>
              <p className="text-xs text-[#757684]">Obras sociales que han superado el plazo de pago acordado</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {debtorAlerts.map((deb) => (
            <div
              key={deb.id}
              className="p-4 rounded-xl bg-[#f4f2fc] border border-[#c5c5d4]/60 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1a1b22]">{deb.obraSocial}</span>
                  <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                    +{deb.overdueDays} días
                  </span>
                </div>
                <p className="text-lg font-black text-rose-700 font-tabular mt-2">
                  ${deb.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#757684] mt-0.5">Período adeudado: {deb.period}</p>
              </div>

              <button
                onClick={() =>
                  alert(`Enviando notificación de reclamo por mora a ${deb.contactEmail || deb.obraSocial}...`)
                }
                className="w-full py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Reclamar por Email
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
