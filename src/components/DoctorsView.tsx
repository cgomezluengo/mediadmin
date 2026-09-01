import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Building,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserPlus,
  MoreVertical,
  X,
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorsViewProps {
  doctors: Doctor[];
  onOpenDoctor: (doc: Doctor) => void;
  onAddDoctor: (doc: Doctor) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  onOpenDoctor,
  onAddDoctor,
}) => {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Doctor Form State
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: '',
    matricula: '',
    matriculaProvincial: '',
    specialty: 'Cardiología',
    circuloMedico: 'Círculo Médico Centro',
    email: '',
    phone: '',
    docStatus: 'PENDIENTE',
    placesOfCare: ['Consultorios Centrales'],
    conventions: ['OSDE', 'Swiss Medical'],
    documentation: {
      matriculaNacionalStatus: 'Vigente',
      matriculaNacionalFile: 'mat_nac.pdf',
      matriculaProvincialStatus: 'No cargada',
      seguroMalaPraxisStatus: 'Alerta',
      seguroMalaPraxisExpiry: '30/11/2023',
    },
    automations: {
      emailAvisoVencimiento: true,
      envioResumenContador: false,
    },
  });

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.matricula.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'ALL' || doc.specialty.includes(specialtyFilter);
    const matchesStatus = statusFilter === 'ALL' || doc.docStatus === statusFilter;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.matricula) {
      alert('Por favor complete el nombre y la matrícula nacional.');
      return;
    }

    const created: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDoctor.name.startsWith('Dr') ? newDoctor.name : `Dr. ${newDoctor.name}`,
      matricula: newDoctor.matricula,
      matriculaProvincial: newDoctor.matriculaProvincial || '',
      specialty: newDoctor.specialty || 'Medicina General',
      circuloMedico: newDoctor.circuloMedico || 'Círculo Médico Centro',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256',
      email: newDoctor.email || 'medico@sistema.com',
      phone: newDoctor.phone || '+54 11 0000-0000',
      docStatus: 'PENDIENTE',
      placesOfCare: newDoctor.placesOfCare || ['Consultorio Central'],
      conventions: newDoctor.conventions || ['OSDE', 'Swiss Medical'],
      documentation: newDoctor.documentation as any,
      automations: newDoctor.automations as any,
    };

    onAddDoctor(created);
    setShowNewModal(false);
    setNewDoctor({
      name: '',
      matricula: '',
      matriculaProvincial: '',
      specialty: 'Cardiología',
      circuloMedico: 'Círculo Médico Centro',
      email: '',
      phone: '',
      docStatus: 'PENDIENTE',
      placesOfCare: ['Consultorios Centrales'],
      conventions: ['OSDE', 'Swiss Medical'],
      documentation: {
        matriculaNacionalStatus: 'Vigente',
        matriculaNacionalFile: 'mat_nac.pdf',
        matriculaProvincialStatus: 'No cargada',
        seguroMalaPraxisStatus: 'Alerta',
        seguroMalaPraxisExpiry: '30/11/2023',
      },
      automations: {
        emailAvisoVencimiento: true,
        envioResumenContador: false,
      },
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1b22] tracking-tight">Padrón de Médicos</h2>
          <p className="text-xs text-[#454652]">
            Administración de matrículas, legajos, convenios y estados de documentación
          </p>
        </div>
        <button
          id="btn-nuevo-medico"
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Médico
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#757684] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none text-[#1a1b22]"
          >
            <option value="ALL">Todas las especialidades</option>
            <option value="Cardio">Cardiología</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Traumatología">Traumatología</option>
            <option value="Dermatología">Dermatología</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none text-[#1a1b22]"
          >
            <option value="ALL">Todos los estados</option>
            <option value="COMPLETO">Completo</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="REVISIÓN">En Revisión</option>
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f4f2fc] text-[#454652] uppercase font-bold text-[11px] border-b border-[#efedf6]">
                <th className="py-3 px-4">Médico / Matrícula</th>
                <th className="py-3 px-4">Especialidad</th>
                <th className="py-3 px-4">Círculo Médico</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Documentación</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efedf6]">
              {filteredDoctors.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-[#fbf8ff] transition-colors group cursor-pointer"
                  onClick={() => onOpenDoctor(doc)}
                >
                  <td className="py-3.5 px-4 font-semibold text-[#1a1b22] flex items-center gap-3">
                    <img
                      src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256'}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#c5c5d4]/60"
                    />
                    <div>
                      <span className="font-bold block text-[#1a1b22] text-xs">{doc.name}</span>
                      <span className="text-[11px] text-[#757684]">
                        MN {doc.matricula} {doc.matriculaProvincial ? `• ${doc.matriculaProvincial}` : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#454652] font-medium">{doc.specialty}</td>
                  <td className="py-3.5 px-4 text-[#454652]">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#757684]" />
                      {doc.circuloMedico}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#454652]">
                    <div className="text-[11px]">
                      <div>{doc.email}</div>
                      <div className="text-[#757684]">{doc.phone}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        doc.docStatus === 'COMPLETO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.docStatus === 'REVISIÓN'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {doc.docStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDoctor(doc);
                      }}
                      className="px-3 py-1 text-xs font-bold text-[#24389c] bg-[#dee0ff]/60 hover:bg-[#dee0ff] rounded-lg transition-colors"
                    >
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Médico */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#c5c5d4] overflow-hidden">
            <div className="bg-[#1e2b6e] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Alta de Profesional Médico</h3>
              <button onClick={() => setShowNewModal(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej: Dr. Roberto S. Martínez"
                  required
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none focus:border-[#24389c]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Matrícula Nacional</label>
                  <input
                    type="text"
                    placeholder="Ej: MN-54912"
                    required
                    value={newDoctor.matricula}
                    onChange={(e) => setNewDoctor({ ...newDoctor, matricula: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Matrícula Provincial</label>
                  <input
                    type="text"
                    placeholder="Ej: MP-88410"
                    value={newDoctor.matriculaProvincial}
                    onChange={(e) => setNewDoctor({ ...newDoctor, matriculaProvincial: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Especialidad</label>
                  <input
                    type="text"
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Círculo Médico</label>
                  <input
                    type="text"
                    value={newDoctor.circuloMedico}
                    onChange={(e) => setNewDoctor({ ...newDoctor, circuloMedico: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="medico@hospital.com"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+54 11 1234-5678"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#efedf6]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-[#454652] hover:bg-[#efedf6] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#24389c] hover:bg-[#1a2975] rounded-xl shadow-xs"
                >
                  Registrar Médico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
