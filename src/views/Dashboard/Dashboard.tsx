import { useState } from "react";
import SvgPasadores from "./Svgs/SvgPasadores";
import SvgBoyas from "./Svgs/SvgBoyas";
import SvgRedes from "./Svgs/SvgRedes";
import SvgPasillos from "./Svgs/SvgPasillos";
import { CardProps } from "../../assets/types/Dashboard";
import { 
  File, 
  FileText, 
  FileSpreadsheet, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown,
  Download
} from "lucide-react";
import SvgLineas from "./Svgs/SvgLineas";

function Card({ children }: CardProps) {
  return (
    <div className="flex-1 h-full overflow-hidden bg-gray-dark border border-gray-700/50 shadow-sm">
      {children}
    </div>
  );
}

// Estructura de archivos simulando el FTP
const fileStructure = {
  mod100: {
    // Archivos globales del módulo 100
    global: [
      { name: "Manual_General_Mod100.pdf", type: "pdf", size: "2.3 MB" },
      { name: "Especificaciones_Tecnicas_Mod100.docx", type: "doc", size: "1.8 MB" },
      { name: "Certificacion_Mod100.pdf", type: "pdf", size: "3.1 MB" },
      { name: "Planos_Generales_Mod100.pdf", type: "pdf", size: "4.5 MB" }
    ],
    boyas: [
      { name: "Manual_Boyas_Mod100.pdf", type: "pdf", size: "2.1 MB" },
      { name: "Especificaciones_Boyas.pdf", type: "pdf", size: "1.5 MB" },
      { name: "Certificacion_Boyas.docx", type: "doc", size: "0.9 MB" }
    ],
    pasadores: [
      { name: "Planos_Pasadores_Mod100.pdf", type: "pdf", size: "3.2 MB" },
      { name: "Instalacion_Pasadores.pdf", type: "pdf", size: "1.7 MB" }
    ],
    redes: [
      { name: "Redes_Mod100_Especificaciones.pdf", type: "pdf", size: "2.8 MB" },
      { name: "Mantenimiento_Redes.docx", type: "doc", size: "1.2 MB" }
    ],
    pasillos: [
      { name: "Diseño_Pasillos_Mod100.pdf", type: "pdf", size: "2.9 MB" },
      { name: "Seguridad_Pasillos.pdf", type: "pdf", size: "1.4 MB" }
    ],
    lineas: [
      { name: "Manual_Lineas_Mod100.pdf", type: "pdf", size: "2.1 MB" },
      { name: "Especificaciones_Lineas.pdf", type: "pdf", size: "1.5 MB" },
      { name: "Certificacion_Lineas.docx", type: "doc", size: "0.9 MB" }
    ],
  },
  mod200: {
    global: [
      { name: "Manual_General_Mod200.pdf", type: "pdf", size: "2.4 MB" },
      { name: "Especificaciones_Tecnicas_Mod200.docx", type: "doc", size: "2.1 MB" },
      { name: "Certificacion_Mod200.pdf", type: "pdf", size: "3.3 MB" }
    ],
    boyas: [
      { name: "Manual_Boyas_Mod200.pdf", type: "pdf", size: "2.2 MB" },
      { name: "Configuracion_Boyas_Avanzada.pdf", type: "pdf", size: "1.9 MB" }
    ],
    pasadores: [
      { name: "Planos_Pasadores_Mod200.pdf", type: "pdf", size: "3.4 MB" },
      { name: "Protocolo_Instalacion.pdf", type: "pdf", size: "1.8 MB" }
    ],
    redes: [
      { name: "Redes_Mod200_Avanzado.pdf", type: "pdf", size: "3.1 MB" },
      { name: "Calibracion_Redes.xlsx", type: "xls", size: "0.8 MB" }
    ],
    pasillos: [
      { name: "Diseño_Pasillos_Mod200.pdf", type: "pdf", size: "3.0 MB" },
      { name: "Optimizacion_Pasillos.pdf", type: "pdf", size: "1.6 MB" }
    ],
    lineas: [
      { name: "Manual_Lineas_Mod100.pdf", type: "pdf", size: "2.1 MB" },
      { name: "Especificaciones_Lineas.pdf", type: "pdf", size: "1.5 MB" },
      { name: "Certificacion_Lineas.docx", type: "doc", size: "0.9 MB" }
    ],
  },
  mod300: {
    global: [
      { name: "Manual_General_Mod300.pdf", type: "pdf", size: "2.6 MB" },
      { name: "Especificaciones_Tecnicas_Mod300.docx", type: "doc", size: "2.3 MB" },
      { name: "Certificacion_Mod300.pdf", type: "pdf", size: "3.5 MB" }
    ],
    boyas: [
      { name: "Manual_Boyas_Mod300.pdf", type: "pdf", size: "2.4 MB" },
      { name: "Troubleshooting_Boyas.pdf", type: "pdf", size: "2.1 MB" }
    ],
    pasadores: [
      { name: "Planos_Pasadores_Mod300.pdf", type: "pdf", size: "3.6 MB" },
      { name: "Mantenimiento_Pasadores.pdf", type: "pdf", size: "1.9 MB" }
    ],
    redes: [
      { name: "Redes_Mod300_Completo.pdf", type: "pdf", size: "3.3 MB" },
      { name: "Protocolo_Seguridad.docx", type: "doc", size: "1.4 MB" }
    ],
    pasillos: [
      { name: "Diseño_Pasillos_Mod300.pdf", type: "pdf", size: "3.2 MB" },
      { name: "Inspeccion_Pasillos.pdf", type: "pdf", size: "1.7 MB" }
    ],
    lineas: [
      { name: "Manual_Lineas_Mod100.pdf", type: "pdf", size: "2.1 MB" },
      { name: "Especificaciones_Lineas.pdf", type: "pdf", size: "1.5 MB" },
      { name: "Certificacion_Lineas.docx", type: "doc", size: "0.9 MB" }
    ],
  }
};

