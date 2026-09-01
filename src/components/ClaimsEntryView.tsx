import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  Sparkles,
  Calculator,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BonoItem, Doctor } from '../types';

interface ClaimsEntryViewProps {
  bonos: BonoItem[];
  doctors: Doctor[];
  onAddBono: (bono: BonoItem) => void;
  onDeleteBono: (id: string) => void;
  onSaveBatch: () => void;
}

export const ClaimsEntryView: React.FC<ClaimsEntryViewProps> = ({
  bonos,
  doctors,
  onAddBono,
  onDeleteBono,
  onSaveBatch,
}) => {
  const [patientName, setPatientName] = useState('');
  const [obraSocial, setObraSocial] = useState('OSDE');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [practiceCode, setPracticeCode] = useState('42.01.01');
  const [diagnosis, setDiagnosis] = useState('I10 - Hipertensión esencial');
  const [monto, setMonto] = useState('15000');
  const [copago, setCopago] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]?.name || 'Dr. Carlos Mendoza');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalAmount = bonos.reduce((acc, curr) => acc + curr.monto, 0);

  const handleAddBono = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Por favor ingrese el nombre del paciente.');
      return;
    }

    const numMonto = parseFloat(monto) || 0;
    const newBono: BonoItem = {
      id: `bono-${Date.now()}`,
      patientName,
      obraSocial,
      date,
      practiceCode,
      diagnosis,
      monto: numMonto,
      copago,
      doctorName: selectedDoctor,
    };

    onAddBono(newBono);
    setPatientName('');
    setToastMessage(`Bono cargado para ${patientName} ($${numMonto.toLocaleString()})`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCommitBatch = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSaveBatch();
    setToastMessage('¡Lote de bonos guardado y sincronizado con éxito!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1b22] tracking-tight">Carga y Lotes de Bonos</h2>
          <p className="text-xs text-[#454652]">
            Registro ágil de prestaciones médicas con cálculo automático de copagos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-guardar-lote"
            onClick={handleCommitBatch}
            disabled={bonos.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Guardar Lote ({bonos.length} bonos)
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 2 Column Layout: Form vs Batch Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Entry Form */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#c5c5d4]/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#efedf6]">
            <h3 className="text-xs font-bold uppercase text-[#1a1b22] tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#24389c]" />
              Nuevo Registro de Bono
            </h3>
            <span className="text-[10px] bg-indigo-50 text-[#24389c] font-bold px-2 py-0.5 rounded">
              Modo Rápido
            </span>
          </div>

          <form onSubmit={handleAddBono} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1a1b22] mb-1">
                Paciente (Apellido y Nombre)
              </label>
              <input
                type="text"
                placeholder="Ej: Perez, Maria"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Obra Social / Prepaga</label>
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
                  <option value="Medifé">Medifé</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Fecha de Prestación</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Profesional Actuante</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Código de Práctica</label>
                <input
                  type="text"
                  value={practiceCode}
                  onChange={(e) => setPracticeCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Monto ($ ARS)</label>
                <input
                  type="number"
                  step="100"
                  required
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Diagnóstico (CIE-10)</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-[#f4f2fc] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1a1b22] block">Cobra Copago / Coseguro</span>
                <span className="text-[10px] text-[#454652]">Cobrado en mostrador al paciente</span>
              </div>
              <input
                type="checkbox"
                checked={copago}
                onChange={(e) => setCopago(e.target.checked)}
                className="w-4 h-4 text-[#24389c] rounded focus:ring-0 cursor-pointer"
              />
            </div>

            <button
              id="btn-agregar-al-lote"
              type="submit"
              className="w-full py-2.5 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Bono al Lote
            </button>
          </form>
        </div>

        {/* Right Column: Active Batch Table */}
        <div className="lg:col-span-7 space-y-4">
          {/* Summary Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs">
              <span className="text-xs font-semibold text-[#454652]">Total Acumulado del Lote</span>
              <p className="text-2xl font-black text-[#1a1b22] font-tabular mt-1">
                ${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-[#757684] mt-0.5">Listo para imputación y facturación</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs">
              <span className="text-xs font-semibold text-[#454652]">Cantidad de Bonos</span>
              <p className="text-2xl font-black text-[#24389c] font-tabular mt-1">{bonos.length}</p>
              <p className="text-[11px] text-[#757684] mt-0.5">Validaciones de padrón aprobadas</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-[#f4f2fc] border-b border-[#efedf6] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1a1b22]">Detalle del Lote Abierto</span>
              <span className="text-[11px] text-[#757684]">Lote #{new Date().toISOString().slice(0, 10)}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#454652] uppercase font-bold text-[10px] border-b border-[#efedf6] bg-white">
                    <th className="py-2.5 px-3">Paciente</th>
                    <th className="py-2.5 px-3">O. Social</th>
                    <th className="py-2.5 px-3">Práctica / Código</th>
                    <th className="py-2.5 px-3">Médico</th>
                    <th className="py-2.5 px-3 text-right">Monto</th>
                    <th className="py-2.5 px-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efedf6]">
                  {bonos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#757684]">
                        No hay bonos en el lote actual. Complete el formulario para agregar uno.
                      </td>
                    </tr>
                  ) : (
                    bonos.map((b) => (
                      <tr key={b.id} className="hover:bg-[#fbf8ff] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[#1a1b22]">
                          <div>{b.patientName}</div>
                          <div className="text-[10px] text-[#757684]">{b.date}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#24389c]">
                            {b.obraSocial}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#454652]">
                          <div className="font-mono font-medium">{b.practiceCode}</div>
                          <div className="text-[10px] text-[#757684] truncate max-w-[120px]">{b.diagnosis}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[#454652] text-[11px]">{b.doctorName || 'Dr. Asignado'}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#1a1b22] font-tabular">
                          ${b.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => onDeleteBono(b.id)}
                            title="Quitar bono del lote"
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
