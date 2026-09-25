import React, { useState } from 'react';
import { useCarouselStore } from '../store';
import { X, Download, FileImage, FileText, Settings2, Loader2, CheckCircle2, Sliders, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export function ExportModal({ isOpen, onClose, projectName }: ExportModalProps) {
  const { slides, format, activeSlideId } = useCarouselStore();

  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'pdf'>('png');
  const [exportRange, setExportRange] = useState<'all' | 'current'>('all');
  const [scale, setScale] = useState<number>(2); // Default to 2x for high quality output
  const [jpgQuality, setJpgQuality] = useState<number>(90); // JPG quality percentage 0-100

  // Export progress state
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    setProgress(10);
    
    try {
      const exportContainer = document.getElementById('export-container');
      if (!exportContainer) {
        throw new Error('Container de exportação não encontrado no DOM.');
      }

      // Temporarily display the export container to compile elements
      exportContainer.style.display = 'flex';
      const slideElements = exportContainer.querySelectorAll('.export-slide');

      if (slideElements.length === 0) {
        throw new Error('Nenhum slide disponível para exportar.');
      }

      // Determine which indices of slides we need to process
      const activeIdx = slides.findIndex(s => s.id === activeSlideId);
      const targetIndices: number[] = [];
      if (exportRange === 'current') {
        const indexToUse = activeIdx >= 0 ? activeIdx : 0;
        targetIndices.push(indexToUse);
      } else {
        for (let i = 0; i < slides.length; i++) {
          targetIndices.push(i);
        }
      }

      const totalItems = targetIndices.length;
      const imagesData: { dataUrl: string; name: string; blob: Blob }[] = [];

      // Loop through slides and generate canvas
      for (let i = 0; i < totalItems; i++) {
        const slideIndex = targetIndices[i];
        const el = slideElements[slideIndex] as HTMLElement;
        const displayIndex = i + 1;

        setCurrentStep(`Renderizando slide ${displayIndex} de ${totalItems}...`);
        
        // Calculate dynamic progress mapping: from 10% to 80%
        const currentProgress = Math.round(10 + (i / totalItems) * 70);
        setProgress(currentProgress);

        // html2canvas config with the selected scale
        const canvas = await html2canvas(el, { 
          scale: scale, 
          useCORS: true,
          allowTaint: true,
          logging: false
        });

        const imageMime = exportFormat === 'jpg' ? 'image/jpeg' : 'image/png';
        const imageExt = exportFormat === 'jpg' ? 'jpg' : 'png';
        const qualityParam = exportFormat === 'jpg' ? jpgQuality / 100 : undefined;

        // Extract Blob
        const blob = await new Promise<Blob | null>(resolve => {
          canvas.toBlob(resolve, imageMime, qualityParam);
        });

        if (blob) {
          const dataUrl = canvas.toDataURL(imageMime, qualityParam);
          imagesData.push({
            dataUrl,
            name: `slide-${slideIndex + 1}.${imageExt}`,
            blob
          });
        }
      }

      // Hide the export container back
      exportContainer.style.display = 'none';

      setProgress(85);
      setCurrentStep('Preparando arquivos de download...');

      const cleanFilename = projectName ? projectName.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase() : 'carrossel';

      // Assemble output format
      if (exportFormat === 'pdf') {
        setCurrentStep('Compilando documento PDF...');
        setProgress(90);

        const width = 1080;
        const height = format === '1:1' ? 1080 : format === '4:5' ? 1350 : format === '9:16' ? 1920 : 1800;
        const orientation = width > height ? 'l' : 'p';

        // Initialize jsPDF with matching unit coordinates
        const doc = new jsPDF({
          orientation,
          unit: 'px',
          format: [width, height],
          hotfixes: ['px_scaling']
        });

        // Add pages to PDF
        for (let i = 0; i < imagesData.length; i++) {
          if (i > 0) {
            doc.addPage([width, height], orientation);
          }
          const imageType = exportFormat === 'jpg' ? 'JPEG' : 'PNG';
          doc.addImage(imagesData[i].dataUrl, imageType, 0, 0, width, height, undefined, 'FAST');
        }

        // Save PDF
        doc.save(`${cleanFilename}.pdf`);

      } else {
        // PNG or JPG Exports
        if (exportRange === 'current' && imagesData.length === 1) {
          // Direct download if only exporting one slide
          setCurrentStep('Iniciando download...');
          setProgress(95);
          
          const url = URL.createObjectURL(imagesData[0].blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${cleanFilename}-${imagesData[0].name}`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          // Put all into a ZIP file if multiple slides
          setCurrentStep('Compactando arquivo ZIP...');
          setProgress(90);
          
          const zip = new JSZip();
          imagesData.forEach(img => {
            zip.file(img.name, img.blob);
          });
          
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          setProgress(95);
          
          const url = URL.createObjectURL(zipBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${cleanFilename}.zip`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }

      setProgress(100);
      setCurrentStep('Exportação concluída com sucesso!');
      setExportSuccess(true);
      
      // Auto close after 2 seconds on success
      setTimeout(() => {
        onClose();
        // Reset states
        setIsExporting(false);
        setExportSuccess(false);
        setProgress(0);
        setCurrentStep('');
      }, 2200);

    } catch (err) {
      console.error('Falha ao exportar:', err);
      alert(`Ocorreu um erro ao exportar: ${(err as Error).message || err}`);
      setIsExporting(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        {/* Backdrop cover click to close unless exporting */}
        <div className="absolute inset-0" onClick={() => !isExporting && onClose()} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-[#1C1C1C] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                <Download size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">Exportar Carrossel</h3>
                <p className="text-[11px] text-white/40 mt-0.5 max-w-[280px] truncate">Projeto: {projectName || 'Sem título'}</p>
              </div>
            </div>
            
            {!isExporting && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="p-6">
            {!isExporting ? (
              <div className="space-y-6">
                
                {/* 1. Format Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Formato do Arquivo</label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* PNG */}
                    <button
                      onClick={() => setExportFormat('png')}
                      className={`relative p-4 rounded-2xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                        exportFormat === 'png'
                          ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <FileImage size={24} className={exportFormat === 'png' ? 'text-blue-400' : 'text-white/40'} />
                      <div>
                        <div className="text-xs font-bold">Imagem PNG</div>
                        <div className="text-[9px] text-white/30 mt-0.5 font-medium">Fundo Transparente</div>
                      </div>
                    </button>

                    {/* JPG */}
                    <button
                      onClick={() => setExportFormat('jpg')}
                      className={`relative p-4 rounded-2xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                        exportFormat === 'jpg'
                          ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <FileImage size={24} className={exportFormat === 'jpg' ? 'text-blue-400' : 'text-white/40'} />
                      <div>
                        <div className="text-xs font-bold">Imagem JPG</div>
                        <div className="text-[9px] text-white/30 mt-0.5 font-medium">Compacto / Leve</div>
                      </div>
                    </button>

                    {/* PDF */}
                    <button
                      onClick={() => setExportFormat('pdf')}
                      className={`relative p-4 rounded-2xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer ${
                        exportFormat === 'pdf'
                          ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <FileText size={24} className={exportFormat === 'pdf' ? 'text-blue-400' : 'text-white/40'} />
                      <div>
                        <div className="text-xs font-bold">Documento PDF</div>
                        <div className="text-[9px] text-white/30 mt-0.5 font-medium">Multi-páginas</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Range Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Conteúdo do Carrossel</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setExportRange('all')}
                      className={`p-3.5 rounded-xl border font-bold text-xs transition-all text-center cursor-pointer ${
                        exportRange === 'all'
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Todos os Slides ({slides.length})
                    </button>
                    <button
                      onClick={() => setExportRange('current')}
                      className={`p-3.5 rounded-xl border font-bold text-xs transition-all text-center cursor-pointer ${
                        exportRange === 'current'
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Apenas Slide Atual
                    </button>
                  </div>
                </div>

                {/* 3. Scale and Quality Customizer */}
                <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <Sliders size={14} className="text-blue-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Ajustes Finos</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Scale Option */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] text-white/50 font-medium">Resolução / Escala:</span>
                        <span className="text-xs font-bold text-blue-400">{scale}x {scale === 2 ? '(HD)' : scale === 3 ? '(4K)' : '(Padrão)'}</span>
                      </div>
                      <div className="flex gap-1.5 p-0.5 bg-[#121212] border border-white/5 rounded-lg">
                        {[1, 2, 3].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setScale(val)}
                            className={`flex-1 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              scale === val ? 'bg-[#222] text-white shadow-sm' : 'text-white/40 hover:text-white'
                            }`}
                          >
                            {val}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conditional JPG compression slider style */}
                    <div className={exportFormat === 'jpg' ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] text-white/50 font-medium">Qualidade JPG / JPEG:</span>
                        <span className="text-xs font-bold text-blue-400">{jpgQuality}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={jpgQuality}
                        onChange={(e) => setJpgQuality(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer h-1.5 bg-[#121212] rounded-lg appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Text */}
                <p className="text-[10px] text-white/30 text-center leading-relaxed">
                  {exportFormat === 'pdf' 
                    ? 'O formato PDF criará um único arquivo unindo todos os slides renderizados com layout nativo perfeitos para apresentações.'
                    : exportRange === 'current'
                      ? `Você baixará diretamente o arquivo .${exportFormat === 'jpg' ? 'jpg' : 'png'} do slide atual.`
                      : `Será empacotada uma pasta compactada .ZIP organizada com todos os slides em formato .${exportFormat === 'jpg' ? 'jpg' : 'png'}.`
                  }
                </p>

                {/* Confirm Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs tracking-wider transition-colors cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={handleStartExport}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs tracking-wider shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} />
                    EXPORTAR AGORA
                  </button>
                </div>

              </div>
            ) : (
              // Export Processing Interface
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {exportSuccess ? (
                      <motion.div
                        key="success-icon"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-emerald-500"
                      >
                        <CheckCircle2 size={56} className="animate-bounce" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="loader-icon"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-blue-500"
                      >
                        <Loader2 size={56} className="animate-spin" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Subtle pulsing glow ring inside loader */}
                  {!exportSuccess && (
                    <div className="absolute w-[68px] h-[68px] border-2 border-dashed border-blue-500/10 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="space-y-2 max-w-sm">
                  <h4 className="text-sm font-bold text-white">
                    {exportSuccess ? 'Sessão concluída!' : 'Renderizando seu Material'}
                  </h4>
                  <p className="text-[11px] text-white/60 animate-pulse font-mono tracking-wide min-h-4">
                    {currentStep}
                  </p>
                </div>

                {/* High contrast custom bar progress */}
                <div className="w-full max-w-xs bg-black/60 rounded-full h-2 overflow-hidden border border-white/5 p-0.5">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                    className={`h-full rounded-full transition-colors duration-200 ${
                      exportSuccess ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                  />
                </div>

                <span className="text-[10px] font-mono font-bold text-white/30">
                  {progress}% processado
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
