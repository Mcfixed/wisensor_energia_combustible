import { useState } from "react";
import { FileText, Wrench, BellDot, File, FileSpreadsheet, Download, FolderKanban, ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { MapComponent } from './MapComponent';

// --- Componentes de UI (mantenemos los mismos) ---
function Card({ children, className = "" }) {
  return <div className={`bg-dark-osc border border-gray-700/30 shadow-sm ${className}`}>{children}</div>;
}

function StatCard({ title, value, valueColor = "text-white" }) {
  return (
    <Card className="p-4 flex-1">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
    </Card>
  );
}

function ActivityItem({ icon, actor, action, time, iconBgColor }) {
  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${iconBgColor}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-200"><span className="font-semibold text-white">{actor}</span> {action}</p>
        <p className="text-xs text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function DocumentItem({ icon, name, onDownload }) {
  return (
    <li className="flex items-center justify-between p-1 rounded-md hover:bg-dark-osc text-xs">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {icon}
        <span className="truncate">{name}</span>
      </div>
      <Download 
        className="w-3 h-3 text-gray-500 hover:text-white cursor-pointer flex-shrink-0" 
        onClick={onDownload}
      />
    </li>
  );
}

// --- Nuevo componente para la estructura de carpetas ---
function FolderStructure({ documentsData, selectedCage, onFolderClick, expandedFolders, selectedModule }) {
  // Estructura de carpetas base con TODOS los centros
  const folderStructure = {
    'Centros': {
      'Angosta S25': {
        'Mod100': documentsData['h-a-1'] || [],
        'Mod200': documentsData['h-b-1'] || [],
        'Pontón': documentsData['h-p-1'] || [],
        'Documentos Generales': [
          { id: 'angosta-gen-1', name: 'Estudio_Ambiente_Angosta.pdf', type: 'pdf', size: '2.1 MB' },
          { id: 'angosta-gen-2', name: 'Plan_Manejo_Angosta.docx', type: 'doc', size: '1.5 MB' }
        ]
      },
      'Verdugo S25': {
        'Mod100': documentsData['r-c-1'] || [],
        'Documentos Generales': [
          { id: 'verdugo-gen-1', name: 'Licencia_Ambiental_Verdugo.pdf', type: 'pdf', size: '3.2 MB' }
        ]
      },
      'Queullin S25': {
        'Mod100': [],
        'Mod200': [],
        'Pontón': [],
        'Documentos Generales': [
          { id: 'queullin-gen-1', name: 'Informe_Produccion_Queullin.xlsx', type: 'excel', size: '1.8 MB' }
        ]
      },
      'Quillaipe S25': {
        'Mod100': [],
        'Pontón': [],
        'Documentos Generales': [
          { id: 'quillaipe-gen-1', name: 'Auditoria_Calidad_Quillaipe.pdf', type: 'pdf', size: '2.4 MB' }
        ]
      },
      'Puelo S25': {
        'Mod100': [],
        'Pontón': [],
        'Documentos Generales': [
          { id: 'puelo-gen-1', name: 'Contrato_Arrendamiento_Puelo.docx', type: 'doc', size: '1.2 MB' }
        ]
      },
      'Errazuriz S25': {
        'Mod100': [],
        'Mod200': [],
        'Pontón': [],
        'Documentos Generales': [
          { id: 'errazuriz-gen-1', name: 'Plan_Seguridad_Errazuriz.pdf', type: 'pdf', size: '3.5 MB' }
        ]
      },
      'Alao S25': {
        'Mod100': [],
        'Mod200': [],
        'Pontón': [],
        'Documentos Generales': [
          { id: 'alao-gen-1', name: 'Estudio_Tecnico_Alao.pdf', type: 'pdf', size: '4.1 MB' }
        ]
      }
    }
  };

  const renderFolder = (folderName, contents, level = 0) => {
    const isExpanded = expandedFolders.includes(folderName);
    const hasSubfolders = typeof contents === 'object' && !Array.isArray(contents);
    const isDocumentsFolder = Array.isArray(contents);
    const paddingLeft = level * 12;

    // Determinar si esta carpeta está seleccionada (resaltar)
    const isSelected = selectedModule && 
      ((level === 1 && folderName === selectedModule.centerName) || 
       (level === 2 && folderName === selectedModule.moduleName));

    return (
      <div key={folderName} className="select-none">
        <div 
          className={`flex items-center gap-1 p-1 rounded-md hover:bg-dark-osc cursor-pointer text-xs ${
            isSelected ? 'bg-blue-500/20 border border-blue-500/30' : ''
          } ${
            selectedCage && isDocumentsFolder && contents.some(doc => doc.id === selectedCage.id) ? 'bg-blue-500/20' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => onFolderClick(folderName)}
        >
          {hasSubfolders ? (
            isExpanded ? 
              <ChevronDown className="w-3 h-3 text-gray-400" /> :
              <ChevronRight className="w-3 h-3 text-gray-400" />
          ) : null}
          
          {isDocumentsFolder ? (
            isExpanded ? 
              <FolderOpen className="w-3 h-3 text-blue-400" /> :
              <Folder className="w-3 h-3 text-blue-400" />
          ) : (
            isExpanded ? 
              <FolderOpen className="w-3 h-3 text-amber-400" /> :
              <Folder className="w-3 h-3 text-amber-400" />
          )}
          
          <span className="truncate">{folderName}</span>
          {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>}
        </div>

        {isExpanded && (
          <div className="mt-1">
            {hasSubfolders ? (
              Object.entries(contents).map(([subFolderName, subContents]) => 
                renderFolder(subFolderName, subContents, level + 1)
              )
            ) : isDocumentsFolder ? (
              <div style={{ paddingLeft: `${paddingLeft + 20}px` }} className="space-y-1">
                {contents.map((doc) => (
                  <DocumentItem
                    key={doc.id}
                    icon={
                      doc.type === 'pdf' ? <File className="w-3 h-3 text-red-400" /> :
                      doc.type === 'excel' ? <FileSpreadsheet className="w-3 h-3 text-green-400" /> :
                      <FileText className="w-3 h-3 text-blue-400" />
                    }
                    name={doc.name}
                    onDownload={() => console.log('Descargar:', doc.name)}
                  />
                ))}
                {contents.length === 0 && (
                  <p className="text-xs text-gray-500 italic p-1">Sin documentos</p>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {Object.entries(folderStructure).map(([folderName, contents]) => 
        renderFolder(folderName, contents)
      )}
    </div>
  );
}

// === COMPONENTE PRINCIPAL DEL DASHBOARD ===
export const Dashboard2 = () => {
  // --- Estructura de Datos COMPLETA con todos los centros ---
  const centersData = [
    {
      id: 'centro-angosta', name: 'Angosta S25',
      position: [-45.342, -73.085],
      modules: [
        { id: 'mod-100h', name: 'Mod100', position: [-45.3324061, -73.0751678], status: 'normal', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-a-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'mod-200h', name: 'Mod200', position: [-45.3424061, -73.0851678], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-b-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'Pontónh', name: 'Pontón', position: [-45.3524061, -73.0951678], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-p-${i + 1}`, name: `Jaula ${i + 1}` })) }
      ]
    },
    {
      id: 'centro-verdugo', name: 'Verdugo S25',
      position: [-44.148283, -73.663347],
      modules: [
        { id: 'mod-100v', name: 'Mod100', position: [-44.148283, -73.663347], status: 'normal', cages: Array.from({ length: 6 }, (_, i) => ({ id: `r-c-${i + 1}`, name: `Jaula ${i + 1}` })) }
      ]
    },
    {
      id: 'centro-queullin', name: 'Queullin S25',
      position: [-41.868, -72.903],
      modules: [
        { id: 'mod-100q', name: 'Mod100', position: [-41.85835325, -72.893586139453], status: 'normal', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-a-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'mod-200q', name: 'Mod200', position: [-41.86835325, -72.903586139453], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-b-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'Pontónq', name: 'Pontón', position: [-41.87835325, -72.913586139453], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-p-${i + 1}`, name: `Jaula ${i + 1}` })) }
      ]
    },
    {
      id: 'centro-quillaipe', name: 'Quillaipe S25',
      position: [-41.600, -72.802],
      modules: [
        { id: 'mod-100qu', name: 'Mod100', position: [-41.595974766312, -72.797455768359], status: 'normal', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-a-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'Pontónqu', name: 'Pontón', position: [-41.605974766312, -72.807455768359], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-p-${i + 1}`, name: `Jaula ${i + 1}` })) }
      ]
    },
    {
      id: 'centro-puelo', name: 'Puelo S25',
      position: [-41.663, -72.351],
      modules: [
        { id: 'mod-100p', name: 'Mod100', position: [-41.65862470287029, -72.34681522560221], status: 'normal', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-a-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'Pontónp', name: 'Pontón', position: [-41.66862470287029, -72.35681522560221], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-p-${i + 1}`, name: `Jaula ${i + 1}` })) }
      ]
    },
    {
      id: 'centro-errazuriz', name: 'Errazuriz S25',
      position: [-42.994, -72.805],
      modules: [
        { id: 'mod-100e', name: 'Mod100', position: [-42.98455499943645, -72.79528400336858], status: 'normal', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-a-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'mod-200e', name: 'Mod200', position: [-42.99455499943645, -72.80528400336858], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-b-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'Pontóne', name: 'Pontón', position: [-43.00455499943645, -72.81528400336858], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-p-${i + 1}`, name: `Jaula ${i + 1}` })) }
      ]
    },
    {
      id: 'centro-alao', name: 'Alao S25',
      position: [-42.558, -73.289],
      modules: [
        { id: 'mod-100a', name: 'Mod100', position: [-42.548193940325035, -73.27916998474393], status: 'normal', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-a-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'mod-200a', name: 'Mod200', position: [-42.558193940325035, -73.28916998474393], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-b-${i + 1}`, name: `Jaula ${i + 1}` })) },
        { id: 'Pontóna', name: 'Pontón', position: [-42.568193940325035, -73.29916998474393], status: 'mantenimiento', cages: Array.from({ length: 10 }, (_, i) => ({ id: `h-p-${i + 1}`, name: `Jaula ${i + 1}` })) }
      ]
    }
  ];

  // --- Datos de documentos (expandidos) ---
  const documentsData = {
    'h-a-1': [
      { id: 'h-a-1-doc1', name: 'OrdenCompra_Jaula1.pdf', type: 'pdf', size: '1.2 MB' },
      { id: 'h-a-1-doc2', name: 'Instalacion_Jaula1.docx', type: 'doc', size: '0.8 MB' }
    ],
    'h-a-2': [
      { id: 'h-a-2-doc1', name: 'InformeBiometria_Jaula2.xlsx', type: 'excel', size: '876 KB' }, 
      { id: 'h-a-2-doc2', name: 'CertificadoSanitario_Jaula2.pdf', type: 'pdf', size: '3.1 MB' }
    ],
    'h-a-3': [], 
    'h-a-4': [{ id: 'h-a-4-doc1', name: 'PlanAlimentacion_Jaula4.docx', type: 'doc', size: '540 KB' }],
    'h-b-1': [{ id: 'h-b-1-doc1', name: 'RegistroMantenimiento_Jaula1.pdf', type: 'pdf', size: '950 KB' }],
    'r-c-1': [{ id: 'r-c-1-doc1', name: 'Factura_Insumos_Jaula1.pdf', type: 'pdf', size: '2.5 MB' }],
    'h-p-1': [
      { id: 'h-p-1-doc1', name: 'Control_Calidad_Ponton.pdf', type: 'pdf', size: '1.8 MB' },
      { id: 'h-p-1-doc2', name: 'Bitacora_Operaciones.xlsx', type: 'excel', size: '1.1 MB' }
    ],
  };

  // --- Estados de la aplicación ---
  const [rightColumnTab, setRightColumnTab] = useState('reciente');
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedCage, setSelectedCage] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(['Centros']);

  // --- Lógica para encontrar los datos seleccionados ---
  const selectedModule = centersData.flatMap(c => c.modules).find(m => m.id === selectedModuleId);
  const selectedCenter = centersData.find(center => center.modules.some(m => m.id === selectedModuleId));

  // --- Nuevo estado para el módulo seleccionado en documentos ---
  const [selectedModuleForDocs, setSelectedModuleForDocs] = useState(null);

  // --- Manejador para cuando se hace clic en un módulo en el navegador ---
  const handleModuleClick = (moduleId) => {
    setSelectedModuleId(moduleId);
    
    // Encontrar el módulo y centro correspondientes
    const module = centersData.flatMap(c => c.modules).find(m => m.id === moduleId);
    const center = centersData.find(c => c.modules.some(m => m.id === moduleId));
    
    if (module && center) {
      // Cambiar a la pestaña de documentos
      setRightColumnTab('documentos');
      
      // Establecer el módulo seleccionado para documentos
      setSelectedModuleForDocs({
        centerName: center.name,
        moduleName: module.name
      });
      
      // Expandir automáticamente las carpetas correspondientes
      const newExpandedFolders = ['Centros', center.name, module.name];
      setExpandedFolders(newExpandedFolders);
      
      // Limpiar la jaula seleccionada si había una
      setSelectedCage(null);
    }
  };

  // --- Manejador para cuando se hace clic en una jaula en el mapa ---
  const handleCageClick = (cage) => {
    setSelectedCage(cage);
    setRightColumnTab('documentos');
    
    // Expande automáticamente la carpeta correspondiente
    const centerName = centersData.find(center => 
      center.modules.some(module => 
        module.cages.some(c => c.id === cage.id)
      )
    )?.name;

    if (centerName) {
      const moduleName = centersData.flatMap(c => c.modules).find(module => 
        module.cages.some(c => c.id === cage.id)
      )?.name;

      const newExpandedFolders = ['Centros', centerName];
      if (moduleName) {
        newExpandedFolders.push(moduleName);
        setSelectedModuleForDocs({
          centerName: centerName,
          moduleName: moduleName
        });
      }
      setExpandedFolders(newExpandedFolders);
    }
  };

  // --- Manejador para carpetas ---
  const handleFolderClick = (folderName) => {
    setExpandedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(f => f !== folderName)
        : [...prev, folderName]
    );
  };

  // --- Función para encontrar documentos de una jaula ---
  const getCageDocuments = (cageId) => {
    return documentsData[cageId] || [];
  };

  return (
    <main className="bg-gray-dark text-gray-200 h-screen flex p-2 gap-2">
      {/* Columna Izquierda - Navegador de Activos */}
      <div className="w-64 flex-shrink-0">
        <Card className="h-full p-4 flex flex-col">
          <h2 className="font-bold text-white mb-4 text-sm">Navegador de Activos</h2>
          <nav className="space-y-2">
            {centersData.map(center => (
              <details key={center.id} open={center.id === selectedCenter?.id}>
                <summary className="cursor-pointer text-sm font-semibold">{center.name}</summary>
                <ul className="pl-4 mt-2 space-y-1 text-xs">
                  {center.modules.map(module => (
                    <li key={module.id}
                        className={`p-1 rounded cursor-pointer ${selectedModuleId === module.id ? 'bg-red-dark/10 text-white font-semibold' : 'text-gray-300 hover:bg-dark-osc'}`}
                        onClick={() => handleModuleClick(module.id)}>
                      {module.name}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
        </Card>
      </div>

      {/* Columna Central - Contenido Principal */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-48">
          <Card className="h-full flex flex-col p-4">
            <h3 className="font-bold text-white text-sm mb-3">
              Información: {selectedCenter?.name || 'Visión General'} 
              {selectedModule ? ` (${selectedModule.name})` : ''}
            </h3>
            
            <div className="flex-1 flex gap-4 pt-1 overflow-hidden">
              {/* Columna izquierda - Información básica */}
              <div className="w-2/5 space-y-2 text-sm border-r border-gray-700/50 pr-4">
                <div className="min-h-[24px]">
                  <p className="text-xs text-gray-500 font-semibold leading-none">JEFE DE CENTRO</p>
                  <p className="font-medium text-gray-200 text-xs leading-tight">
                    {selectedCenter ? 'Roberto Martínez' : 'N/A'}
                  </p>
                </div>
                <div className="min-h-[24px]">
                  <p className="text-xs text-gray-500 font-semibold leading-none">CÓDIGO RNA</p>
                  <p className="font-medium text-gray-200 text-xs leading-tight">
                    {selectedCenter ? '10-4589' : 'N/A'}
                  </p>
                </div>
                <div className="min-h-[24px]">
                  <p className="text-xs text-gray-500 font-semibold leading-none">JAULAS EN MÓDULO</p>
                  <p className="font-medium text-gray-200 text-xs leading-tight">
                    {selectedModule?.cages.length || 0}
                  </p>
                </div>
              </div>

              {/* Columna derecha - Documentos */}
              <div className="w-3/5 flex flex-col">
                <h4 className="text-xs text-gray-500 font-semibold mb-2">DOCUMENTOS DEL CENTRO</h4>
                <div className="flex-1 overflow-y-auto space-y-1">
                  <DocumentItem 
                    icon={<File className="w-3 h-3 text-red-400" />}
                    name="Estudio_de_ambiente.pdf"
                    onDownload={() => console.log('Descargar Estudio_de_ambiente.pdf')}
                  />
                  <DocumentItem 
                    icon={<FileSpreadsheet className="w-3 h-3 text-green-400" />}
                    name="Estudio_de_agua.xlsx"
                    onDownload={() => console.log('Descargar Estudio_de_agua.xlsx')}
                  />
                  <DocumentItem 
                    icon={<FileText className="w-3 h-3 text-blue-400" />}
                    name="Plan_de_Manejo.docx"
                    onDownload={() => console.log('Descargar Plan_de_Manejo.docx')}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2">
          <StatCard title="Estado Operativo" value="98.5%" valueColor="text-green-400" />
          <StatCard title="Activos Totales" value="12,483" />
          <StatCard title="Alertas Activas" value="42" />
          <StatCard title="Mantenimientos Atrasados" value="12" valueColor="text-red-dark" />
        </div>

        <div className="flex-1">
          <Card className="h-full flex flex-col">
            <div className="flex-1 h-full rounded-md overflow-hidden p-0.5">
              <MapComponent
                  centersData={centersData}
                  selectedModuleId={selectedModuleId}
                  onSelectModule={setSelectedModuleId}
                  onCageClick={handleCageClick}
              />
            </div>
            <div className="p-2 text-xs text-gray-500 border-t border-gray-700/50">
              Zoom: {selectedModuleId ? '13' : '8'}, Lat: {selectedModule?.position[0].toFixed(2) || '-43.00'}, Lon: {selectedModule?.position[1].toFixed(2) || '-73.00'}
            </div>
          </Card>
        </div>
      </div>

      {/* Columna Derecha - Actividad, Alertas y Documentos */}
      <div className="w-80 flex-shrink-0">
        <Card className="h-full flex flex-col">
          <div className="flex border-b border-gray-700/50">
            <button onClick={() => setRightColumnTab("reciente")} className={`flex-1 text-sm p-2 transition-colors duration-150 ${rightColumnTab === "reciente" ? "text-white border-b-2 border-red-dark" : "text-gray-400 hover:bg-dark-osc"}`}>Actividad</button>
            <button onClick={() => setRightColumnTab("alertas")} className={`flex-1 text-sm p-2 transition-colors duration-150 ${rightColumnTab === "alertas" ? "text-white border-b-2 border-red-dark" : "text-gray-400 hover:bg-dark-osc"}`}>Alertas</button>
            <button onClick={() => setRightColumnTab("documentos")} className={`flex-1 text-sm p-2 transition-colors duration-150 ${rightColumnTab === "documentos" ? "text-white border-b-2 border-red-dark" : "text-gray-400 hover:bg-dark-osc"}`}>Documentos</button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {rightColumnTab === 'reciente' && (
              <div className="space-y-4">
                <ActivityItem icon={<FileText className="w-4 h-4 text-blue-300"/>} actor="Diego Alvarez" action="subió un documento a Jaula J-02." time="Hace 15 minutos" iconBgColor="bg-blue-500/20"/>
                <ActivityItem icon={<Wrench className="w-4 h-4 text-green-300"/>} actor="Juan Pérez" action="completó un mantenimiento." time="Hace 1 hora" iconBgColor="bg-green-500/20"/>
                <ActivityItem icon={<BellDot className="w-4 h-4 text-yellow-300"/>} actor="Alerta automática" action="generada en Red RD-0765." time="Hace 3 horas" iconBgColor="bg-yellow-500/20"/>
              </div>
            )}
            {rightColumnTab === 'alertas' && (
              <div className="text-center text-gray-500 pt-8"><p>No hay alertas prioritarias nuevas.</p></div>
            )}
            {rightColumnTab === 'documentos' && (
              <div>
                {selectedCage ? (
                  <div>
                    <h4 className="font-bold text-white mb-3">Documentos de: {selectedCage.name}</h4>
                    <div className="mb-4 p-2 bg-blue-500/10 rounded-md border border-blue-500/30">
                      <p className="text-xs text-blue-300">
                        Jaula seleccionada en <span className="font-semibold">{selectedCenter?.name} - {selectedModule?.name}</span>
                      </p>
                    </div>
                    {getCageDocuments(selectedCage.id).length > 0 ? (
                      <ul className="space-y-2">
                        {getCageDocuments(selectedCage.id).map(doc => (
                          <li key={doc.id} className="flex items-center gap-3 p-2 bg-dark-osc rounded-md">
                            {doc.type === 'pdf' && <File className="w-5 h-5 text-red-400 flex-shrink-0"/>}
                            {doc.type === 'excel' && <FileSpreadsheet className="w-5 h-5 text-green-400 flex-shrink-0"/>}
                            {doc.type === 'doc' && <FileText className="w-5 h-5 text-blue-400 flex-shrink-0"/>}
                            <div className="flex-grow">
                              <p className="text-sm font-medium text-gray-200">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.size}</p>
                            </div>
                            <Download className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"/>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Esta jaula no tiene documentos.</p>
                    )}
                  </div>
                ) : selectedModuleForDocs ? (
                  <div className="mb-4 p-2 bg-green-500/10 rounded-md border border-green-500/30">
                    <p className="text-xs text-green-300">
                      Módulo seleccionado: <span className="font-semibold">{selectedModuleForDocs.centerName} - {selectedModuleForDocs.moduleName}</span>
                    </p>
                  </div>
                ) : null}
                
                <h4 className="font-bold text-white mb-3 mt-4">Estructura de Documentos</h4>
                <FolderStructure 
                  documentsData={documentsData}
                  selectedCage={selectedCage}
                  onFolderClick={handleFolderClick}
                  expandedFolders={expandedFolders}
                  selectedModule={selectedModuleForDocs}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
};