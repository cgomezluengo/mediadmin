import React, { useState } from 'react';
import {
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Building,
  Mail,
  Phone,
  ShieldAlert,
  Sparkles,
  Save,
  Trash2,
  Plus,
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onSave: (updated: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onSave,
}) => {
  if (!doctor) return null;

  const [activeTab, setActiveTab] = useState<'datos' | 'lugares' | 'convenios' | 'documentacion' | 'automatizaciones'>('documentacion');
  const [formData, setFormData] = useState<Doctor>({ ...doctor });
  const [newPlace, setNewPlace] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const calculateDocProgress = () => {
    let count = 0;
    if (formData.documentation.matriculaNacionalStatus === 'Vigente') count++;
    if (formData.documentation.matriculaProvincialStatus === 'Vigente') count++;
    if (formData.documentation.seguroMalaPraxisStatus === 'Vigente') count++;
    return count;
  };

  const progressCount = calculateDocProgress();

  const handleFileUploadMock = (field: 'matriculaProvincial' | 'matriculaNacional' | 'seguroMalaPraxis', filename: string) => {
    const updated = { ...formData };
    if (field === 'matriculaProvincial') {
      updated.documentation.matriculaProvincialFile = filename;
      updated.documentation.matriculaProvincialStatus = 'Vigente';
    } else if (field === 'matriculaNacional') {
      updated.documentation.matriculaNacionalFile = filename;
      updated.documentation.matriculaNacionalStatus = 'Vigente';
      updated.documentation.matriculaNacionalUpdate = new Date().toLocaleDateString();
    } else if (field === 'seguroMalaPraxis') {
      updated.documentation.seguroMalaPraxisFile = filename;
      updated.documentation.seguroMalaPraxisStatus = 'Vigente';
      updated.documentation.seguroMalaPraxisExpiry = '31/12/2025';
    }
    setFormData(updated);
    setUploadSuccess(`Archivo "${filename}" cargado y validado correctamente.`);
    setTimeout(() => setUploadSuccess(null), 3500);
  };

  const handleSave = () => {
    const finalProgress = calculateDocProgress();
    const updated = { ...formData };
    if (finalProgress === 3) {
      updated.docStatus = 'COMPLETO';
    } else if (finalProgress > 0) {
      updated.docStatus = 'PENDIENTE';
    }
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-ficha-medico"
        className="bg-[#ffffff] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#c5c5d4]/80 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-[#1e2b6e] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <img
              src={formData.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256'}
              alt={formData.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-300 shadow-md bg-indigo-900"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">{formData.name}</h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    formData.docStatus === 'COMPLETO'
                      ? 'bg-emerald-500 text-white'
                      : formData.docStatus === 'REVISIÓN'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {formData.docStatus}
                </span>
              </div>
              <p className="text-sm text-indigo-200 mt-0.5">
                {formData.specialty} • Matrícula {formData.matricula}
              </p>
              <div className="flex items-center gap-4 text-xs text-indigo-200/80 mt-2">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {formData.circuloMedico}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {formData.email}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 border-b border-indigo-400/30 -mb-6 overflow-x-auto pb-2">
            {[
              { key: 'documentacion', label: 'Documentación' },
              { key: 'datos', label: 'Datos Personales' },
              { key: 'lugares', label: 'Lugares de Atención' },
              { key: 'convenios', label: 'Convenios' },
              { key: 'automatizaciones', label: 'Automatizaciones' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-white text-[#24389c] shadow-xs'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#fbf8ff] space-y-5">
          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* TAB: DOCUMENTACIÓN */}
          {activeTab === 'documentacion' && (
            <div className="space-y-4">
              {/* Progress Summary Card */}
              <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1a1b22] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#24389c]" />
                    Estado de Documentación Requerida
                  </span>
                  <span className="text-[#24389c] font-bold">{progressCount} de 3 requisitos cargados</span>
                </div>
                <div className="w-full h-2 bg-[#efedf6] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      progressCount === 3
                        ? 'bg-emerald-500'
                        : progressCount === 2
                        ? 'bg-indigo-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${(progressCount / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Requirement 1: Matrícula Nacional */}
              <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#24389c] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#1a1b22]">Matrícula Nacional</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                        {formData.documentation.matriculaNacionalStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#454652] mt-0.5">
                      {formData.documentation.matriculaNacionalFile || 'matricula_nacional.pdf'}
                    </p>
                    <p className="text-[10px] text-[#757684]">
                      Actualizado: {formData.documentation.matriculaNacionalUpdate || '12/05/2023'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      alert(`Visualizando archivo: ${formData.documentation.matriculaNacionalFile || 'matricula.pdf'}`)
                    }
                    className="px-3 py-1.5 text-xs font-medium text-[#24389c] bg-[#dee0ff]/60 hover:bg-[#dee0ff] rounded-lg transition-colors"
                  >
                    Ver archivo
                  </button>
                  <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-[#454652] hover:bg-[#efedf6] border border-[#c5c5d4]/60 rounded-lg transition-colors">
                    Reemplazar
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUploadMock('matriculaNacional', e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Requirement 2: Matrícula Provincial */}
              <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#1a1b22]">Matrícula Provincial</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        formData.documentation.matriculaProvincialStatus === 'Vigente'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {formData.documentation.matriculaProvincialStatus}
                    </span>
                  </div>
                  {formData.documentation.matriculaProvincialFile && (
                    <span className="text-xs text-[#454652]">{formData.documentation.matriculaProvincialFile}</span>
                  )}
                </div>

                {formData.documentation.matriculaProvincialStatus !== 'Vigente' ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files?.[0]) {
                        handleFileUploadMock('matriculaProvincial', e.dataTransfer.files[0].name);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${
                      isDragging ? 'border-[#24389c] bg-[#dee0ff]/30' : 'border-[#c5c5d4] hover:border-[#24389c]/70'
                    }`}
                  >
                    <Upload className="w-6 h-6 text-[#757684] mx-auto mb-1.5" />
                    <p className="text-xs font-medium text-[#1a1b22]">
                      Arrastra y suelta el archivo aquí o{' '}
                      <label className="text-[#24389c] font-bold cursor-pointer hover:underline">
                        explorar
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUploadMock('matriculaProvincial', e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    </p>
                    <p className="text-[10px] text-[#757684] mt-0.5">Formatos admitidos: PDF, PNG, JPG (máx. 10MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Documento provincial verificado
                    </span>
                    <label className="cursor-pointer font-medium hover:underline text-[#24389c]">
                      Actualizar
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUploadMock('matriculaProvincial', e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Requirement 3: Seguro de Mala Praxis */}
              <div className="p-4 bg-white rounded-xl border border-[#c5c5d4]/70 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      formData.documentation.seguroMalaPraxisStatus === 'Vigente'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#1a1b22]">Seguro Mala Praxis</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          formData.documentation.seguroMalaPraxisStatus === 'Vigente'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {formData.documentation.seguroMalaPraxisStatus === 'Vigente'
                          ? 'Vigente'
                          : `Alerta (Vence: ${formData.documentation.seguroMalaPraxisExpiry})`}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#454652] mt-0.5">
                      {formData.documentation.seguroMalaPraxisFile || 'poliza_seguro_2023.pdf'}
                    </p>
                  </div>
                </div>
                <label className="cursor-pointer px-3 py-1.5 text-xs font-bold text-white bg-[#24389c] hover:bg-[#1a2975] rounded-lg transition-colors shadow-xs">
                  Actualizar Póliza
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUploadMock('seguroMalaPraxis', e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB: DATOS PERSONALES */}
          {activeTab === 'datos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-[#c5c5d4]/70">
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Especialidad</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Matrícula Nacional</label>
                <input
                  type="text"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Matrícula Provincial</label>
                <input
                  type="text"
                  value={formData.matriculaProvincial || ''}
                  onChange={(e) => setFormData({ ...formData, matriculaProvincial: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
                />
              </div>
            </div>
          )}

          {/* TAB: LUGARES DE ATENCIÓN */}
          {activeTab === 'lugares' && (
            <div className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 space-y-3">
              <h4 className="text-xs font-bold text-[#1a1b22]">Centros y Consultorios Asignados</h4>
              <div className="space-y-2">
                {formData.placesOfCare.map((place, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-[#f4f2fc] rounded-lg text-xs"
                  >
                    <span className="font-medium text-[#1a1b22] flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-[#24389c]" />
                      {place}
                    </span>
                    <button
                      onClick={() => {
                        const updatedPlaces = formData.placesOfCare.filter((_, i) => i !== idx);
                        setFormData({ ...formData, placesOfCare: updatedPlaces });
                      }}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Ej: Clínica Privada San José - Consultorio 12"
                  value={newPlace}
                  onChange={(e) => setNewPlace(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (newPlace.trim()) {
                      setFormData({ ...formData, placesOfCare: [...formData.placesOfCare, newPlace.trim()] });
                      setNewPlace('');
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#24389c] text-white rounded-lg hover:bg-[#1a2975] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              </div>
            </div>
          )}

          {/* TAB: CONVENIOS */}
          {activeTab === 'convenios' && (
            <div className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 space-y-3">
              <h4 className="text-xs font-bold text-[#1a1b22]">Obras Sociales y Prepagas Habilitadas</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['OSDE (210/310/410/510)', 'Swiss Medical (Planes SMG)', 'Galeno (Plata/Oro)', 'IOMA', 'PAMI', 'Medifé', 'Sancor Salud', 'Omint'].map((conv) => {
                  const isChecked = formData.conventions.some((c) => c.toLowerCase().includes(conv.toLowerCase().slice(0, 4)));
                  return (
                    <label
                      key={conv}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-[#efedf6] hover:bg-[#f4f2fc] text-xs cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, conventions: [...formData.conventions, conv] });
                          } else {
                            setFormData({
                              ...formData,
                              conventions: formData.conventions.filter((c) => !c.toLowerCase().includes(conv.toLowerCase().slice(0, 4))),
                            });
                          }
                        }}
                        className="rounded text-[#24389c] focus:ring-[#24389c]"
                      />
                      <span className="font-medium text-[#1a1b22]">{conv}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: AUTOMATIZACIONES */}
          {activeTab === 'automatizaciones' && (
            <div className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 space-y-4">
              <h4 className="text-xs font-bold text-[#1a1b22]">Configuración de Automatizaciones</h4>
              
              <div className="flex items-center justify-between p-3 bg-[#f4f2fc] rounded-xl border border-[#efedf6]">
                <div>
                  <p className="text-xs font-bold text-[#1a1b22]">Avisos de Vencimiento de Matrícula y Póliza</p>
                  <p className="text-[11px] text-[#454652]">
                    Enviar recordatorio automático por correo 30 días antes del vencimiento.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.automations.emailAvisoVencimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      automations: { ...formData.automations, emailAvisoVencimiento: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-[#24389c] rounded focus:ring-[#24389c]"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f4f2fc] rounded-xl border border-[#efedf6]">
                <div>
                  <p className="text-xs font-bold text-[#1a1b22]">Envío Automático de Resumen al Contador</p>
                  <p className="text-[11px] text-[#454652]">
                    Remitir copia del comprobante de liquidación y retenciones de caja al contador asignado.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.automations.envioResumenContador}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      automations: { ...formData.automations, envioResumenContador: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-[#24389c] rounded focus:ring-[#24389c]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#c5c5d4]/70 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#454652] hover:bg-[#efedf6] rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-[#24389c] hover:bg-[#1a2975] rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
