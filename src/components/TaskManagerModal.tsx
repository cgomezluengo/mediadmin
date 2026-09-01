import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Sparkles,
  Download,
  Filter,
  X,
  Edit2,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { TaskItem, Doctor } from '../types';

interface TaskManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  doctors: Doctor[];
  onAddTask: (task: TaskItem) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: TaskItem) => void;
  onExportTasksJson: () => void;
}

export const TaskManagerModal: React.FC<TaskManagerModalProps> = ({
  isOpen,
  onClose,
  tasks,
  doctors,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onExportTasksJson,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  // New Task Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskItem['category']>('Liquidaciones');
  const [priority, setPriority] = useState<TaskItem['priority']>('Alta');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [assignedDoctor, setAssignedDoctor] = useState('');

  // Editing state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  if (!isOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString().slice(0, 10),
      assignedDoctor: assignedDoctor || undefined,
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  const handleToggle = (id: string, currentCompleted: boolean) => {
    if (!currentCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
    onToggleTask(id);
  };

  const handleStartEdit = (t: TaskItem) => {
    setEditingTaskId(t.id);
    setEditTitle(t.title);
  };

  const handleSaveEdit = (t: TaskItem) => {
    if (editTitle.trim()) {
      onEditTask({ ...t, title: editTitle.trim() });
    }
    setEditingTaskId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchCat = filterCategory === 'ALL' || t.category === filterCategory;
    const matchPri = filterPriority === 'ALL' || t.priority === filterPriority;
    const matchComp = showCompleted ? true : !t.completed;
    return matchCat && matchPri && matchComp;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#c5c5d4] flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1e2b6e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Lista Dinámica de Tareas
                <span className="text-xs bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  {pendingCount} pendientes
                </span>
              </h2>
              <p className="text-xs text-indigo-200">
                Gestor interactivo con persistencia local SQLite y soporte multiplataforma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportTasksJson}
              title="Exportar tareas a JSON"
              className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </button>
            <button
              onClick={onClose}
              className="text-indigo-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#fbf8ff] space-y-5">
          {/* Quick Task Creation Form */}
          <form
            onSubmit={handleCreateTask}
            className="bg-white p-4 rounded-xl border border-[#c5c5d4]/70 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#efedf6]">
              <span className="text-xs font-bold uppercase text-[#1a1b22] tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#24389c]" />
                Nueva Tarea Administrativa
              </span>
              <span className="text-[10px] text-[#757684]">Persistencia instantánea</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <input
                  type="text"
                  placeholder="Título de la tarea (ej: Revisar liquidación OSDE o renovar seguro Dra. Silva)..."
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none focus:border-[#24389c]"
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
                >
                  <option value="Liquidaciones">Liquidaciones</option>
                  <option value="Débitos">Débitos</option>
                  <option value="Documentación">Documentación</option>
                  <option value="Tesorería">Tesorería</option>
                  <option value="Obras Sociales">Obras Sociales</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
                >
                  <option value="Alta">Prioridad: Alta 🔴</option>
                  <option value="Media">Prioridad: Media 🟡</option>
                  <option value="Baja">Prioridad: Baja 🟢</option>
                </select>
              </div>
              <div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f4f2fc] rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Tarea
                </button>
              </div>
            </div>
          </form>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#454652] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filtros:
              </span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1 text-xs bg-white rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="Liquidaciones">Liquidaciones</option>
                <option value="Débitos">Débitos</option>
                <option value="Documentación">Documentación</option>
                <option value="Tesorería">Tesorería</option>
                <option value="Obras Sociales">Obras Sociales</option>
                <option value="General">General</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-2.5 py-1 text-xs bg-white rounded-lg border border-[#c5c5d4]/70 focus:outline-none"
              >
                <option value="ALL">Todas las Prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-[#454652]">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded text-[#24389c] focus:ring-0"
              />
              <span>Mostrar completadas ({tasks.filter((t) => t.completed).length})</span>
            </label>
          </div>

          {/* Animated Tasks List */}
          <div className="space-y-2.5">
            <AnimatePresence>
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#757684] bg-white rounded-xl border border-[#c5c5d4]/60">
                  No hay tareas que coincidan con los filtros seleccionados.
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      task.completed
                        ? 'bg-[#f4f2fc]/70 border-[#c5c5d4]/40 opacity-75'
                        : 'bg-white border-[#c5c5d4]/80 shadow-xs hover:border-[#24389c]'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggle(task.id, task.completed)}
                        className="mt-1 w-4 h-4 text-[#24389c] rounded focus:ring-0 cursor-pointer shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        {editingTaskId === task.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border rounded bg-white"
                            />
                            <button
                              onClick={() => handleSaveEdit(task)}
                              className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded"
                            >
                              Guardar
                            </button>
                          </div>
                        ) : (
                          <>
                            <p
                              className={`text-xs font-semibold leading-tight ${
                                task.completed ? 'line-through text-[#757684]' : 'text-[#1a1b22]'
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[11px] text-[#454652] mt-1">{task.description}</p>
                            )}
                          </>
                        )}

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#efedf6] text-[#454652]">
                            {task.category}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              task.priority === 'Alta'
                                ? 'bg-rose-100 text-rose-800'
                                : task.priority === 'Media'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {task.priority}
                          </span>
                          {task.assignedDoctor && (
                            <span className="text-[10px] text-[#757684]">Dr: {task.assignedDoctor}</span>
                          )}
                          <span className="text-[10px] text-[#757684] ml-auto flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Vence: {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-1 text-[#757684] hover:text-[#24389c] hover:bg-[#efedf6] rounded"
                        title="Editar tarea"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#c5c5d4] flex items-center justify-between text-xs text-[#757684]">
          <span>Los cambios se guardan automáticamente en la base local SQLite.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#24389c] hover:bg-[#1a2975] text-white font-bold rounded-xl shadow-xs"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
