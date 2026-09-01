import {
  Doctor,
  BonoItem,
  Liquidacion,
  PendingFund,
  DebtorAlert,
  DebitItem,
  AuthorizationItem,
  CajaRecord,
  ApiConnection,
  MessagingRule,
  TaskItem,
  AutomationLog,
} from '../types';

import {
  INITIAL_DOCTORS,
  INITIAL_BONOS,
  INITIAL_LIQUIDACIONES,
  INITIAL_PENDING_FUNDS,
  INITIAL_DEBTOR_ALERTS,
  INITIAL_DEBITS,
  INITIAL_AUTHORIZATIONS,
  INITIAL_CAJA_RECORDS,
  INITIAL_API_CONNECTIONS,
  INITIAL_MESSAGING_RULES,
  INITIAL_TASKS,
  INITIAL_AUTOMATION_LOGS,
} from './mockData';

export interface AppState {
  doctors: Doctor[];
  bonos: BonoItem[];
  liquidaciones: Liquidacion[];
  pendingFunds: PendingFund[];
  debtorAlerts: DebtorAlert[];
  debits: DebitItem[];
  authorizations: AuthorizationItem[];
  cajaRecords: CajaRecord[];
  apiConnections: ApiConnection[];
  messagingRules: MessagingRule[];
  tasks: TaskItem[];
  logs: AutomationLog[];
  unallocatedTreasury: number;
  lastCloudSync: string;
  isCloudSynced: boolean;
}

const STORAGE_KEY = 'mediadmin_sqlite_store_v1';

export function getStoredState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        doctors: parsed.doctors || INITIAL_DOCTORS,
        bonos: parsed.bonos || INITIAL_BONOS,
        liquidaciones: parsed.liquidaciones || INITIAL_LIQUIDACIONES,
        pendingFunds: parsed.pendingFunds || INITIAL_PENDING_FUNDS,
        debtorAlerts: parsed.debtorAlerts || INITIAL_DEBTOR_ALERTS,
        debits: parsed.debits || INITIAL_DEBITS,
        authorizations: parsed.authorizations || INITIAL_AUTHORIZATIONS,
        cajaRecords: parsed.cajaRecords || INITIAL_CAJA_RECORDS,
        apiConnections: parsed.apiConnections || INITIAL_API_CONNECTIONS,
        messagingRules: parsed.messagingRules || INITIAL_MESSAGING_RULES,
        tasks: parsed.tasks || INITIAL_TASKS,
        logs: parsed.logs || INITIAL_AUTOMATION_LOGS,
        unallocatedTreasury: parsed.unallocatedTreasury ?? 1450000.0,
        lastCloudSync: parsed.lastCloudSync || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCloudSynced: parsed.isCloudSynced ?? true,
      };
    }
  } catch (e) {
    console.error('Error reading localStorage state:', e);
  }

  return {
    doctors: INITIAL_DOCTORS,
    bonos: INITIAL_BONOS,
    liquidaciones: INITIAL_LIQUIDACIONES,
    pendingFunds: INITIAL_PENDING_FUNDS,
    debtorAlerts: INITIAL_DEBTOR_ALERTS,
    debits: INITIAL_DEBITS,
    authorizations: INITIAL_AUTHORIZATIONS,
    cajaRecords: INITIAL_CAJA_RECORDS,
    apiConnections: INITIAL_API_CONNECTIONS,
    messagingRules: INITIAL_MESSAGING_RULES,
    tasks: INITIAL_TASKS,
    logs: INITIAL_AUTOMATION_LOGS,
    unallocatedTreasury: 1450000.0,
    lastCloudSync: 'Ahora mismo',
    isCloudSynced: true,
  };
}

export function saveStoredState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}

export function exportStateToJson(state: AppState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `mediadmin_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function resetToFactoryState(): AppState {
  localStorage.removeItem(STORAGE_KEY);
  return getStoredState();
}
