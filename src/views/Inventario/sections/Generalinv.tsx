import { Battery, Cloud, Eye, Package, Search, Shield, X } from "lucide-react";
import React, { useState } from "react";
import { Registro, FormData } from "../../../assets/types/Inventario";

export const Generalinv = () => {
  const [registros, setRegistros] = useState<Registro[]>([
    { id: 1, nombre: "Alao", estado: "Activo" },
    { id: 2, nombre: "Puduguapi", estado: "Activo" },
    { id: 3, nombre: "Quenac", estado: "Inactivo" },
    { id: 4, nombre: "Puduguapi2", estado: "Activo" },
    { id: 5, nombre: "Quenac2", estado: "Inactivo" },
    { id: 3, nombre: "Quenac2", estado: "Inactivo" },
    { id: 4, nombre: "Puduguapi", estado: "Activo" },
    { id: 5, nombre: "Quenac", estado: "Inactivo" },
  ]);
  const tabs = [
    { id: 0, label: "Pasillos", content: "Contenido pasillos" },
    { id: 1, label: "Pasadores", content: "Contenido pasadores" },
    { id: 2, label: "Boyas", content: "Contenido boyas" },
    { id: 3, label: "lineas fondeo", content: "Contenido fondeo" },
  ];
  const [modalArtefacto, setModalArtefacto] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FormData>({
      id: "",
      nombre: "",
      estado: "Activo",
    });
  const abrirModalArtefacto = () => {
    setFormData({
      id: "",
      nombre: "",
      estado: "Activo",
    });
    setModalArtefacto(true);
  };
  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="busqueda"
              className="block text-xs text-gray-300 mb-1 invisible"
            >
              Buscar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="busqueda"
                name="busqueda"
                placeholder="Buscar centros, módulos o artefactos..."
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-dark  text-sm text-gray-100 placeholder-gray-400 
                            focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent
                            transition-all duration-200 ease-in-out shadow-sm"
              />
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <label
              htmlFor="filtro1"
              className="block text-xs text-gray-300 mb-1"
            >
              Empresa
            </label>
            <select
              id="empresa"
              name="empresa"
              className="block w-full px-3 py-2.5 bg-gray-dark  text-sm text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="opcion1">eo</option>
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label
              htmlFor="filtro2"
              className="block text-xs text-gray-300 mb-1"
            >
              Centro
            </label>
            <select
              id="centro"
              name="centro"
              className="block w-full px-3 py-2.5 bg-gray-dark  text-sm text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="opcionA">A</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto  border border-gray-700/40 flex-1 custom-scroll">
          <table className="min-w-full divide-y divide-gray-700 w-full">
            <thead className="sticky top-0 z-9 bg-gray-darkL shadow">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/5"
                >
                  Centro
                </th>
                <th
                  scope="col"
                  className="px-1 py-1 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-4/5"
                >
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] px-16">
                      Información de artefactos
                    </span>
                    <div className="flex bg-gray-darkL text-[0.7rem] text-gray-300 font-medium py-1 mt-1 text-center">
                      <div className="w-1/4 px-1 truncate">Módulo</div>
                      <div className="w-1/4 px-1">Status línea de fondeo</div>
                      <div className="w-1/4 px-1">Artefacto</div>
                      <div className="w-1/4 px-1">Nombre</div>
                      <div className="w-1/4 px-1">Cantidad de lineas</div>
                      <div className="w-1/4 px-1">
                        Fecha cambio material fondeo
                      </div>
                      <div className="w-1/4 px-1">Fecha cambio de cable</div>
                      <div className="w-1/4 text-right pr-1">Acción</div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-dark divide-y divide-gray-700">
              {registros.map((registro) => (
                <tr
                  key={registro.id}
                  className="hover:bg-gray-darkL transition-colors"
                >
                  <td className="py-0 align-top" colSpan={6}>
                    <div className="flex">
                      <div className="w-1/5 py-1 pr-1 flex">
                        <div className="flex items-center gap-2 px-2">
                          <div className="flex-shrink-0 h-6 w-6 bg-gray-700 rounded-full flex items-center justify-center mr-1">
                            <Package size={12} className="text-gray-300" />
                          </div>
                          <div className="truncate">
                            <div className="text-xxs font-medium text-white truncate">
                              {registro.nombre}-{" "}
                              <span className="text-green-400 bg-green-400/10 rounded-full p-2 text-sm">
                                Activo
                              </span>
                            </div>
                            <div className="text-[0.6rem] text-gray-400 leading-none">
                              ID:{registro.id}
                            </div>
                            <div className="text-[0.9rem] text-gray-400">
                              X region, Chaiten
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-4/5">
                        <div className="grid grid-cols-1 divide-y divide-zinc-900/50 ">
                          {[1, 2, 3, 4].map((subFila) => (
                            <div
                              key={`${registro.id}-${subFila}`}
                              className="py-0 flex items-center hover:bg-gray-500/20 hover:shadow cursor-pointer"
                            >
                              <div className="w-1/4 text-[0.7rem] text-gray-300 px-1 truncate text-center">
                                Modulo-{subFila}
                              </div>
                              <div className="w-1/4 text-center">
                                <span
                                  className={`p-0.5 inline-flex text-[0.6rem] leading-3 rounded-full 
                              ${
                                subFila % 2 === 0
                                  ? "bg-green-900/20 text-green-400 "
                                  : "bg-red-900/20 text-red-400"
                              }`}
                                >
                                  {subFila % 2 === 0 ? "Activo" : "Inactivo"}
                                </span>
                              </div>
                              <div className="w-1/4 text-[0.7rem] text-gray-400 px-1 text-center">
                                Modulo
                              </div>
                              <div className="w-1/4 text-[0.7rem] text-gray-400 px-1 text-center">
                                Jean louis
                              </div>
                              <div className="w-1/4 text-[0.7rem] text-gray-400 px-1 text-center">
                                54
                              </div>
                              <div className="w-1/4 text-[0.7rem] text-gray-400 px-1 text-center">
                                2025-23-05
                              </div>
                              <div className="w-1/4 text-[0.7rem] text-gray-400 px-1 text-center">
                                2025-23-05
                              </div>
                              <div className="w-1/4 text-right pr-1">
                                <button
                                  className="text-gray-400 hover:text-blue-400 p-0"
                                  onClick={abrirModalArtefacto}
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalArtefacto && (
          <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-darkL shadow-2xl w-full max-w-md border border-gray-700">
              <div className="flex justify-between p-2">
                <div className="p-2">Informacion del artefacto</div>
                <button
                  onClick={() => setModalArtefacto(false)}
                  className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col h-[400px] ">
                {/* Barra de pestañas */}
                <div className="flex border-b border-gray-700">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-2 text-xs font-medium flex-1 text-center transition-colors duration-150 ${
                        activeTab === tab.id
                          ? "text-white border-b-2 border-blue-500"
                          : "text-gray-400 hover:text-white hover:bg-gray-dark"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Contenido de pestañas */}
                <div className="flex-1 p-3 overflow-auto">
                  <div className="text-gray-300 text-sm">
                    {tabs.find((tab) => tab.id === activeTab)?.content}

                    {activeTab === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/10">
                            <Cloud className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Servicios en la nube
                            </p>
                            <p className="text-sm text-white">3 activos</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10">
                            <Shield className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Seguridad</p>
                            <p className="text-sm text-white">Protegido</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/10">
                            <Battery className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Energía</p>
                            <p className="text-sm text-white">UPS activo</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};
export default Generalinv;
