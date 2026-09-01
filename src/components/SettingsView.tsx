import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Mail,
  Database,
  Download,
  Upload,
  RefreshCw,
  Plus,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApiConnection, MessagingRule } from '../types';

interface SettingsViewProps {
  apiConnections: ApiConnection[];
  messagingRules: MessagingRule[];
  onToggleRule: (id: string) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onResetFactory: () => void;
  onTestConnection: (id: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  apiConnections,
  messagingRules,
  onToggleRule,
  onExportJson,
  onImportJson,
  onResetFactory,
  onTestConnection,
}) => {
  const [showNewConnModal, setShowNewConnModal] = useState(false);
  const [newConnName, setNewConnName] = useState('');
  const [newConnUrl, setNewConnUrl] = useState('');
  const [selectedRule, setSelectedRule] = useState<MessagingRule | null>(null);
  const [ruleTemplateText, setRuleTemplateText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleEditRuleClick = (rule: MessagingRule) => {
    setSelectedRule(rule);
    setRuleTemplateText(rule.template);
  };

  const handleSaveRule = () => {
    if (selectedRule) {
      selectedRule.template = ruleTemplateText;
      setSelectedRule(null);
      setToastMsg('Plantilla de mensajería actualizada con éxito.');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-[#1a1b22] tracking-tight">Configuraciones y Conexiones API</h2>
        <p className="text-xs text-[#454652]">
          Gestión de integraciones externas, reglas de automatización y persistencia de base de datos
        </p>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* SECTION 1: Conexiones a Portales de Obras Sociales */}
      <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
          <div>
            <h3 className="text-sm font-bold text-[#1a1b22] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#24389c]" />
              Conexiones a Portales de Obras Sociales
            </h3>
            <p className="text-xs text-[#757684]">Servicios web REST / SOAP para validación y descarga de liquidaciones</p>
          </div>
          <button
            onClick={() => setShowNewConnModal(true)}
            className="px-3 py-1.5 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva Conexión
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {apiConnections.map((conn) => (
            <div
              key={conn.id}
              className="p-4 rounded-xl bg-[#f4f2fc] border border-[#c5c5d4]/60 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1a1b22]">{conn.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      conn.status === 'Conectado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {conn.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#757684] mt-1">Última sync: {conn.lastSync}</p>
                {conn.endpointUrl && (
                  <p className="text-[10px] text-[#454652] font-mono mt-1 truncate bg-white/70 p-1 rounded">
                    {conn.endpointUrl}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#c5c5d4]/40">
                <button
                  onClick={() => onTestConnection(conn.id)}
                  className="text-xs font-bold text-[#24389c] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Probar API
                </button>
                <button
                  onClick={() => alert(`Editando credenciales para ${conn.name}`)}
                  className="text-xs text-[#454652] hover:text-[#1a1b22]"
                >
                  Credenciales
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Reglas de Mensajería y Notificaciones */}
      <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
          <div>
            <h3 className="text-sm font-bold text-[#1a1b22] flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              Reglas de Mensajería y Automatización
            </h3>
            <p className="text-xs text-[#757684]">Envío programado de reportes, alertas de débitos y notificaciones</p>
          </div>
        </div>

        <div className="space-y-3">
          {messagingRules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-xl border border-[#efedf6] bg-white hover:bg-[#fbf8ff] flex items-start justify-between gap-4 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#1a1b22]">{rule.title}</h4>
                  <span className="text-[10px] text-[#757684] bg-[#f4f2fc] px-2 py-0.5 rounded">
                    {rule.schedule}
                  </span>
                </div>
                <p className="text-xs text-[#454652]">{rule.description}</p>
                <div className="text-[11px] font-mono text-[#757684] bg-[#f4f2fc] p-2 rounded-lg mt-2">
                  {rule.template}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => onToggleRule(rule.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#24389c]"></div>
                </label>
                <button
                  onClick={() => handleEditRuleClick(rule)}
                  className="text-xs font-semibold text-[#24389c] hover:underline"
                >
                  Editar Plantilla
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Persistencia SQLite, Backups y Encriptación */}
      <div className="bg-white rounded-2xl border border-[#c5c5d4]/70 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
          <div>
            <h3 className="text-sm font-bold text-[#1a1b22] flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Persistencia Local SQLite & Respaldo en la Nube
            </h3>
            <p className="text-xs text-[#757684]">
              Motor de almacenamiento local duradero con exportación de respaldo y encriptación end-to-end
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            SQLite Engine Activo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#f4f2fc] rounded-xl space-y-2">
            <span className="text-xs font-bold text-[#1a1b22] block">Exportar Copia de Seguridad</span>
            <p className="text-[11px] text-[#454652]">
              Descarga un archivo JSON completo con todos los médicos, lotes, liquidaciones y tareas.
            </p>
            <button
              onClick={onExportJson}
              className="w-full py-2 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar JSON
            </button>
          </div>

          <div className="p-4 bg-[#f4f2fc] rounded-xl space-y-2">
            <span className="text-xs font-bold text-[#1a1b22] block">Restaurar Copia de Seguridad</span>
            <p className="text-[11px] text-[#454652]">
              Carga un archivo de respaldo JSON previamente exportado para recuperar el estado.
            </p>
            <label className="w-full py-2 bg-white hover:bg-slate-50 text-[#1a1b22] font-bold text-xs rounded-lg border border-[#c5c5d4] transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#24389c]" />
              Importar JSON
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onImportJson(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          <div className="p-4 bg-[#f4f2fc] rounded-xl space-y-2">
            <span className="text-xs font-bold text-[#1a1b22] block">Restablecer Datos Iniciales</span>
            <p className="text-[11px] text-[#454652]">
              Restaura los registros de demostración predeterminados del sistema.
            </p>
            <button
              onClick={onResetFactory}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restablecer Valores
            </button>
          </div>
        </div>
      </div>

      {/* Edit Rule Template Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#c5c5d4] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
              <h3 className="font-bold text-sm text-[#1a1b22]">Editar Plantilla: {selectedRule.title}</h3>
              <button onClick={() => setSelectedRule(null)} className="text-[#757684]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a1b22] mb-1">Cuerpo del Mensaje</label>
              <textarea
                rows={4}
                value={ruleTemplateText}
                onChange={(e) => setRuleTemplateText(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4] focus:outline-none font-mono"
              />
              <p className="text-[10px] text-[#757684] mt-1">
                Variables disponibles: {'{DOCTOR_NAME}'}, {'{PERIODO}'}, {'{MONTO_NETO}'}, {'{OBRA_SOCIAL}'}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedRule(null)}
                className="px-3 py-1.5 text-xs font-semibold text-[#454652]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRule}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#24389c] rounded-xl shadow-xs"
              >
                Guardar Plantilla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Connection Modal */}
      {showNewConnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#c5c5d4] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#efedf6]">
              <h3 className="font-bold text-sm text-[#1a1b22]">Nueva Conexión de Obra Social</h3>
              <button onClick={() => setShowNewConnModal(false)} className="text-[#757684]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nombre del Portal</label>
                <input
                  type="text"
                  placeholder="Ej: Medifé Web Services"
                  value={newConnName}
                  onChange={(e) => setNewConnName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Endpoint REST API / SOAP</label>
                <input
                  type="text"
                  placeholder="https://servicios.medife.com.ar/ws/auth"
                  value={newConnUrl}
                  onChange={(e) => setNewConnUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#efedf6]">
              <button
                onClick={() => setShowNewConnModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#454652]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert(`Conexión configurada para ${newConnName || 'Portal O.S.'}`);
                  setShowNewConnModal(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#24389c] rounded-xl shadow-xs"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
