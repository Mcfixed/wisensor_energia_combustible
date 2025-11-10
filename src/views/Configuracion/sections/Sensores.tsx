import { useState } from 'react';
import { Edit, Trash2, Plus, X, Building, MapPin, HardDrive, Loader2 } from 'lucide-react';
import { useDevices } from '../hooks/useDevice';
import { Device, DeviceStatus, DeviceType } from '../types/DeviceTypes';

// --- Componente de Columna ---
interface ColumnProps {
  title: string;
  loading: boolean;
  children: React.ReactNode;
}
const Column: React.FC<ColumnProps> = ({ title, loading, children }) => (
  <div className="flex flex-col overflow-hidden bg-gray-dark rounded-lg border border-gray-700">
    <div className="flex justify-between items-center p-4 border-b border-gray-700">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {loading && <Loader2 size={18} className="animate-spin text-gray-400" />}
    </div>
    <div className="overflow-y-auto p-2">
      {children}
    </div>
  </div>
);

// --- Componente de Item Seleccionable ---
interface ItemProps {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}
const SelectableItem: React.FC<ItemProps> = ({ label, icon, isSelected, onClick, children }) => (
  <div 
    onClick={onClick}
    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${isSelected ? 'bg-red-dark/20' : 'hover:bg-gray-darkL'}`}
  >
    <div className="flex items-center">
      {icon}
      <span className="text-white font-medium">{label}</span>
    </div>
    {children}
  </div>
);

export const Sensores = () => {
  // --- Permisos ---
  
  const placeholderPermissions = {
    editarSensor: true,
    eliminarSensor: true,
  };

  // --- Hook de Lógica ---
  const {
    companies, centers, devices,
    selectedCompanyId, selectedCenterId,
    loadingCompanies, loadingCenters, loadingDevices,
    error,
    selectCompany, selectCenter,
    addDevice, editDevice, removeDevice
  } = useDevices();

  // --- Estado del Modal ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDevice, setModalDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<Partial<Device>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // --- Handlers de Modal ---
  const abrirModalNuevo = () => {
    if (!selectedCenterId) return; 
    setFormData({ center_id: selectedCenterId, status: DeviceStatus.ACTIVE, type: DeviceType.ENERGIA });
    setModalDevice(null);
    setModalOpen(true);
    setFormError(null);
  };

  const abrirModalEdicion = (device: Device) => {
    setFormData(device);
    setModalDevice(device);
    setModalOpen(true);
    setFormError(null);
  };

  const cerrarModal = () => setModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      if (modalDevice) {
        // Editando
        await editDevice(modalDevice.id, {
          name: formData.name,
          status: formData.status,
          type: formData.type,
          center_id: formData.center_id 
        });
      } else {
        // Creando
        await addDevice(formData as Device);
      }
      cerrarModal();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleEliminar = async (device: Device) => {
    if (window.confirm(`¿Seguro que quieres eliminar "${device.name}" (EUI: ${device.dev_eui})?`)) {
      try {
        await removeDevice(device.id);
      } catch (err) {
        window.alert("Error al eliminar: " + (err as Error).message);
      }
    }
  };


  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Sensores</h1>
          <p className="text-gray-400 text-sm">Asigna y configura los sensores por centro.</p>
        </div>
        
          <button
            onClick={abrirModalNuevo}
            disabled={!selectedCenterId}
            className="bg-red-dark hover:bg-red-dark/90 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} className="mr-2" /> Nuevo Sensor
          </button>
        
      </div>

      {error && (
         <div className="p-4 mb-4 text-red-300 bg-red-900/50 border border-red-700 rounded-lg">Error: {error}</div>
      )}

      {/* Layout de 3 columnas */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Columna 1: Empresas */}
        <Column title="Empresas" loading={loadingCompanies}>
          {companies.map(empresa => (
            <SelectableItem
              key={empresa.id}
              label={empresa.name}
              icon={<Building size={18} className="mr-3 text-gray-400" />}
              isSelected={selectedCompanyId === empresa.id}
              onClick={() => selectCompany(empresa.id)}
            />
          ))}
        </Column>

        {/* Columna 2: Centros */}
        <Column title="Centros" loading={loadingCenters}>
          {!selectedCompanyId && (
            <div className="p-4 text-gray-400 text-center">Selecciona una empresa.</div>
          )}
          {centers.map(centro => (
            <SelectableItem
              key={centro.id}
              label={centro.name}
              icon={<MapPin size={18} className="mr-3 text-gray-400" />}
              isSelected={selectedCenterId === centro.id}
              onClick={() => selectCenter(centro.id)}
            />
          ))}
        </Column>

        {/* Columna 3: Sensores (Devices) */}
        <Column title="Sensores" loading={loadingDevices}>
          {!selectedCenterId && (
            <div className="p-4 text-gray-400 text-center">Selecciona un centro.</div>
          )}
          {devices.map(device => (
            <SelectableItem
              key={device.id}
              label={device.name}
              icon={<HardDrive size={18} className={`mr-3 ${device.status === 'active' ? 'text-green-500' : 'text-gray-500'}`} />}
              isSelected={false} 
              onClick={() => abrirModalEdicion(device)} 
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 font-mono">{device.dev_eui}</span>
                {placeholderPermissions.editarSensor && (
                  <button
                    onClick={(e) => { e.stopPropagation(); abrirModalEdicion(device); }}
                    className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700/50"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                )}
                {placeholderPermissions.eliminarSensor && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEliminar(device); }}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700/50"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </SelectableItem>
          ))}
        </Column>
      </div>

      {/* --- MODAL de Dispositivo (Crear/Editar) --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600/40 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {modalDevice ? 'Editar Sensor' : 'Nuevo Sensor'}
                  </h2>
                  <button type="button" onClick={cerrarModal} className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700">
                    <X size={20} />
                  </button>
                </div>
                {formError && <div className="text-red-400 text-sm mb-4">{formError}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(f => ({...f, name: e.target.value}))}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dev_eui" className="block text-sm font-medium text-gray-300 mb-1">DevEUI (16 chars) *</label>
                    <input
                      type="text"
                      id="dev_eui"
                      value={formData.dev_eui || ''}
                      onChange={(e) => setFormData(f => ({...f, dev_eui: e.target.value}))}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 font-mono disabled:opacity-50"
                      required
                      minLength={16}
                      maxLength={16}
                      disabled={!!modalDevice} 
                    />
                  </div>

                  <div>
                    <label htmlFor="center_id" className="block text-sm font-medium text-gray-300 mb-1">Centro *</label>
                    <select
                      id="center_id"
                      value={formData.center_id || ''}
                      onChange={(e) => setFormData(f => ({...f, center_id: Number(e.target.value)}))}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100"
                      required
                    >
                      <option value="" disabled>Selecciona un centro</option>
                      {centers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      {modalDevice && !centers.find(c => c.id === modalDevice.center_id) && (
                        <option key={modalDevice.center_id} value={modalDevice.center_id}>
                          Centro (ID: {modalDevice.center_id})
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Tipo *</label>
                    <select
                      id="type"
                      value={formData.type || ''}
                      onChange={(e) => setFormData(f => ({...f, type: e.target.value as DeviceType}))}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100"
                      required
                    >
                      <option value={DeviceType.ENERGIA}>Energía</option>
                      <option value={DeviceType.COMBUSTIBLE}>Combustible</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Estado *</label>
                    <select
                      id="status"
                      value={formData.status || ''}
                      onChange={(e) => setFormData(f => ({...f, status: e.target.value as DeviceStatus}))}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100"
                      required
                    >
                      <option value={DeviceStatus.ACTIVE}>Activo</option>
                      <option value={DeviceStatus.INACTIVE}>Inactivo</option>
                      <option value={DeviceStatus.MAINTENANCE}>Mantenimiento</option>
                      <option value={DeviceStatus.DO_NOT_DISPLAY}>No Visualizar</option>
                    </select>
                  </div>

                </div>
              </div>
              <div className="flex justify-end space-x-3 p-4 bg-gray-darkL/50 border-t border-gray-700 rounded-b-lg">
                <button type="button" onClick={cerrarModal} className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};