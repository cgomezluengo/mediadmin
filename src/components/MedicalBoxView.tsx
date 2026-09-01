import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Send,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Search,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CajaRecord } from '../types';

interface MedicalBoxViewProps {
  cajaRecords: CajaRecord[];
  onGenerateCajaFile: () => void;
  onSendAvisos: () => void;
}

export const MedicalBoxView: React.FC<MedicalBoxViewProps> = ({
  cajaRecords,
  onGenerateCajaFile,
  onSendAvisos,
}) => {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('2023-10');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredRecords = cajaRecords.filter(
    (r) =>
      r.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      r.matricula.toLowerCase().includes(search.toLowerCase()) ||
      r.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const totalGross = filteredRecords.reduce((acc, curr) => acc + curr.grossBilling, 0);
  const totalRetention = filteredRecords.reduce((acc, curr) => acc + curr.retentionAmount, 0);
  const totalNet = filteredRecords.reduce((acc, curr) => acc + curr.netPayable, 0);

  const handleGenerateFileClick = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    onGenerateCajaFile();
    setToastMsg('Archivo de retenciones para Caja de Médicos generado correctamente (TXT / JSON).');
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSendAvisosClick = () => {
    onSendAvisos();
    setToastMsg(`Avisos de liquidación y retención enviados a ${filteredRecords.length} médicos vía email.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header and Period */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1b22] tracking-tight">Caja de Médicos</h2>
          <p className="text-xs text-[#454652]">
            Cálculo estatutario de aportes y retenciones previsionales (5%)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-[#c5c5d4]/70 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#757684]" />
            <span className="font-semibold text-[#1a1b22]">Período:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="font-bold text-[#24389c] bg-transparent focus:outline-none"
            >
              <option value="2023-10">Octubre 2023</option>
              <option value="2023-09">Septiembre 2023</option>
              <option value="2023-08">Agosto 2023</option>
            </select>
          </div>

          <button
            onClick={handleSendAvisosClick}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#24389c] font-bold text-xs rounded-xl border border-[#24389c]/30 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar Avisos
          </button>
          <button
            id="btn-generar-archivo-caja"
            onClick={handleGenerateFileClick}
            className="px-4 py-2 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Generar Archivo Caja
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Total Facturado General</span>
          <p className="text-3xl font-black text-[#1a1b22] font-tabular mt-2">$45.230.500,00</p>
          <p className="text-xs text-[#757684] mt-1">Acumulado global del mes</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Retención Caja (5%)</span>
          <p className="text-3xl font-black text-rose-700 font-tabular mt-2">$2.261.525,00</p>
          <p className="text-xs text-rose-900 font-medium mt-1">Aporte previsional deducible</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs">
          <span className="text-xs font-semibold text-[#454652]">Médicos Activos</span>
          <p className="text-3xl font-black text-[#24389c] font-tabular mt-2">142</p>
          <p className="text-xs text-[#757684] mt-1">Padrón liquidado sin mora</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-xl border border-[#c5c5d4]/70 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-[#757684]" />
        <input
          type="text"
          placeholder="Buscar por médico, matrícula o especialidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-[#1a1b22]"
        />
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f4f2fc] text-[#454652] uppercase font-bold text-[10px] border-b border-[#efedf6]">
                <th className="py-3 px-4">Matrícula</th>
                <th className="py-3 px-4">Médico</th>
                <th className="py-3 px-4">Especialidad</th>
                <th className="py-3 px-4 text-right">Facturación Bruta</th>
                <th className="py-3 px-4 text-right">Retención 5%</th>
                <th className="py-3 px-4 text-right">Neto a Pagar</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efedf6]">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#fbf8ff] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#757684]">{r.matricula}</td>
                  <td className="py-3 px-4 font-bold text-[#1a1b22]">{r.doctorName}</td>
                  <td className="py-3 px-4 text-[#454652]">{r.specialty}</td>
                  <td className="py-3 px-4 text-right font-black text-[#1a1b22] font-tabular">
                    ${r.grossBilling.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-700 font-tabular">
                    -${r.retentionAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-emerald-700 font-tabular">
                    ${r.netPayable.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        r.status === 'Procesado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Grand Totals Footer */}
            <tfoot>
              <tr className="bg-[#efedf6] font-bold text-xs border-t-2 border-[#c5c5d4]">
                <td colSpan={3} className="py-3.5 px-4 text-[#1a1b22] uppercase tracking-wider">
                  Totales del Período ({filteredRecords.length} registros)
                </td>
                <td className="py-3.5 px-4 text-right font-black text-[#1a1b22] font-tabular">
                  ${totalGross.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right font-black text-rose-700 font-tabular">
                  -${totalRetention.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right font-black text-emerald-800 font-tabular">
                  ${totalNet.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