// Archivos estáticos para las otras pestañas
const staticFiles = {
  ambientales: [
    { name: "Reporte_Ambiental_2025.pdf", type: "pdf", size: "2.1 MB" },
    { name: "Datos_Temperatura.xlsx", type: "xls", size: "1.8 MB" },
    { name: "Calidad_Agua.pdf", type: "pdf", size: "3.2 MB" }
  ],
  fondeo: [
    { name: "Protocolo_Fondeo.pdf", type: "pdf", size: "2.5 MB" },
    { name: "Especificaciones_Anclaje.docx", type: "doc", size: "1.9 MB" },
    { name: "Seguridad_Fondeo.pdf", type: "pdf", size: "2.8 MB" }
  ],
  inspecciones: [
    { name: "Checklist_Inspecciones.pdf", type: "pdf", size: "1.7 MB" },
    { name: "Reporte_Semanal.docx", type: "doc", size: "1.3 MB" },
    { name: "Protocolo_Mantenimiento.pdf", type: "pdf", size: "2.4 MB" }
  ],
  varambientales: [
    { name: "informe_fondomarino.pdf", type: "pdf", size: "1.7 MB" },
    { name: "informe_viento.docx", type: "doc", size: "1.3 MB" },
    { name: "informe_temperatura.pdf", type: "pdf", size: "2.4 MB" }
  ],
  
};

// Componente para mostrar archivos descargables
const FileList = ({ files }: { files: Array<{ name: string; type: string; size: string }> }) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <File className="w-4 h-4 text-red-400" />;
      case 'doc': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'xls': return <FileSpreadsheet className="w-4 h-4 text-green-400" />;
      default: return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleDownload = (fileName: string) => {
    console.log(`Descargando: ${fileName}`);
    alert(`Iniciando descarga de: ${fileName}`);
  };

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-dark-osc rounded-lg hover:bg-gray-700 cursor-pointer transition-colors border border-gray-700/40"
        >
          <div className="flex items-center gap-3">
            {getFileIcon(file.type)}
            <div>
              <div className="text-sm text-white font-medium">{file.name}</div>
              <div className="text-xs text-gray-400">{file.size}</div>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(file.name);
            }}
            className="text-xs bg-red-dark hover:bg-red-500 px-3 py-2 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" />
            Descargar
          </button>
        </div>
      ))}
    </div>
  );
};

