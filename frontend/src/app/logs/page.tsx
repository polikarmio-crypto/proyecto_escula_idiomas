'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Shield,
  ShieldAlert,
  GraduationCap,
  Landmark,
  Package,
  Database,
  Globe,
  Cpu,
  Folder,
  FileText,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Filter,
  Terminal,
  Activity,
  AlertTriangle,
  Clock,
  User,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { logger } from '@/utils/logger';

interface LogFolder {
  id: string;
  name: string;
  system: string;
  scope: 'backend' | 'frontend' | 'quarkus';
  description: string;
  icon: string;
  color: string;
  file_count: number;
  total_bytes: number;
  total_human: string;
  latest_file: string | null;
  latest_activity: string | null;
}

interface LogFile {
  filename: string;
  size_bytes: number;
  size_human: string;
  updated_at: string;
  is_today: boolean;
}

interface LogEntry {
  id: number;
  format: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'AUDIT';
  action: string;
  user: string;
  ip: string;
  context: any;
  message: string;
  stacktrace?: string[] | null;
  raw: string;
}

interface Counters {
  ALL: number;
  INFO: number;
  WARNING: number;
  ERROR: number;
  DEBUG: number;
  CRITICAL: number;
  AUDIT: number;
}

export default function LogsViewerPage() {
  const [folders, setFolders] = useState<LogFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('auth');
  const [files, setFiles] = useState<LogFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [counters, setCounters] = useState<Counters>({
    ALL: 0,
    INFO: 0,
    WARNING: 0,
    ERROR: 0,
    DEBUG: 0,
    CRITICAL: 0,
    AUDIT: 0,
  });
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(50);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [filteredEntries, setFilteredEntries] = useState<number>(0);

  const [loadingFolders, setLoadingFolders] = useState<boolean>(true);
  const [loadingEntries, setLoadingEntries] = useState<boolean>(false);
  const [generatingTest, setGeneratingTest] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedContexts, setExpandedContexts] = useState<Record<number, boolean>>({});
  const [expandedTraces, setExpandedTraces] = useState<Record<number, boolean>>({});
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);
  const [purging, setPurging] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const renderFolderIcon = (iconName: string, color: string) => {
    const props = { className: 'w-4 h-4', style: { color } };
    switch (iconName) {
      case 'Shield': return <Shield {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Landmark': return <Landmark {...props} />;
      case 'Package': return <Package {...props} />;
      case 'Database': return <Database {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      default: return <Folder {...props} />;
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadFolders = useCallback(async () => {
    try {
      setLoadingFolders(true);
      const res = await fetch('/api/v1/logs/folders');
      if (!res.ok) throw new Error('Error al cargar carpetas de log');
      const data = await res.json();
      if (data.status === 'success' && data.folders) {
        setFolders(data.folders);
        if (!data.folders.some((f: LogFolder) => f.id === selectedFolder)) {
          setSelectedFolder(data.folders[0]?.id || 'auth');
        }
      }
    } catch (err: any) {
      console.error(err);
      showToast('No se pudieron cargar las carpetas de log');
    } finally {
      setLoadingFolders(false);
    }
  }, [selectedFolder]);

  const loadFiles = useCallback(async (folderId: string) => {
    try {
      const res = await fetch(`/api/v1/logs/files?folder=${encodeURIComponent(folderId)}`);
      if (!res.ok) throw new Error('Error al cargar archivos');
      const data = await res.json();
      if (data.status === 'success') {
        const fileList: LogFile[] = data.files || [];
        setFiles(fileList);
        if (fileList.length > 0) {
          const todayFile = fileList.find((f) => f.is_today);
          setSelectedFile(todayFile ? todayFile.filename : fileList[0].filename);
        } else {
          setSelectedFile('');
          setEntries([]);
          setCounters({ ALL: 0, INFO: 0, WARNING: 0, ERROR: 0, DEBUG: 0, CRITICAL: 0, AUDIT: 0 });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadEntries = useCallback(async () => {
    if (!selectedFolder) return;
    try {
      setLoadingEntries(true);
      const params = new URLSearchParams({
        folder: selectedFolder,
        page: page.toString(),
        per_page: perPage.toString(),
        level: selectedLevel,
      });

      if (selectedFile) {
        params.append('file', selectedFile);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const res = await fetch(`/api/v1/logs/entries?${params.toString()}`);
      if (!res.ok) throw new Error('Error al consultar entradas de log');
      const data = await res.json();

      if (data.status === 'success') {
        setEntries(data.entries || []);
        setCounters(data.counters || { ALL: 0, INFO: 0, WARNING: 0, ERROR: 0, DEBUG: 0, CRITICAL: 0, AUDIT: 0 });
        setTotalPages(data.total_pages || 1);
        setTotalEntries(data.total_entries || 0);
        setFilteredEntries(data.filtered_entries || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEntries(false);
    }
  }, [selectedFolder, selectedFile, selectedLevel, searchQuery, page, perPage]);

  useEffect(() => {
    loadFolders();
    logger.info('UI_LOGS_VIEWER_OPENED', { component: 'LogsViewerPage' });
  }, [loadFolders]);

  useEffect(() => {
    if (selectedFolder) {
      setPage(1);
      loadFiles(selectedFolder);
    }
  }, [selectedFolder, loadFiles]);

  useEffect(() => {
    loadEntries();
  }, [selectedFolder, selectedFile, selectedLevel, searchQuery, page, perPage, loadEntries]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadEntries();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadEntries]);

  const handleGenerateTestLogs = async () => {
    try {
      setGeneratingTest(true);
      const res = await fetch('/api/v1/logs/test', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        showToast('Batería de logs generada en Backend, Frontend y Microservicio Quarkus.');
        await loadFolders();
        await loadFiles(selectedFolder);
        await loadEntries();
      }
    } catch (err) {
      showToast('Error al generar logs de prueba.');
    } finally {
      setGeneratingTest(false);
    }
  };

  const handleDownloadLog = () => {
    if (!selectedFolder || !selectedFile) return;
    window.open(`/api/v1/logs/download?folder=${encodeURIComponent(selectedFolder)}&file=${encodeURIComponent(selectedFile)}`, '_blank');
  };

  const handlePurgeLog = async () => {
    if (!selectedFolder || !selectedFile) return;
    try {
      setPurging(true);
      const res = await fetch('/api/v1/logs/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: selectedFolder, file: selectedFile }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        showToast(data.message || 'Archivo purgado exitosamente.');
        setShowPurgeModal(false);
        await loadEntries();
      }
    } catch (err) {
      showToast('Error al purgar el archivo de registros.');
    } finally {
      setPurging(false);
    }
  };

  const handleCopyJson = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleContext = (id: number) => {
    setExpandedContexts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTrace = (id: number) => {
    setExpandedTraces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'INFO':
        return <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-950/40 text-blue-400 border border-blue-500/30">INFO</span>;
      case 'WARNING':
        return <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-950/40 text-amber-300 border border-amber-500/30">WARN</span>;
      case 'ERROR':
        return <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-950/40 text-red-400 border border-red-500/40">ERROR</span>;
      case 'CRITICAL':
        return <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-rose-950/50 text-rose-300 border border-rose-500 animate-pulse">CRITICAL</span>;
      case 'DEBUG':
        return <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-purple-950/40 text-purple-300 border border-purple-500/30">DEBUG</span>;
      case 'AUDIT':
      case 'EMERGENCY':
        return <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-emerald-950/40 text-emerald-300 border border-emerald-500/40">AUDIT</span>;
      default:
        return <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300">{level}</span>;
    }
  };

  const activeFolderMeta = useMemo(() => {
    return folders.find((f) => f.id === selectedFolder);
  }, [folders, selectedFolder]);

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)]">
      {/* Toast de notificación */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[var(--bg-card)] border border-[var(--color-accent)] text-[var(--text-main)] px-4 py-2.5 rounded-[2px] shadow-xl flex items-center space-x-2 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-[var(--color-accent)] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. FRANJA SUPERIOR COMPACTA (44px) */}
      <div className="strip-utility-bar">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--military-green-subtle)] border border-[var(--border-accent)] text-[var(--military-green-primary)] dark:text-[var(--military-gold-primary)] font-mono text-[11px] font-bold shrink-0">
            <Terminal className="w-3.5 h-3.5" />
            <span>SACA / Logs & Auditoría</span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-fine)] shrink-0" />

          <div className="flex items-center gap-2 text-xs font-mono truncate">
            <span className="text-[var(--text-main)] font-bold truncate">
              {activeFolderMeta?.name || selectedFolder} &gt; {selectedFile || 'sin archivo'}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
              ● EN VIVO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn text-xs px-2.5 py-1 ${
              autoRefresh ? 'btn-primary' : 'btn-secondary'
            }`}
            title="Alternar refresco automático cada 10 segundos"
          >
            <Activity className={`w-3 h-3 ${autoRefresh ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{autoRefresh ? '10s ON' : 'Auto'}</span>
          </button>

          <button
            onClick={handleGenerateTestLogs}
            disabled={generatingTest}
            className="btn btn-secondary text-xs px-2.5 py-1"
            title="Generar eventos de prueba"
          >
            <Sparkles className={`w-3 h-3 ${generatingTest ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Test</span>
          </button>

          {selectedFile && (
            <>
              <button
                onClick={handleDownloadLog}
                className="btn btn-secondary text-xs px-2 py-1"
                title="Descargar archivo crudo"
              >
                <Download className="w-3 h-3 text-sky-400" />
              </button>
              <button
                onClick={() => setShowPurgeModal(true)}
                className="btn btn-secondary text-xs px-2 py-1 text-red-500"
                title="Purgar archivo de log"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}

          <button
            onClick={() => {
              loadFolders();
              loadEntries();
            }}
            disabled={loadingEntries}
            className="btn btn-secondary text-xs px-2 py-1"
            title="Sincronizar"
          >
            <RefreshCw className={`w-3 h-3 ${loadingEntries ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. CINTA DE FILTRO DE NIVELES (34px) */}
      <div className="h-9 shrink-0 bg-[var(--bg-surface)] border-b border-[var(--border-fine)] px-3 flex items-center justify-between text-xs font-mono overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold mr-1">
            NIVEL:
          </span>
          {['ALL', 'INFO', 'WARNING', 'ERROR', 'DEBUG', 'CRITICAL', 'AUDIT'].map((lvl) => {
            const isSelected = selectedLevel === lvl;
            const count = counters[lvl as keyof Counters] || 0;
            return (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setPage(1);
                }}
                className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-bold transition flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-[var(--military-green-primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-fine)]'
                }`}
              >
                <span>{lvl === 'ALL' ? 'TODOS' : lvl}</span>
                <span className="tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="text-[10.5px] text-[var(--text-muted)] hidden md:block">
          TOTAL: <strong className="text-[var(--text-main)]">{counters.ALL}</strong> EVENTOS
        </div>
      </div>

      {/* 3. CONSOLA DE AUDITORÍA DIVIDIDA (100% CERO SCROLL EXTERNO) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-2 p-2 overflow-hidden">
        {/* Panel Izquierdo (3 cols): Árbol de Carpetas y Archivos */}
        <div className="col-span-12 lg:col-span-3 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-2 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-fine)] shrink-0">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1 font-sans">
              <Folder className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Componentes ({folders.length})
            </span>
            <span className="text-[9.5px] font-mono text-[var(--text-muted)]">LOGS</span>
          </div>

          {/* Lista de Carpetas con scroll interno */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-1 my-1.5 pr-1">
            {folders.map((folder) => {
              const isSelected = selectedFolder === folder.id;
              return (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`p-1.5 rounded-[2px] border cursor-pointer transition text-xs font-mono flex items-center justify-between ${
                    isSelected
                      ? 'bg-[var(--bg-surface)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/50'
                      : 'bg-[var(--bg-card)] border-[var(--border-fine)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {renderFolderIcon(folder.icon, folder.color)}
                    <div className="truncate">
                      <p className="font-bold text-[11px] text-[var(--text-main)] truncate">{folder.name}</p>
                      <p className="text-[9.5px] text-[var(--text-muted)] truncate">{folder.scope.toUpperCase()} • {folder.file_count} arch.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] shrink-0">{folder.total_human}</span>
                </div>
              );
            })}
          </div>

          {/* Selector de Archivo Específico en el Pie */}
          <div className="pt-2 border-t border-[var(--border-fine)] shrink-0">
            <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1 uppercase font-bold">
              Archivo Activo:
            </label>
            {files.length > 0 ? (
              <select
                value={selectedFile}
                onChange={(e) => {
                  setSelectedFile(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] text-xs text-[var(--text-main)] rounded px-2 py-1 font-mono outline-none"
              >
                {files.map((file) => (
                  <option key={file.filename} value={file.filename}>
                    {file.filename} ({file.size_human}){file.is_today ? ' ★ HOY' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-[10px] text-[var(--text-muted)] italic">Sin archivos</span>
            )}
          </div>
        </div>

        {/* Panel Derecho (9 cols): Barra de Búsqueda + Lista de Entradas de Log */}
        <div className="col-span-12 lg:col-span-9 bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[2px] p-2 flex flex-col justify-between shadow-xs overflow-hidden">
          {/* Barra Superior con Buscador */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-fine)] shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por usuario, IP, acción, JSON..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded pl-8 pr-2 py-1 text-xs text-[var(--text-main)] outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
              <span>{filteredEntries} eventos</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
                className="bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded px-1.5 py-0.5 text-xs text-[var(--text-main)] font-mono"
              >
                <option value="25">25 / pág</option>
                <option value="50">50 / pág</option>
                <option value="100">100 / pág</option>
              </select>
            </div>
          </div>

          {/* Consola de Registros con Scroll Interno */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[var(--border-fine)] font-mono text-xs my-1 pr-1">
            {loadingEntries ? (
              <div className="p-12 text-center text-[var(--text-muted)] space-y-2">
                <RefreshCw className="w-6 h-6 text-[var(--color-accent)] animate-spin mx-auto" />
                <p className="text-xs font-semibold">Leyendo bitácora de eventos...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="p-12 text-center text-[var(--text-muted)] space-y-2">
                <FileText className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                <p className="text-xs font-semibold">No se encontraron eventos con los filtros actuales.</p>
              </div>
            ) : (
              entries.map((entry) => {
                const isExpanded = !!expandedContexts[entry.id];
                const isTraceExpanded = !!expandedTraces[entry.id];
                const jsonString = entry.context ? JSON.stringify(entry.context, null, 2) : '';

                return (
                  <div
                    key={entry.id}
                    className="p-2 hover:bg-[var(--bg-surface)]/60 transition-colors space-y-1 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[var(--text-muted)] font-bold text-[10px]">#{entry.id}</span>
                        <span className="text-[var(--text-muted)] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {entry.timestamp}
                        </span>
                        {getLevelBadge(entry.level)}
                        <span className="font-bold text-[var(--text-main)] bg-[var(--bg-surface)] px-1.5 py-0.2 rounded border border-[var(--border-fine)] text-[10px]">
                          {entry.action}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                        <span className="flex items-center gap-1 text-[var(--text-main)]">
                          <User className="w-2.5 h-2.5" /> {entry.user}
                        </span>
                        <span>•</span>
                        <span>{entry.ip}</span>
                      </div>
                    </div>

                    <div className="text-[var(--text-main)] pl-2 border-l-2 border-[var(--border-fine)]">
                      <p className="break-words text-[11px] leading-tight font-sans">{entry.message}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-0.5">
                      {entry.context && (
                        <button
                          onClick={() => toggleContext(entry.id)}
                          className="text-[10px] text-[var(--color-accent)] hover:underline font-bold flex items-center gap-1"
                        >
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          <span>{isExpanded ? 'Ocultar JSON' : 'Ver Contexto JSON'}</span>
                        </button>
                      )}

                      {entry.stacktrace && entry.stacktrace.length > 0 && (
                        <button
                          onClick={() => toggleTrace(entry.id)}
                          className="text-[10px] text-rose-500 hover:underline font-bold flex items-center gap-1"
                        >
                          {isTraceExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          <span>{isTraceExpanded ? 'Ocultar Traza' : `Traza (${entry.stacktrace.length} l.)`}</span>
                        </button>
                      )}
                    </div>

                    {isExpanded && entry.context && (
                      <div className="mt-1 bg-[var(--bg-surface)] border border-[var(--border-fine)] rounded p-2 relative font-mono text-[10px]">
                        <button
                          onClick={() => handleCopyJson(entry.id, jsonString)}
                          className="absolute right-2 top-2 px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-fine)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        >
                          {copiedId === entry.id ? 'Copiado' : 'Copiar'}
                        </button>
                        <pre className="text-[var(--color-accent)] overflow-x-auto pr-12">{jsonString}</pre>
                      </div>
                    )}

                    {isTraceExpanded && entry.stacktrace && (
                      <div className="mt-1 bg-red-950/20 border border-red-500/30 rounded p-2 font-mono text-[10px] text-red-400 overflow-x-auto max-h-48 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{entry.stacktrace.join('\n')}</pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Barra de Paginación Fija Inferior */}
          <div className="tactical-pagination shrink-0">
            <span className="font-mono text-xs">
              PÁGINA {page} DE {totalPages} ({filteredEntries} EVENTOS)
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-secondary text-xs px-2 py-0.5"
              >
                <ChevronLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn btn-secondary text-xs px-2 py-0.5"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Purga */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-fine)] rounded-[3px] max-w-md w-full p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Confirmar Purga Militar</h3>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              ¿Desea purgar el archivo <strong className="text-[var(--text-main)] font-mono">{selectedFile}</strong> de la carpeta <strong className="text-[var(--color-accent)] font-mono">{selectedFolder}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-fine)]">
              <button onClick={() => setShowPurgeModal(false)} className="btn btn-secondary text-xs px-3 py-1">
                Cancelar
              </button>
              <button onClick={handlePurgeLog} disabled={purging} className="btn btn-primary text-xs px-3 py-1 bg-red-600 text-white">
                {purging ? 'Purgando...' : 'Confirmar Purga'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
