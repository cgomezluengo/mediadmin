import React, { useState, useEffect, useTransition } from 'react';
import {
  TabKey,
  Doctor,
  BonoItem,
  Liquidacion,
  TreasuryEntry,
  PendingFund,
  DebitItem,
  AuthorizationItem,
  CajaRecord,
  TaskItem,
  KanbanColumn,
} from './types';
import {
  AppState,
  getStoredState,
  saveStoredState,
  exportStateToJson,
  resetToFactoryState,
} from './services/storage';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { DoctorsView } from './components/DoctorsView';
import { ClaimsEntryView } from './components/ClaimsEntryView';
import { LiquidationsView } from './components/LiquidationsView';
import { TreasuryView } from './components/TreasuryView';
import { DebitsView } from './components/DebitsView';
import { AuthorizationsView } from './components/AuthorizationsView';
import { MedicalBoxView } from './components/MedicalBoxView';
import { SettingsView } from './components/SettingsView';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { TaskManagerModal } from './components/TaskManagerModal';

export function App() {
  const [appState, setAppState] = useState<AppState>(() => getStoredState());
  const [currentTab, setCurrentTab] = useState<TabKey>('inicio');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist to local storage whenever state changes
  useEffect(() => {
    saveStoredState(appState);
  }, [appState]);

  // Cloud Sync Handler
  const handleCloudSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setAppState((prev) => ({
        ...prev,
        lastCloudSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCloudSynced: true,
      }));
      setIsSyncing(false);
    }, 1200);
  };

  // Doctors Handlers
  const handleSaveDoctor = (updated: Doctor) => {
    setAppState((prev) => ({
      ...prev,
      doctors: prev.doctors.map((d) => (d.id === updated.id ? updated : d)),
    }));
  };

  const handleAddDoctor = (newDoc: Doctor) => {
    setAppState((prev) => ({
      ...prev,
      doctors: [newDoc, ...prev.doctors],
    }));
  };

  // Bonos Handlers
  const handleAddBono = (bono: BonoItem) => {
    setAppState((prev) => ({
      ...prev,
      bonos: [bono, ...prev.bonos],
    }));
  };

  const handleDeleteBono = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      bonos: prev.bonos.filter((b) => b.id !== id),
    }));
  };

  const handleSaveBatch = () => {
    // Add an audit log
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Reciente',
      title: `Lote de ${appState.bonos.length} bonos guardado`,
      subtitle: 'Sincronizado con base de datos',
      type: 'sync' as const,
    };
    setAppState((prev) => ({
      ...prev,
      logs: [newLog, ...prev.logs],
    }));
  };

  // Liquidaciones Handlers
  const handleGenerateDefinitive = (liqId: string) => {
    setAppState((prev) => ({
      ...prev,
      liquidaciones: prev.liquidaciones.map((l) =>
        l.id === liqId ? { ...l, status: 'PROCESADA' } : l
      ),
    }));
  };

  // Treasury Handlers
  const handleAddTreasuryEntry = (entry: TreasuryEntry) => {
    setAppState((prev) => ({
      ...prev,
      unallocatedTreasury: prev.unallocatedTreasury + entry.amount,
    }));
  };

  const handleImputeFunds = (selectedIds: string[]) => {
    const totalDeduction = appState.pendingFunds
      .filter((pf) => selectedIds.includes(pf.id))
      .reduce((acc, curr) => acc + curr.montoTotal, 0);

    setAppState((prev) => ({
      ...prev,
      unallocatedTreasury: Math.max(0, prev.unallocatedTreasury - totalDeduction),
      pendingFunds: prev.pendingFunds.map((pf) =>
        selectedIds.includes(pf.id) ? { ...pf, status: 'Imputado' } : pf
      ),
    }));
  };

  // Débitos Handlers
  const handleRefacturarDebit = (id: string, file?: string) => {
    setAppState((prev) => ({
      ...prev,
      debits: prev.debits.map((d) =>
        d.id === id ? { ...d, status: 'Refacturado', attachedFile: file || d.attachedFile } : d
      ),
    }));
  };

  const handleAcceptDebitLoss = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      debits: prev.debits.map((d) => (d.id === id ? { ...d, status: 'Aceptado Pérdida' } : d)),
    }));
  };

  // Autorizaciones Handlers
  const handleUpdateAuthStatus = (id: string, newStatus: KanbanColumn) => {
    setAppState((prev) => ({
      ...prev,
      authorizations: prev.authorizations.map((a) =>
        a.id === id ? { ...a, status: newStatus, timeAgo: 'Actualizado' } : a
      ),
    }));
  };

  const handleAddAuthorization = (auth: AuthorizationItem) => {
    setAppState((prev) => ({
      ...prev,
      authorizations: [auth, ...prev.authorizations],
    }));
  };

  // Caja Handlers
  const handleGenerateCajaFile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState.cajaRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `retenciones_caja_medicos_${new Date().toISOString().slice(0, 7)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSendAvisos = () => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Reciente',
      title: 'Avisos de Caja de Médicos remitidos',
      subtitle: `${appState.cajaRecords.length} profesionales notificados por email`,
      type: 'email' as const,
    };
    setAppState((prev) => ({
      ...prev,
      logs: [newLog, ...prev.logs],
    }));
  };

  // Tasks Handlers
  const handleAddTask = (task: TaskItem) => {
    setAppState((prev) => ({
      ...prev,
      tasks: [task, ...prev.tasks],
    }));
  };

  const handleToggleTask = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const handleDeleteTask = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const handleEditTask = (updated: TaskItem) => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
  };

  const handleExportTasksJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState.tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tareas_mediadmin_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Settings Handlers
  const handleToggleRule = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      messagingRules: prev.messagingRules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.doctors && parsed.liquidaciones) {
          setAppState(parsed);
          alert('¡Base de datos SQLite restaurada correctamente desde el archivo!');
        } else {
          alert('El archivo JSON no tiene la estructura válida de MediAdmin.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetFactory = () => {
    if (confirm('¿Está seguro de restablecer todos los datos a los valores predeterminados?')) {
      const fresh = resetToFactoryState();
      setAppState(fresh);
    }
  };

  const handleTestConnection = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      apiConnections: prev.apiConnections.map((c) =>
        c.id === id ? { ...c, status: 'Conectado', lastSync: 'Recién verificado ✓' } : c
      ),
    }));
  };

  // Calculated Counts
  const pendingDebitsCount = appState.debits.filter((d) => d.status === 'Pendiente').length;
  const pendingTasksCount = appState.tasks.filter((t) => !t.completed).length;
  const authInTransitCount = appState.authorizations.filter((a) => a.status === 'tramite').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf8ff]">
      {/* Dark Blue Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'tareas') {
            setIsTaskManagerOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        pendingDebitsCount={pendingDebitsCount}
        pendingTasksCount={pendingTasksCount}
        authorizationsInTransitCount={authInTransitCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          onOpenTaskManager={() => setIsTaskManagerOpen(true)}
          pendingTasksCount={pendingTasksCount}
          onExportJson={() => exportStateToJson(appState)}
          onSyncCloud={handleCloudSync}
          isSyncing={isSyncing}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto bg-[#fbf8ff]">
          {currentTab === 'inicio' && (
            <DashboardView
              doctors={appState.doctors}
              tasks={appState.tasks}
              logs={appState.logs}
              onNavigate={(tab) => {
                if (tab === 'tareas') setIsTaskManagerOpen(true);
                else setCurrentTab(tab);
              }}
              onOpenDoctor={(doc) => setSelectedDoctor(doc)}
              onToggleTask={handleToggleTask}
              onOpenNewTaskModal={() => setIsTaskManagerOpen(true)}
            />
          )}

          {currentTab === 'medicos' && (
            <DoctorsView
              doctors={appState.doctors}
              onOpenDoctor={(doc) => setSelectedDoctor(doc)}
              onAddDoctor={handleAddDoctor}
            />
          )}

          {currentTab === 'bonos' && (
            <ClaimsEntryView
              bonos={appState.bonos}
              doctors={appState.doctors}
              onAddBono={handleAddBono}
              onDeleteBono={handleDeleteBono}
              onSaveBatch={handleSaveBatch}
            />
          )}

          {currentTab === 'liquidaciones' && (
            <LiquidationsView
              liquidaciones={appState.liquidaciones}
              onGenerateDefinitive={handleGenerateDefinitive}
            />
          )}

          {currentTab === 'tesoreria' && (
            <TreasuryView
              unallocatedTreasury={appState.unallocatedTreasury}
              pendingFunds={appState.pendingFunds}
              debtorAlerts={appState.debtorAlerts}
              onAddTreasuryEntry={handleAddTreasuryEntry}
              onImputeFunds={handleImputeFunds}
            />
          )}

          {currentTab === 'debitos' && (
            <DebitsView
              debits={appState.debits}
              onRefacturar={handleRefacturarCredit => handleRefacturarDebit(handleRefacturarCredit)}
              onAcceptLoss={handleAcceptDebitLoss}
            />
          )}

          {currentTab === 'autorizaciones' && (
            <AuthorizationsView
              authorizations={appState.authorizations}
              doctors={appState.doctors}
              onUpdateStatus={handleUpdateAuthStatus}
              onAddAuthorization={handleAddAuthorization}
            />
          )}

          {currentTab === 'caja' && (
            <MedicalBoxView
              cajaRecords={appState.cajaRecords}
              onGenerateCajaFile={handleGenerateCajaFile}
              onSendAvisos={handleSendAvisos}
            />
          )}

          {currentTab === 'configuraciones' && (
            <SettingsView
              apiConnections={appState.apiConnections}
              messagingRules={appState.messagingRules}
              onToggleRule={handleToggleRule}
              onExportJson={() => exportStateToJson(appState)}
              onImportJson={handleImportJson}
              onResetFactory={handleResetFactory}
              onTestConnection={handleTestConnection}
            />
          )}
        </main>
      </div>

      {/* Doctor Administrative Card Modal */}
      {selectedDoctor && (
        <DoctorDetailModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSave={handleSaveDoctor}
        />
      )}

      {/* Dynamic Task Manager Slide-over / Modal */}
      <TaskManagerModal
        isOpen={isTaskManagerOpen}
        onClose={() => setIsTaskManagerOpen(false)}
        tasks={appState.tasks}
        doctors={appState.doctors}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
        onExportTasksJson={handleExportTasksJson}
      />
    </div>
  );
}
export default App;
