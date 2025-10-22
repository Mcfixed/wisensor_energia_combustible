import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// --- Arreglo Ícono Leaflet (sin cambios) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Componente MapFlyTo (sin cambios) ---
function MapFlyTo({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, zoom, { duration: 1.5 });
  }, [position, zoom, map]);
  return null;
}

// --- Componente MapZoomTracker (sin cambios) ---
function MapZoomTracker({ setZoom, initialZoom }) {
  const map = useMapEvents({ zoomend: () => { setZoom(map.getZoom()); } });
  useEffect(() => { setZoom(initialZoom); }, [initialZoom, setZoom]);
  return null;
}

// --- Componente CenterMarker (sin cambios) ---
function CenterMarker({ center, zoomThreshold }) {
  const map = useMap();
  const createCenterIcon = (center) => {
    return L.divIcon({
      className: 'custom-center-icon',
      html: `<div class="p-2 rounded-md shadow-md flex flex-col items-center justify-center text-center w-[120px] h-[50px] bg-amber-800/60 backdrop-blur-sm ring-2 ring-amber-500 cursor-pointer hover:bg-amber-700/60 transition-colors">
               <div class="font-bold text-sm text-white">${center.name}</div>
               <div class="text-xs text-gray-200 mt-0.5">${center.modules.length} Módulos</div>
             </div>`,
      iconSize: [120, 50], iconAnchor: [60, 25],
    });
  };
  const handleClick = () => { map.flyTo(center.position, zoomThreshold + 1); };
  return <Marker position={center.position} icon={createCenterIcon(center)} eventHandlers={{ click: handleClick }} />;
}


