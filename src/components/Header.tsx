import React, { useState } from 'react';
import { useCarouselStore } from '../store';
import { Download, LayoutTemplate, Plus, Settings, Undo2, Redo2, FolderRoot, ChevronLeft, Edit3, Menu, MoreVertical } from 'lucide-react';
import { ExportModal } from './ExportModal';

export function Header() {
  const { 
    format, 
    setFormat, 
    slides, 
    undo, 
    redo, 
    past, 
    future, 
    setProjectModalOpen, 
    view, 
    goToDashboard, 
    currentProjectId, 
    projects,
    renameProject,
    saveAsTemplate 
  } = useCarouselStore();

  const [isTemplateSaveModalOpen, setIsTemplateSaveModalOpen] = useState(false);
  const [templateNameInput, setTemplateNameInput] = useState('');
  const [templateCategory, setTemplateCategory] = useState<'Moderno' | 'Clássico' | 'Tecnológico' | 'Orgânico' | 'Minimalista'>('Moderno');

  const handleSaveAsTemplateRequest = () => {
    const project = projects.find(p => p.id === currentProjectId);
    setTemplateNameInput(project?.name || '');
    setIsTemplateSaveModalOpen(true);
  };

  const confirmSaveTemplate = () => {
    if (templateNameInput.trim()) {
      saveAsTemplate(templateNameInput, templateCategory);
      setIsTemplateSaveModalOpen(false);
    }
  };

  const currentProject = projects.find(p => p.id === currentProjectId);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentProject?.name || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleRename = () => {
    if (tempName.trim() && currentProjectId) {
      renameProject(currentProjectId, tempName.trim());
      setIsEditingName(false);
    }
  };

  if (view === 'dashboard') return null;

  return (
    <header className="h-14 md:h-16 border-b border-white/10 flex items-center justify-between px-3 md:px-6 bg-[#161616] sticky top-0 z-50 shrink-0 w-full">
      <div className="flex items-center gap-1 md:gap-6">
        <button 
          onClick={goToDashboard}
          className="flex items-center gap-1 text-white/40 hover:text-white transition-colors group pr-2 md:pr-4 border-r border-white/10"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:inline text-xs md:text-sm font-bold tracking-wide">Painel</span>
        </button>

        <div className="flex-1 min-w-0 max-w-[120px] sm:max-w-[200px] md:max-w-none ml-1 md:ml-0">
          {isEditingName ? (
            <input 
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="bg-black/60 border border-blue-500 rounded-lg px-2.5 py-1.5 text-xs md:text-sm font-bold text-white outline-none w-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              autoFocus
            />
          ) : (
            <h1 
              onClick={() => {
                setTempName(currentProject?.name || '');
                setIsEditingName(true);
              }}
              className="font-bold text-sm md:text-lg tracking-tight text-[#F0F0F0] cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-2 truncate"
            >
              <span className="truncate">{currentProject?.name || 'Sem título'}</span>
              <Edit3 size={12} className="text-white/20 shrink-0" />
            </h1>
          )}
        </div>
        
        <div className="hidden lg:flex items-center gap-1 border-l border-white/10 pl-4 ml-2">
          <button onClick={undo} disabled={past.length === 0} className={`p-2 rounded-lg transition-colors ${past.length > 0 ? 'text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'}`} title="Desfazer (Cmd/Ctrl + Z)">
             <Undo2 size={18} />
          </button>
          <button onClick={redo} disabled={future.length === 0} className={`p-2 rounded-lg transition-colors ${future.length > 0 ? 'text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'}`} title="Refazer (Cmd/Ctrl + Shift + Z)">
             <Redo2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-4 relative">
        {/* Desktop Format Selector */}
        <div className="hidden md:flex bg-black rounded-full p-0.5 md:p-1 border border-white/5">
          <button
            onClick={() => setFormat('1:1')}
            className={`px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-full transition-colors whitespace-nowrap ${format === '1:1' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            1:1
          </button>
          <button
            onClick={() => setFormat('3:5')}
            className={`px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-full transition-colors whitespace-nowrap ${format === '3:5' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            3:5
          </button>
          <button
            onClick={() => setFormat('4:5')}
            className={`px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-full transition-colors whitespace-nowrap ${format === '4:5' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            4:5
          </button>
          <button
            onClick={() => setFormat('9:16')}
            className={`px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-full transition-colors whitespace-nowrap ${format === '9:16' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            9:16
          </button>
        </div>

        <button
          onClick={handleSaveAsTemplateRequest}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-bold transition-all active:scale-95 shrink-0"
          title="Salvar como modelo"
        >
          <LayoutTemplate size={14} className="md:w-4 md:h-4" />
          <span className="hidden sm:inline">Salvar Modelo</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-bold shadow-lg shadow-blue-900/40 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Download size={14} className="md:w-4 md:h-4" />
          <span className="hidden sm:inline">Exportar...</span>
          <span className="sm:hidden">Exportar</span>
        </button>

        {/* Mobile Menu Toggle (Visible on md and sm, hidden on lg as lg has actions in bar) */}
        <div className="lg:hidden relative">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors h-9 w-9 flex items-center justify-center ${isMobileMenuOpen ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
          >
            <MoreVertical size={20} />
          </button>

          {isMobileMenuOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="absolute right-0 top-11 w-56 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[70] py-3 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 border-b border-white/5 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Ações</span>
                </div>
                <button 
                  onClick={() => { undo(); setIsMobileMenuOpen(false); }} 
                  disabled={past.length === 0}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${past.length > 0 ? 'text-white hover:bg-white/5' : 'text-white/20'}`}
                >
                  <Undo2 size={18} />
                  Desfazer
                </button>
                <button 
                  onClick={() => { redo(); setIsMobileMenuOpen(false); }} 
                  disabled={future.length === 0}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${future.length > 0 ? 'text-white hover:bg-white/5' : 'text-white/20'}`}
                >
                  <Redo2 size={18} />
                  Refazer
                </button>

                <div className="md:hidden">
                  <div className="px-4 py-3 border-t border-white/5 mt-2 mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Formato</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 px-3">
                    {(['1:1', '3:5', '4:5', '9:16'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => { setFormat(f); setIsMobileMenuOpen(false); }}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${format === f ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isTemplateSaveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Salvar como Modelo</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Nome do Modelo</label>
                  <input
                    type="text"
                    value={templateNameInput}
                    onChange={(e) => setTemplateNameInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ex: Editorial Gastronômico"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Categoria</label>
                  <select
                    value={templateCategory}
                    onChange={(e) => setTemplateCategory(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option value="Moderno">Moderno</option>
                    <option value="Clássico">Clássico</option>
                    <option value="Tecnológico">Tecnológico</option>
                    <option value="Orgânico">Orgânico</option>
                    <option value="Minimalista">Minimalista</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={() => setIsTemplateSaveModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmSaveTemplate}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Export Choices Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projectName={currentProject?.name || 'Sem título'}
      />
    </header>
  );
}
