import React, { useState } from 'react';
import { useCarouselStore } from '../store';
import { 
  Plus, 
  FolderPlus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  LayoutTemplate, 
  Clock, 
  ChevronRight,
  Search,
  MoreVertical
} from 'lucide-react';

export function Dashboard() {
  const { 
    projects, 
    createProject, 
    loadProject, 
    deleteProject, 
    renameProject,
    setTemplateModalOpen 
  } = useCarouselStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  const handleCreateBlank = (name: string) => {
    createProject(name || 'Novo Projeto');
    setIsCreating(false);
    setNewProjectName('');
  };

  const handleRename = (id: string) => {
    if (editNameValue.trim()) {
      renameProject(id, editNameValue.trim());
      setEditingId(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F0F0F0] p-4 md:p-12 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-900/20">
                C
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Carousel<span className="text-blue-500">Maker</span></h1>
            </div>
            <p className="text-white/40 text-xs md:text-sm font-medium uppercase tracking-wider">Crie carrosséis de alto impacto.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-6 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-80 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
          {/* New Blank Project */}
          <button 
            onClick={() => setIsCreating(true)}
            className="group relative flex items-center gap-4 md:gap-6 p-6 md:p-8 bg-[#161616] border border-white/5 rounded-2xl md:rounded-3xl hover:border-blue-500/30 transition-all text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shrink-0">
              <Plus size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-0.5 md:mb-1">Novo Projeto</h3>
              <p className="text-white/40 text-xs md:text-sm">Comece do zero em um canvas branco.</p>
            </div>
          </button>

          {/* New from Template */}
          <button 
            onClick={() => setTemplateModalOpen(true)}
            className="group relative flex items-center gap-4 md:gap-6 p-6 md:p-8 bg-[#161616] border border-white/5 rounded-2xl md:rounded-3xl hover:border-purple-500/30 transition-all text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform shrink-0">
              <LayoutTemplate size={24} className="md:w-8 md:h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-0.5 md:mb-1">Usar Modelo</h3>
              <p className="text-white/40 text-xs md:text-sm">Inicie com designs testados.</p>
            </div>
          </button>
        </div>

        {/* Projects Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Meus Projetos 
              <span className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full font-mono">{filteredProjects.length}</span>
            </h2>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/20">
                <FolderPlus size={32} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Ainda não há projetos</h4>
              <p className="text-white/30 text-sm max-w-xs mx-auto">
                {searchQuery ? 'Nenhum projeto encontrado com este nome.' : 'Seus carrosséis criados aparecerão aqui automaticamente.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="group relative bg-[#161616] border border-white/5 rounded-3xl hover:border-white/20 transition-all hover:z-30"
                >
                  {/* Thumbnail area (Placeholder or Mini-slides) */}
                  <div 
                    onClick={() => loadProject(project.id)}
                    className="aspect-video bg-black/40 flex items-center justify-center cursor-pointer relative overflow-hidden rounded-t-3xl"
                  >
                    <div className="flex -space-x-8 transform scale-75 group-hover:scale-[0.8] transition-transform duration-500">
                       {project.slides.slice(0, 3).map((s, i) => (
                         <div 
                           key={s.id} 
                           className="w-24 h-32 bg-white/10 rounded-lg shadow-2xl border border-white/5 flex-shrink-0"
                           style={{ 
                             zIndex: 3 - i,
                             backgroundColor: s.background.type === 'color' ? s.background.value : '#262626',
                             backgroundImage: s.background.type === 'image' ? `url(${s.background.value})` : 'none',
                             backgroundSize: 'cover'
                           }}
                         ></div>
                       ))}
                    </div>
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Info area */}
                  <div className="p-5">
                    {editingId === project.id ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input 
                          type="text" 
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          onBlur={() => handleRename(project.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(project.id)}
                          className="bg-black border border-blue-500 rounded px-2 py-1 text-sm text-white w-full outline-none"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 
                          onClick={() => loadProject(project.id)}
                          className="font-bold text-white truncate cursor-pointer hover:text-blue-400 transition-colors"
                        >
                          {project.name}
                        </h3>
                        <div className="relative group/menu">
                          <button className="p-1 text-white/20 hover:text-white transition-colors relative z-20">
                            <MoreVertical size={16} />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-40 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-50 p-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(project.id);
                                setEditNameValue(project.name);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <Edit2 size={12} /> Renomear
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setProjectToDelete(project.id);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border-t border-white/5 mt-1 pt-2"
                            >
                              <Trash2 size={12} /> Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1">
                         <LayoutTemplate size={10} /> {project.slides.length} slides
                       </span>
                       <span className="flex items-center gap-1">
                         <Clock size={10} /> {new Date(project.lastModified).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal Overlay */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Criar Novo Projeto</h2>
            <p className="text-white/40 text-sm mb-6">Dê um nome para o seu novo carrossel.</p>
            
            <input 
              type="text" 
              placeholder="Ex: Minha Viagem, Dicas Criativas..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBlank(newProjectName)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-blue-500 transition-colors font-medium"
              autoFocus
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setIsCreating(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleCreateBlank(newProjectName)}
                className="flex-[2] px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/40 transition-all"
              >
                Começar agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            
            <h2 className="text-xl font-bold text-white text-center mb-2">Excluir Projeto?</h2>
            <p className="text-white/40 text-sm text-center mb-8">
              Esta ação não pode ser desfeita. Você perderá todos os slides e elementos deste carrossel.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDelete}
                className="w-full px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-900/40 transition-all"
              >
                Sim, excluir permanentemente
              </button>
              <button 
                onClick={() => setProjectToDelete(null)}
                className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
