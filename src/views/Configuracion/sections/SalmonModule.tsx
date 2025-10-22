import  { useState } from "react";
declare const aisleSections: number;
declare const pasilloNumbers: Record<string, number>;
declare let pasilloCounter: number;
interface PasilloNumbers {
  [key: string]: number;
}

interface BaseNumbers {
  [key: string]: number;
}

interface HoverState {
  type: string;
  id: string; // Cambiado a string porque en handleMouseEnter usas string para id
}

// interface SalmonModuleProps {
//   cellSize?: number;
//   aisleSections?: number;
//   aisleUnit?: number;
// }
const SalmonModule = ({
  cellSize = 80,
  aisleSections = 4,
  aisleUnit = 5,
}) => {
  const [inputValue, setInputValue] = useState("10");
  const [numJaulas, setNumJaulas] = useState(10);
  const [selectedJaula, setSelectedJaula] = useState<string|null>(null);
  const [selectedAisles, setSelectedAisles] = useState<Set<string>>(new Set());
  const [selectedBases, setSelectedBases] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Cambiamos a 2 filas en lugar de 2 columnas
  const rows = 2;
  const cols = Math.ceil(numJaulas / rows);
  const aisleWidth = aisleSections * aisleUnit;
  const width = cols * cellSize + (cols + 1) * aisleWidth;
  const height = rows * cellSize + (rows + 1) * aisleWidth;

  // Contadores globales para numeración simple
  let pasilloCounter = 1;
  let baseCounter = 1;
  const pasilloNumbers: PasilloNumbers = {};
  const baseNumbers: BaseNumbers = {};

  const handleSelectJaula = (row:number, col:number) => {
    const id = `${row}-${col}`;
    setSelectedJaula(id === selectedJaula ? null : id);
  };

  const handleSelectAisle = (aisleId:string) => {
    setSelectedAisles(prev => {
      const newSet = new Set(prev);
      newSet.has(aisleId) ? newSet.delete(aisleId) : newSet.add(aisleId);
      return newSet;
    });
  };

  const handleSelectBase = (baseId:string) => {
    setSelectedBases(prev => {
      const newSet = new Set(prev);
      newSet.has(baseId) ? newSet.delete(baseId) : newSet.add(baseId);
      return newSet;
    });
  };

  const handleMouseEnter = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>, 
    type: string, 
    id: string
  ) => {
    setHovered({ type, id });
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
  };

  const handleMouseLeave = () => setHovered(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed > 0) {
      setNumJaulas(parsed);
      setSelectedJaula(null);
      setSelectedAisles(new Set());
      setSelectedBases(new Set());
    }
  };

  const getElementLabel = (type: string, id: string): string => {
    if (type === "jaula") {
      const [row, col] = id.split('-');
      return `Jaula ${parseInt(row) * cols + parseInt(col) + 1}`;
    }
    
    if (type === "pasillo") {
      return `Pasillo ${pasilloNumbers[id] ?? 'N/A'}`;
    }
    
    if (type === "base") {
      return `Base ${baseNumbers[id] ?? 'N/A'}`;
    }
    
    return id;
  };

  const renderAisle = (side:string, xPos:number, yPos: number, width:number, height:number, isVertical:boolean, jaulaNum:number) => {
    const elements = [];
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

  const renderBase = (corner:string, x:number, y:number, jaulaNum:number) => {
    const baseId = `${corner}-${jaulaNum}`;
    baseNumbers[baseId] = baseCounter++;
    
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

  const cells = [];
  const aisles = [];
  const bases = [];

  let jaulaIndex = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (jaulaIndex >= numJaulas) break;

      const x = col * (cellSize + aisleWidth) + aisleWidth;
      const y = row * (cellSize + aisleWidth) + aisleWidth;
      const id = `${row}-${col}`;
      const jaulaNum = row * cols + col + 1;
      const isSelected = selectedJaula === id;

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
            onClick={() => handleSelectJaula(row, col)}
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
            {`J${jaulaNum}`}
          </text>
        </g>
      );

      // Render Bases
      bases.push(renderBase("tl", x - aisleWidth, y - aisleWidth, jaulaNum));
      bases.push(renderBase("tr", x + cellSize, y - aisleWidth, jaulaNum));
      bases.push(renderBase("bl", x - aisleWidth, y + cellSize, jaulaNum));
      bases.push(renderBase("br", x + cellSize, y + cellSize, jaulaNum));

      // Render Aisles
      if (row === 0) {
        aisles.push(...renderAisle("top", x, y - aisleWidth, cellSize, aisleWidth, false, jaulaNum));
      }
      if (col === 0) {
        aisles.push(...renderAisle("left", x - aisleWidth, y, aisleWidth, cellSize, true, jaulaNum));
      }
      aisles.push(...renderAisle("right", x + cellSize, y, aisleWidth, cellSize, true, jaulaNum));
      aisles.push(...renderAisle("bottom", x, y + cellSize, cellSize, aisleWidth, false, jaulaNum));

      jaulaIndex++;
    }
  }

  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Número de jaulas:&nbsp;
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Cantidad"
            style={{ width: "60px" }}
          />
        </label>
        &nbsp;&nbsp;
        <label>
          Pasillos por lado:&nbsp;
          <input
            type="number"
            value={aisleSections}
            disabled
            style={{ width: "40px" }}
          />
        </label>
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <svg width={width} height={height}>
          {bases}
          {aisles}
          {cells}
        </svg>
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
        {selectedJaula && (
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
            Seleccionado: {getElementLabel("jaula", selectedJaula)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalmonModule;