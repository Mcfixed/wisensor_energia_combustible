import React, { useState, useEffect, JSX } from "react";
import {
    CentroModuleAPIProps,
    ModuloData,
    Documento,
    ApiResponse,
    TooltipPosition,
    HoveredElement
} from "../../../types/Trazabilidad";

const CentroModuleAPI: React.FC<CentroModuleAPIProps> = ({
    cellSize = 80,
    aisleSections = 4,
    aisleUnit = 5,
    apiUrl = "http://127.0.0.1:8000/api/modulo",
    moduloId
}) => {
    const [moduloData, setModuloData] = useState<ModuloData | null>(null);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [selectedAisles, setSelectedAisles] = useState<Set<string>>(new Set());
    const [selectedBases, setSelectedBases] = useState<Set<string>>(new Set());
    const [hovered, setHovered] = useState<HoveredElement | null>(null);
    const [tooltipPos, setTooltipPos] = useState<TooltipPosition>({ x: 0, y: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Contadores globales para numeración simple
    let pasilloCounter = 1;
    let baseCounter = 1;
    const pasilloNumbers: Record<string, number> = {};
    const baseNumbers: Record<string, number> = {};

    // Función para cargar datos desde la API
    useEffect(() => {
        const fetchModuloData = async () => {
            try {
                setLoading(true);
                const url = moduloId ? `${apiUrl}/${moduloId}` : apiUrl;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data: ApiResponse = await response.json();

                if (!data.res || !data.data || data.data.length === 0) {
                    throw new Error("No se encontraron datos del módulo");
                }

                setModuloData(data.data[0]);
                setLoading(false);
            } catch (err) {
                const error = err as Error;
                setError(error.message);
                setLoading(false);
            }
        };

        fetchModuloData();
    }, [apiUrl, moduloId]);

    // Cargar datos del módulo seleccionado
    // const handleModuloChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const moduloId = event.target.value;
    //     if (!moduloId) {
    //         setModuloData(null);
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         const response = await fetch(`${apiUrl}/${moduloId}`);
            
    //         if (!response.ok) {
    //             throw new Error(`Error HTTP: ${response.status}`);
    //         }
            
    //         const data: ApiResponse = await response.json();
            
    //         if (!data.res || !data.data || data.data.length === 0) {
    //             throw new Error("No se encontraron datos del módulo");
    //         }
            
    //         setModuloData(data.data[0]);
    //         setSelectedElement(null);
    //         setSelectedAisles(new Set());
    //         setSelectedBases(new Set());
    //         setLoading(false);
    //     } catch (err) {
    //         const error = err as Error;
    //         setError(error.message);
    //         setLoading(false);
    //     }
    // };

    const handleSelectElement = (type: HoveredElement['type'], id: string) => {
        const elementId = `${type}-${id}`;
        setSelectedElement(elementId === selectedElement ? null : elementId);
    };

    const handleSelectAisle = (aisleId: string) => {
        setSelectedAisles(prev => {
            const newSet = new Set(prev);
            newSet.has(aisleId) ? newSet.delete(aisleId) : newSet.add(aisleId);
            return newSet;
        });
    };

    const handleSelectBase = (baseId: string) => {
        setSelectedBases(prev => {
            const newSet = new Set(prev);
            newSet.has(baseId) ? newSet.delete(baseId) : newSet.add(baseId);
            return newSet;
        });
    };

    const handleMouseEnter = (event: React.MouseEvent<SVGRectElement>, type: HoveredElement['type'], id: string) => {
        setHovered({ type, id });
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y - 10 });
    };

    const handleMouseLeave = () => setHovered(null);

    const getElementLabel = (type: HoveredElement['type'], id: string): string => {
        if (!moduloData) return id;

        switch (type) {
            case "jaula":
                const jaula = moduloData.jaulas.find(j => j.id.toString() === id);
                return jaula ? `${jaula.nombre} (${jaula.posicion})` : `Jaula ${id}`;

            case "pasillo":
                const pasillo = moduloData.pasillos.find(p => p.id.toString() === id);
                return pasillo ? `${pasillo.nombre} (${pasillo.posicion})` : `Pasillo ${id}`;

            case "base":
                return `Base ${baseNumbers[id]}`;

            case "linea":
                const linea = moduloData.lineas.find(l => l.id.toString() === id);
                return linea ? `${linea.nombre} (${linea.posicion})` : `Línea ${id}`;

            case "boya":
                const boya = moduloData.boyas.find(b => b.id.toString() === id);
                return boya ? `${boya.nombre} (${boya.posicion})` : `Boya ${id}`;

            case "red":
                const red = moduloData.redes_loberas.find(r => r.id.toString() === id);
                return red ? `Red ${red.codigo}` : `Red ${id}`;

            default:
                return id;
        }
    };

    const renderAisle = (
        side: "top" | "left" | "right" | "bottom",
        xPos: number,
        yPos: number,
        width: number,
        height: number,
        isVertical: boolean,
        jaulaNum: number
    ) => {
        const elements: JSX.Element[] = [];
        for (let i = 0; i < aisleSections; i++) {
            const aisleId = `${side}-${jaulaNum}-${i}`;
            pasilloNumbers[aisleId] = pasilloCounter++;

            const sectionX = isVertical ? xPos : xPos + (i * width / aisleSections);
            const sectionY = isVertical ? yPos + (i * height / aisleSections) : yPos;
            const sectionWidth = isVertical ? width : width / aisleSections;
            const sectionHeight = isVertical ? height / aisleSections : height;

            elements.push(
                <g key={aisleId}>
                    <rect
                        x={sectionX}
                        y={sectionY}
                        width={sectionWidth}
                        height={sectionHeight}
                        fill={selectedAisles.has(aisleId) ? "#ffb703" :
                            side === "right" || side === "bottom" ? "#dee2e6" : "#ced4da"}
                        stroke="#495057"
                        strokeWidth="1"
                        onClick={() => handleSelectAisle(aisleId)}
                        onMouseEnter={(e) => handleMouseEnter(e, "pasillo", aisleId)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: "pointer" }}
                    />
                    <text
                        x={sectionX + sectionWidth / 2}
                        y={sectionY + sectionHeight / 2}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        fontSize="8"
                        fill="#000"
                        pointerEvents="none"
                    >
                        {`P${pasilloNumbers[aisleId]}`}
                    </text>
                </g>
            );
        }
        return elements;
    };

    const renderBase = (corner: "tl" | "tr" | "bl" | "br", x: number, y: number, jaulaNum: number) => {
        const baseId = `${corner}-${jaulaNum}`;
        baseNumbers[baseId] = baseCounter++;
        const aisleWidth = aisleSections * aisleUnit;


        return (
            <g key={baseId}>
                <rect
                    x={x}
                    y={y}
                    width={aisleWidth}
                    height={aisleWidth}
                    fill={selectedBases.has(baseId) ? "#ffb703" : "#adb5bd"}
                    stroke="#495057"
                    strokeWidth="1"
                    onClick={() => handleSelectBase(baseId)}
                    onMouseEnter={(e) => handleMouseEnter(e, "base", baseId)}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: "pointer" }}
                />
                <text
                    x={x + aisleWidth / 2}
                    y={y + aisleWidth / 2}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontSize="8"
                    fill="#000"
                    pointerEvents="none"
                >
                    {`B${baseNumbers[baseId]}`}
                </text>
            </g>
        );
    };

    const renderGrid = () => {
        if (!moduloData) return null;

        const cells: JSX.Element[] = [];
        const aisles: JSX.Element[] = [];
        const bases: JSX.Element[] = [];
        const lines: JSX.Element[] = [];
        const buoys: JSX.Element[] = [];
        const nets: JSX.Element[] = [];

        const rows = 2;
        const cols = Math.ceil(moduloData.jaulas.length / rows);
        const aisleWidth = aisleSections * aisleUnit;
        const width = cols * cellSize + (cols + 1) * aisleWidth;
        const height = rows * cellSize + (rows + 1) * aisleWidth;

        // Renderizar jaulas
        moduloData.jaulas.forEach((jaula, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;

            const x = col * (cellSize + aisleWidth) + aisleWidth;
            const y = row * (cellSize + aisleWidth) + aisleWidth;
            const id = jaula.id.toString();
            const isSelected = selectedElement === `jaula-${id}`;

            // Render Jaula
            cells.push(
                <g key={`cell-${id}`}>
                    <rect
                        x={x}
                        y={y}
                        width={cellSize}
                        height={cellSize}
                        fill={isSelected ? "#ffb703" : "#a2d2ff"}
                        stroke={isSelected ? "#fb8500" : "#023e8a"}
                        strokeWidth={isSelected ? 4 : 2}
                        onClick={() => handleSelectElement("jaula", id)}
                        onMouseEnter={(e) => handleMouseEnter(e, "jaula", id)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: "pointer" }}
                    />
                    <text
                        x={x + cellSize / 2}
                        y={y + cellSize / 2}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        fontSize="14"
                        fill="#000"
                        pointerEvents="none"
                    >
                        {jaula.posicion}
                    </text>
                </g>
            );

            // Render Bases
            bases.push(renderBase("tl", x - aisleWidth, y - aisleWidth, index + 1));
            bases.push(renderBase("tr", x + cellSize, y - aisleWidth, index + 1));
            bases.push(renderBase("bl", x - aisleWidth, y + cellSize, index + 1));
            bases.push(renderBase("br", x + cellSize, y + cellSize, index + 1));

            // Render Aisles
            if (row === 0) {
                aisles.push(...renderAisle("top", x, y - aisleWidth, cellSize, aisleWidth, false, index + 1));
            }
            if (col === 0) {
                aisles.push(...renderAisle("left", x - aisleWidth, y, aisleWidth, cellSize, true, index + 1));
            }
            aisles.push(...renderAisle("right", x + cellSize, y, aisleWidth, cellSize, true, index + 1));
            aisles.push(...renderAisle("bottom", x, y + cellSize, cellSize, aisleWidth, false, index + 1));
        });

        // Renderizar líneas (ejemplo básico)
        moduloData.lineas.forEach((linea, index) => {
            const x = 50 + index * 100;
            const y = 50;
            const id = linea.id.toString();
            const isSelected = selectedElement === `linea-${id}`;

            lines.push(
                <g key={`line-${id}`}>
                    <line
                        x1={x}
                        y1={y}
                        x2={x + 80}
                        y2={y}
                        stroke={isSelected ? "#fb8500" : "#023e8a"}
                        strokeWidth="4"
                        onClick={() => handleSelectElement("linea", id)}
                        onMouseEnter={(e) => handleMouseEnter(e as unknown as React.MouseEvent<SVGRectElement>, "linea", id)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: "pointer" }}
                    />
                    <text
                        x={x + 40}
                        y={y - 10}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#000"
                        pointerEvents="none"
                    >
                        {linea.posicion}
                    </text>
                </g>
            );
        });

        // Renderizar boyas (ejemplo básico)
        moduloData.boyas.forEach((boya, index) => {
            const x = 50 + index * 60;
            const y = 150;
            const id = boya.id.toString();
            const isSelected = selectedElement === `boya-${id}`;

            buoys.push(
                <g key={`buoy-${id}`}>
                    <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill={isSelected ? "#ffb703" : "#8ecae6"}
                        stroke={isSelected ? "#fb8500" : "#023e8a"}
                        strokeWidth="2"
                        onClick={() => handleSelectElement("boya", id)}
                        onMouseEnter={(e) => handleMouseEnter(e as unknown as React.MouseEvent<SVGRectElement>, "boya", id)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: "pointer" }}
                    />
                    <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        fontSize="10"
                        fill="#000"
                        pointerEvents="none"
                    >
                        {boya.posicion}
                    </text>
                </g>
            );
        });

        // Renderizar redes (ejemplo básico)
        moduloData.redes_loberas.forEach((red, index) => {
            const x = 50 + index * 100;
            const y = 200;
            const id = red.id.toString();
            const isSelected = selectedElement === `red-${id}`;

            nets.push(
                <g key={`net-${id}`}>
                    <rect
                        x={x}
                        y={y}
                        width="80"
                        height="30"
                        fill={isSelected ? "#ffb703" : "#ffafcc"}
                        stroke={isSelected ? "#fb8500" : "#023e8a"}
                        strokeWidth="2"
                        onClick={() => handleSelectElement("red", id)}
                        onMouseEnter={(e) => handleMouseEnter(e, "red", id)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: "pointer" }}
                    />
                    <text
                        x={x + 40}
                        y={y + 15}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        fontSize="10"
                        fill="#000"
                        pointerEvents="none"
                    >
                        {red.codigo}
                    </text>
                </g>
            );
        });

        return (
            <svg width={width} height={Math.max(height, 250)}>
                {bases}
                {aisles}
                {cells}
                {lines}
                {buoys}
                {nets}
            </svg>
        );
    };

    const renderDocumentos = () => {
        if (!moduloData || !selectedElement) return null;

        const [type, id] = selectedElement.split('-');
        let documentos: Documento[] = [];

        switch (type) {
            case "jaula":
                const jaula = moduloData.jaulas.find(j => j.id.toString() === id);
                if (jaula) documentos = jaula.documentos_jaula;
                break;
            case "pasillo":
                const pasillo = moduloData.pasillos.find(p => p.id.toString() === id);
                if (pasillo) documentos = pasillo.documentos_pasillos;
                break;
            case "linea":
                const linea = moduloData.lineas.find(l => l.id.toString() === id);
                if (linea) documentos = linea.documentos_lineas;
                break;
            case "boya":
                const boya = moduloData.boyas.find(b => b.id.toString() === id);
                if (boya) documentos = boya.documentos_boyas;
                break;
            case "red":
                const red = moduloData.redes_loberas.find(r => r.id.toString() === id);
                if (red) documentos = red.documentos_red_lobera;
                break;
        }

        if (documentos.length === 0) {
            return <div>No hay documentos asociados</div>;
        }

        return (
            <div style={{ marginTop: '20px' }}>
                <h3>Documentos asociados:</h3>
                <ul>
                    {documentos.map(doc => (
                        <li key={doc.id}>
                            <a href={doc.ubicacion} target="_blank" rel="noopener noreferrer">
                                {doc.nombre}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    if (loading) {
        return <div>Cargando datos del módulo...</div>;
    }

    if (error) {
        return <div>Error al cargar datos: {error}</div>;
    }

    if (!moduloData) {
        return <div>No se encontraron datos del módulo</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "20px" }}>
                <h2>Módulo: {moduloData.nombre}</h2>
                <p>Fabricante: {moduloData.fabricante}</p>
                <p>Centro: {moduloData.centro.nombre} ({moduloData.centro.codigo})</p>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    {renderGrid()}
                    {hovered && (
                        <div
                            style={{
                                position: "absolute",
                                left: tooltipPos.x,
                                top: tooltipPos.y,
                                background: "#333",
                                color: "#fff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                pointerEvents: "none",
                                transform: "translate(-50%, -100%)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {getElementLabel(hovered.type, hovered.id)}
                        </div>
                    )}
                    {selectedElement && (
                        <div
                            style={{
                                position: "absolute",
                                left: 10,
                                bottom: 10,
                                background: "#333",
                                color: "#fff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                            }}
                        >
                            Seleccionado: {getElementLabel(selectedElement.split('-')[0] as HoveredElement['type'], selectedElement.split('-')[1])}
                        </div>
                    )} 
                </div>

                <div style={{ flex: 1 }}>
                    {selectedElement && (
                        <div>
                            <h3>Detalles del elemento seleccionado</h3>
                            {renderDocumentos()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CentroModuleAPI;