// Componente para la estructura de carpetas del FTP
function FolderStructure({ selectedModule }) {
  const [expandedFolders, setExpandedFolders] = useState(['Centros', 'PUDUGUAPI']);
  
  // Estructura de carpetas específica para PUDUGUAPI
  const folderStructure = {
    'Centros': {
      'PUDUGUAPI': {
        'Mod100': fileStructure.mod100.global || [],
        'Mod200': fileStructure.mod200.global || [],
        'Mod300': fileStructure.mod300.global || [],
        'Boyas': [
          ...(fileStructure.mod100.boyas || []),
          ...(fileStructure.mod200.boyas || []),
          ...(fileStructure.mod300.boyas || [])
        ],
        'Pasadores': [
          ...(fileStructure.mod100.pasadores || []),
          ...(fileStructure.mod200.pasadores || []),
          ...(fileStructure.mod300.pasadores || [])
        ],
        'Redes': [
          ...(fileStructure.mod100.redes || []),
          ...(fileStructure.mod200.redes || []),
          ...(fileStructure.mod300.redes || [])
        ],
        'Pasillos': [
          ...(fileStructure.mod100.pasillos || []),
          ...(fileStructure.mod200.pasillos || []),
          ...(fileStructure.mod300.pasillos || [])
        ],
        'Variables Ambientales': staticFiles.varambientales || [],
        'Fondeo': staticFiles.fondeo || [],
        'Inspecciones': staticFiles.inspecciones || []
      }
    }
  };

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(f => f !== folderName)
        : [...prev, folderName]
    );
  };

  const renderFolder = (folderName: string, contents: any, level = 0) => {
    const isExpanded = expandedFolders.includes(folderName);
    const hasSubfolders = typeof contents === 'object' && !Array.isArray(contents);
    const isDocumentsFolder = Array.isArray(contents);
    const paddingLeft = level * 20;

    return (
      <div key={folderName} className="select-none">
        <div 
          className={`flex items-center gap-2 p-2 rounded-md hover:bg-dark-osc cursor-pointer text-sm ${
            selectedModule && folderName.toLowerCase().includes(selectedModule.toLowerCase()) ? 'bg-blue-500/20 border border-blue-500/30' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => toggleFolder(folderName)}
        >
          {hasSubfolders && (
            isExpanded ? 
              <ChevronDown className="w-4 h-4 text-gray-400" /> :
              <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          
          {isDocumentsFolder ? (
            isExpanded ? 
              <FolderOpen className="w-4 h-4 text-blue-400" /> :
              <Folder className="w-4 h-4 text-blue-400" />
          ) : (
            isExpanded ? 
              <FolderOpen className="w-4 h-4 text-amber-400" /> :
              <Folder className="w-4 h-4 text-amber-400" />
          )}
          
          <span className="truncate text-gray-200">{folderName}</span>
          {selectedModule && folderName.toLowerCase().includes(selectedModule.toLowerCase()) && (
            <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-1">
            {hasSubfolders ? (
              Object.entries(contents).map(([subFolderName, subContents]) => 
                renderFolder(subFolderName, subContents, level + 1)
              )
            ) : isDocumentsFolder ? (
              <div style={{ paddingLeft: `${paddingLeft + 32}px` }} className="space-y-1 mt-2">
                {contents.map((doc: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer"
                    onClick={() => console.log('Descargar:', doc.name)}
                  >
                    <div className="flex items-center gap-2">
                      {doc.type === 'pdf' ? <File className="w-4 h-4 text-red-400" /> :
                       doc.type === 'xls' ? <FileSpreadsheet className="w-4 h-4 text-green-400" /> :
                       <FileText className="w-4 h-4 text-blue-400" />}
                      <span className="text-xs text-gray-300">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{doc.size}</span>
                      <Download className="w-3 h-3 text-gray-400 hover:text-white" />
                    </div>
                  </div>
                ))}
                {contents.length === 0 && (
                  <p className="text-xs text-gray-500 italic p-2">Sin documentos</p>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto">
      {Object.entries(folderStructure).map(([folderName, contents]) => 
        renderFolder(folderName, contents)
      )}
    </div>
  );
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeModule, setActiveModule] = useState<string>("Mod100");
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const tabs = [
    { id: 0, label: "Módulo", content: "Selecciona un módulo y componente para ver los archivos" },
    { id: 1, label: "Var.ambientales", content: "Archivos de variables ambientales del centro" },
    { id: 2, label: "Fondeo", content: "Documentación de fondeo" },
    { id: 3, label: "Inspecciones", content: "Reportes y checklists de inspecciones" },
    { id: 4, label: "FTP", content: "Estructura de archivos del centro" },
  ];

  // Función para obtener el SVG component según el componente activo
  const getActiveSvg = () => {
    switch (activeComponent) {
      case "Boyas":
        return <SvgBoyas />;
      case "Pasadores":
        return <SvgPasadores />;
      case "Redes":
        return <SvgRedes />;
      case "Pasillos":
        return <SvgPasillos />;
      case "Lineas":
        return <SvgLineas />;  
      default:
        return <SvgPasadores />;
    }
  };

  // Función para obtener archivos según la pestaña activa
  const getTabContent = () => {
    if (activeTab === 0) {
      // Pestaña Módulo - archivos específicos del módulo y componente
      if (activeModule && activeComponent) {
        const moduleKey = activeModule.toLowerCase();
        const componentKey = activeComponent.toLowerCase();
        
        if (fileStructure[moduleKey] && fileStructure[moduleKey][componentKey]) {
          return (
            <div>
              <h3 className="text-white font-medium mb-4 text-lg">
                {activeComponent} - {activeModule}
              </h3>
              <FileList files={fileStructure[moduleKey][componentKey]} />
            </div>
          );
        }
      } else if (activeModule) {
        // Mostrar archivos globales del módulo seleccionado
        const moduleKey = activeModule.toLowerCase();
        if (fileStructure[moduleKey] && fileStructure[moduleKey].global) {
          return (
            <div>
              <h3 className="text-white font-medium mb-4 text-lg">
                Documentos Globales - {activeModule}
              </h3>
              <FileList files={fileStructure[moduleKey].global} />
            </div>
          );
        }
      }
      return <p className="text-gray-400 text-center py-8">Selecciona un módulo y componente para ver los archivos disponibles</p>;
    } else if (activeTab === 4) {
      // Pestaña FTP - Estructura de carpetas
      return (
        <div>
          <h3 className="text-white font-medium mb-4 text-lg">
            Estructura de Archivos - Centro PUDUGUAPI
          </h3>
          <FolderStructure selectedModule={activeModule} />
        </div>
      );
    } else {
      // Otras pestañas - archivos estáticos
      const tabKey = tabs[activeTab].label.toLowerCase().replace(' ', '_').replace('.', '');
      if (staticFiles[tabKey]) {
        return (
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">
              {tabs[activeTab].label} - Archivos Globales del Centro
            </h3>
            <FileList files={staticFiles[tabKey]} />
          </div>
        );
      }
    }
    return <p className="text-gray-400">{tabs[activeTab].content}</p>;
  };

  return (
    <main className="flex-1 h-screen overflow-hidden p-2">
      <div className="flex flex-col h-full gap-2">
        {/* Primera sección - Información + Botones (1/3 de altura) */}
        <div className="h-1/3">
          <Card>
            <div className="flex flex-col h-full p-2">
              {/* Información de la compañía */}
              <div className="h-1/4 flex items-center justify-between px-3 border-b border-gray-700 pb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-dark/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">PUDUGUAPI</h2>
                    <div className="flex gap-4 mt-1">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">Localización:</span>
                        <span className="text-xs text-gray-300">Puerto Montt</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">PERIODO</span>
                        <span className="text-xs text-gray-300">2025</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">Estado:</span>
                        <span className="text-xs text-green-400">Operativo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-300 flex items-center justify-end">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-300 flex items-center justify-end mt-1">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="h-8 w-px bg-gray-600"></div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                        <span className="text-xs text-white">AD</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-300">Administrador</p>
                        <p className="text-xs text-gray-400">Nivel: Supervisor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenedor de botones más compacto */}
              <div className="flex-1 flex flex-col">
                {/* Fila superior de módulos */}
                <div className="h-1/2 flex gap-1 p-1">
                  {["Mod100", "Mod200", "Mod300"].map((mod) => (
                    <button
                      key={mod}
                      onClick={() => {
                        setActiveModule(mod);
                        setActiveComponent(null);
                      }}
                      className={`flex-1 flex items-center justify-center rounded text-sm transition-all duration-150 cursor-pointer ${
                        activeModule === mod
                          ? "bg-red-dark/10 border-l-3 border-red-dark text-white"
                          : "bg-dark-osc border-l-3 border-gray-600 hover:bg-gray-dark/70 text-gray-300"
                      }`}
                    >
                      {mod}
                    </button>
                  ))}
                </div>

                {/* Fila inferior de componentes */}
                <div className="h-1/2 flex gap-1 p-1">
                  {["Boyas", "Pasadores", "Redes", "Pasillos","Lineas"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveComponent(item)}
                      className={`flex-1 flex items-center justify-center rounded text-sm border-l-2 transition-all duration-150 cursor-pointer ${
                        activeComponent === item
                          ? "bg-red-dark/10 border-red-dark/50 text-white"
                          : "bg-dark-osc border-gray-600 hover:bg-red-dark/10 hover:border-red-dark/50 text-gray-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Segunda sección (2/3 de altura) */}
        <div className="h-2/3 flex gap-2">
          {/* Gráfico SVG (50% ancho) */}
          <div className="w-1/2 h-full">
            <Card>
              <div className="h-full flex items-center justify-center p-2">
                {getActiveSvg()}
              </div>
            </Card>
          </div>

          {/* Pestañas (50% ancho) */}
          <div className="w-1/2 h-full">
            <Card>
              <div className="flex flex-col h-full">
                {/* Barra de pestañas */}
                <div className="flex border-b border-gray-700">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-2 text-xs font-medium flex-1 text-center transition-colors duration-150 cursor-pointer ${
                        activeTab === tab.id
                          ? "text-white border-b-2 border-red-dark"
                          : "text-gray-400 hover:text-white hover:bg-gray-dark"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Contenido de pestañas */}
                <div className="flex-1 p-4 overflow-auto">
                  <div className="text-gray-300">
                    {getTabContent()}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};