const createModuleIcon = (module, isSelected) => {
    // Marcador simple (sin cambios)
    if (!isSelected) {
        // ... (código del marcador simple sin cambios)
        const simpleBgColor = module.status === 'mantenimiento' ? 'bg-yellow-800/50' : 'bg-gray-800/50';
        return L.divIcon({
            className: 'custom-module-icon-simple',
            html: `<div class="p-2 rounded-md shadow-lg flex flex-col items-center justify-center text-center w-[100px] h-[60px] ${simpleBgColor} backdrop-blur-sm ring-1 ring-gray-600 cursor-pointer hover:ring-gray-400 transition-all">
                       <div class="font-bold text-sm text-white">${module.name}</div>
                       <div class="text-xs text-gray-400 mt-1">${module.cages.length} Jaulas</div>
                   </div>`,
            iconSize: [100, 60], iconAnchor: [50, 30],
        });
    }

    // --- Grid SVG interactivo (cuando está seleccionado) ---
    let cageElements = '';
    let hallwayBaseElements = '';
    let hallwaySegmentElements = '';
    let intersectionElements = ''; 
    const hallwayColor = '#11cd72';
    const outerHallwayColor = '#11cd72';
    const segmentStrokeColor = '#4B5563';
    // ... (Parámetros Dinámicos, Cálculo de Dimensiones - sin cambios) ...
    const cageCount = module.cages.length;
    const segmentsPerSide = module.segmentsPerSide || 4;
    const cageWidth = 90;
    const cageHeight = 90;
    const gap = 12; 
    const outerPadding = 15;
    let cols, rows;
    let isValidGrid = false;
    if (cageCount >= 4 && cageCount % 2 === 0) {
        rows = 2;
        cols = cageCount / 2;
        isValidGrid = true;
    } else {
        rows = 1;
        cols = cageCount;
        isValidGrid = false;
    }
    const innerGridWidth = (cols * cageWidth) + ((cols - 1) * gap);
    const innerGridHeight = (rows * cageHeight) + ((rows - 1) * gap);
    let totalWidth, totalHeight;
    if (isValidGrid) {
        totalWidth = innerGridWidth + (2 * gap) + (2 * outerPadding);
        totalHeight = innerGridHeight + (2 * gap) + (2 * outerPadding);
    } else {
        totalWidth = innerGridWidth + (2 * outerPadding);
        totalHeight = innerGridHeight + (2 * outerPadding);
    }
    const segmentLengthV = cageHeight / segmentsPerSide;
    const segmentLengthH = cageWidth / segmentsPerSide;

    // --- Dibuja Elementos (Solo si es un grid 2xN válido) ---
    if (isValidGrid) {
        // 1. Dibuja Rectángulos Base para Pasillos (Visual) (sin cambios)
        // ... (código de hallwayBaseElements sin cambios) ...
        hallwayBaseElements += `<rect x="${outerPadding}" y="${outerPadding}" width="${innerGridWidth + (2 * gap)}" height="${gap}" fill="${outerHallwayColor}" />`; // Top
        hallwayBaseElements += `<rect x="${outerPadding}" y="${outerPadding + innerGridHeight + gap}" width="${innerGridWidth + (2 * gap)}" height="${gap}" fill="${outerHallwayColor}" />`; // Bottom
        hallwayBaseElements += `<rect x="${outerPadding}" y="${outerPadding + gap}" width="${gap}" height="${innerGridHeight}" fill="${outerHallwayColor}" />`; // Left
        hallwayBaseElements += `<rect x="${outerPadding + innerGridWidth + gap}" y="${outerPadding + gap}" width="${gap}" height="${innerGridHeight}" fill="${outerHallwayColor}" />`; // Right
        hallwayBaseElements += `<rect x="${outerPadding + gap}" y="${outerPadding + gap + cageHeight}" width="${innerGridWidth}" height="${gap}" fill="${hallwayColor}" />`; // Horizontal Interno
        for (let i = 0; i < cols - 1; i++) {
            hallwayBaseElements += `<rect x="${outerPadding + gap + (i + 1) * cageWidth + i * gap}" y="${outerPadding + gap}" width="${gap}" height="${innerGridHeight}" fill="${hallwayColor}" />`; // Verticales Internos
        }

        // 2. Dibuja Segmentos Clickeables (Rectángulos finos) --- MODIFICADO ---
        
        // --- NUEVO: Lógica JS para el popup (minificada para ir inline) ---
        // Usamos module.id para asegurar IDs únicos
        const popupLogic = (segmentName) => `
            event.stopPropagation();
            const c = this.closest('.module-grid-container');
            if (!c) return;
            const p = c.querySelector('#seg-popup-${module.id}');
            const co = c.querySelector('#seg-popup-content-${module.id}');
            if (p && co) {
                co.innerHTML = 'Información Pasillo: <strong>${segmentName}</strong>';
                const r = c.getBoundingClientRect();
                const x = event.clientX - r.left;
                const y = event.clientY - r.top;
                p.style.left = (x + 15) + 'px';
                p.style.top = (y + 15) + 'px';
                p.style.display = 'block';
            }
        `.replace(/\s+/g, ' ').trim(); // Limpia espacios y saltos de línea

        // Horizontales (Top: C, Middle: CR, Bottom: A)
        ['C', 'CR', 'A'].forEach((prefix, r) => {
            const yRect = outerPadding + r * (cageHeight + gap);
            for (let c = 0; c < cols; c++) {
                for (let s = 0; s < segmentsPerSide; s++) {
                    const segmentIndex = c * segmentsPerSide + s + 1;
                    const xRect = outerPadding + gap + c * (cageWidth + gap) + s * segmentLengthH;
                    const segmentName = `${prefix}${segmentIndex}`;
                    // --- MODIFICADO: onclick ahora llama a la lógica del popup ---
                    const clickHandler = popupLogic(segmentName);
                    hallwaySegmentElements += `<rect class="hallway-segment" x="${xRect}" y="${yRect}" width="${segmentLengthH}" height="${gap}" fill="transparent" stroke="${segmentStrokeColor}" stroke-width="0.5" style="cursor: pointer;" onclick="${clickHandler}"/>`;
                }
            }
        });
        // Verticales (Laterales: L, R, Intermedios: V_X_Y)
        for (let c = 0; c <= cols; c++) {
            const xRect = outerPadding + c * (cageWidth + gap);
            for (let r = 0; r < rows; r++) {
                for (let s = 0; s < segmentsPerSide; s++) {
                    const segmentIndex = s + 1;
                    const yRect = outerPadding + gap + r * (cageHeight + gap) + s * segmentLengthV;
                    let segmentName = '';
                    if (c === 0) segmentName = `L${r * segmentsPerSide + segmentIndex}`;
                    else if (c === cols) segmentName = `R${r * segmentsPerSide + segmentIndex}`;
                    else segmentName = `V${c}_${r * segmentsPerSide + segmentIndex}`;
                    // --- MODIFICADO: onclick ahora llama a la lógica del popup ---
                    const clickHandler = popupLogic(segmentName);
                    hallwaySegmentElements += `<rect class="hallway-segment" x="${xRect}" y="${yRect}" width="${gap}" height="${segmentLengthV}" fill="transparent" stroke="${segmentStrokeColor}" stroke-width="0.5" style="cursor: pointer;" onclick="${clickHandler}"/>`;
                }
            }
        }

        // --- 3. Dibuja Intersecciones Clickeables (sin cambios) ---
        for (let r = 0; r <= rows; r++) { 
            const yIntersect = outerPadding + r * (cageHeight + gap);
            for (let c = 0; c <= cols; c++) { 
                const xIntersect = outerPadding + c * (cageWidth + gap);
                const intersectionName = `Int-${r}-${c}`; 
                intersectionElements += `
                    <rect class="intersection"
                          x="${xIntersect}" y="${yIntersect}" 
                          width="${gap}" height="${gap}" 
                          fill="transparent" 
                          style="cursor: crosshair;"
                          onclick="alert('Intersección: ${intersectionName}')"/>`;
            }
        }

    } // Fin if(isValidGrid)

    // --- 4. Dibuja las Jaulas (sin cambios) ---
    // ... (código de cageElements sin cambios) ...
    module.cages.slice(0, cols * rows).forEach((cage, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const startOffset = isValidGrid ? outerPadding + gap : outerPadding;
        const x = startOffset + col * (cageWidth + gap);
        const y = startOffset + row * (cageHeight + gap);
        const cageJson = JSON.stringify(cage).replace(/"/g, '&quot;');
        cageElements += `
            <g class="cursor-pointer cage-group" 
               onclick="document.dispatchEvent(new CustomEvent('onCageClick', { detail: ${cageJson} }))">
               <rect x="${x}" y="${y}" width="${cageWidth}" height="${cageHeight}" rx="10" fill="#1F2937" stroke="#4B5563" stroke-width="2"></rect>
               <text x="${x + cageWidth / 2}" y="${y + cageHeight / 2}" font-family="sans-serif" font-size="14" fill="#D1D5DB" text-anchor="middle" dominant-baseline="central" pointer-events="none">${cage.name}</text>
            </g>
        `;
    });
    
    // --- 5. Botón de Cierre (existente) ---
    const closeButtonHtml = `
        <div 
            onclick="document.dispatchEvent(new CustomEvent('onCloseModuleClick'))"
            title="Cerrar Módulo"
            style="
                position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; 
                background: rgba(40, 40, 40, 0.7); color: white; font-size: 18px; 
                font-weight: bold; line-height: 24px; text-align: center; 
                border-radius: 50%; cursor: pointer; z-index: 10;
                border: 1px solid #6b7280; pointer-events: all;
            "
        >
            &times;
        </div>
    `;

    // --- 6. Mini-Popup HTML (NUEVO) ---
    // Este es el popup que mostraremos. Está oculto por defecto (display: none)
    const segmentPopupHtml = `
        <div 
            id="seg-popup-${module.id}" 
            style="
                position: absolute; 
                display: none; 
                background: white; 
                border-radius: 6px; 
                padding: 8px 12px; 
                z-index: 20; 
                color: #333; 
                box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                pointer-events: all; /* Importante para que el botón de cierre funcione */
                font-family: sans-serif;
                max-width: 200px;
                border: 1px solid #aaa;
            "
        >
            <span 
                onclick="this.parentElement.style.display='none'" 
                style="
                    position: absolute; top: -5px; right: -5px;
                    width: 18px; height: 18px; background: #555;
                    color: white; border-radius: 50%; text-align: center;
                    line-height: 18px; font-size: 14px; cursor: pointer;
                    font-weight: bold; border: 1px solid white;
                "
            >
                &times;
            </span>
            <span id="seg-popup-content-${module.id}" style="font-size: 13px;"></span>
        </div>
    `;


    // Construye el SVG final: Base -> Segmentos -> Intersecciones -> Jaulas
    const iconHtml = `
        <div 
            class="module-grid-container" 
            onmousedown="L.DomEvent.stopPropagation(event)" 
            style="position: relative;" 
            
            /* --- NUEVO: Oculta el popup si se hace clic en el fondo --- */
            onclick="
                const popup = this.querySelector('#seg-popup-${module.id}');
                /* Oculta el popup solo si se hace clic en el fondo (svg) y no en un segmento */
                if (popup && (event.target.tagName === 'svg' || event.target.classList.contains('cage-group'))) {
                    popup.style.display='none';
                }
            "
        > 
            ${closeButtonHtml} 
            ${segmentPopupHtml} 

            <style>
                .cage-group:hover rect { fill: #374151; }
                .hallway-segment:hover { fill: rgba(255, 255, 255, 0.2); }
                .intersection:hover { fill: rgba(0, 255, 0, 0.3); } 
            </style>
            <svg width="${totalWidth}" height="${totalHeight}" viewbox="0 0 ${totalWidth} ${totalHeight}" style="background-color: rgba(17, 24, 39, 0.85); border-radius: 15px; border: 3px solid #38BDF8; backdrop-filter: blur(5px);">
                ${hallwayBaseElements} 
                ${hallwaySegmentElements}
                ${intersectionElements} 
                ${cageElements}
            </svg>
        </div>
    `;
    
    return L.divIcon({
        className: 'interactive-module-grid',
        html: iconHtml,
        iconSize: [totalWidth, totalHeight],
        iconAnchor: [totalWidth / 2, totalHeight / 2],
    });
};

// --- Componente principal del Mapa (sin cambios) ---
export const MapComponent = ({ centersData, selectedModuleId, onSelectModule, onCageClick }) => {
// ... (Todo el código de MapComponent sin cambios) ...
  const initialPosition = [-43.0, -73.0];
  const initialZoom = 8;
  const ZOOM_THRESHOLD = 10;

  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const selectedModule = centersData.flatMap(c => c.modules).find(m => m.id === selectedModuleId);

  useEffect(() => {
    const handleCustomEvent = (event) => {
        const cageData = event.detail;
        if (onCageClick) onCageClick(cageData);
    };
    const handleCloseEvent = () => {
        if (onSelectModule) {
            onSelectModule(null); 
        }
    };
    document.addEventListener('onCageClick', handleCustomEvent);
    document.addEventListener('onCloseModuleClick', handleCloseEvent); 
    return () => { 
        document.removeEventListener('onCageClick', handleCustomEvent);
        document.removeEventListener('onCloseModuleClick', handleCloseEvent); 
    };
  }, [onCageClick, onSelectModule]); 

  return (
    <MapContainer center={initialPosition} zoom={initialZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: '6px', background: '#1a202c' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapZoomTracker setZoom={setCurrentZoom} initialZoom={initialZoom} />
      {selectedModule && <MapFlyTo position={selectedModule.position} zoom={13} />}
      {currentZoom < ZOOM_THRESHOLD && centersData.map(center => (
        <CenterMarker key={center.id} center={center} zoomThreshold={ZOOM_THRESHOLD} />
      ))}
      {currentZoom >= ZOOM_THRESHOLD && centersData.flatMap(center => center.modules).map(module => (
        <Marker
          key={module.id}
          position={module.position}
          icon={createModuleIcon(module, selectedModuleId === module.id)}
          eventHandlers={{ click: () => { if (selectedModuleId !== module.id) onSelectModule(module.id); }, }}
          zIndexOffset={selectedModuleId === module.id ? 1000 : 0}
        />
      ))}
    </MapContainer>
  );
};