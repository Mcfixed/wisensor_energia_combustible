import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <>
      {/* <Header /> */}
      {/* Aquí se renderizará el contenido dinámico */}
      <div className="text-gray-200 overflow-hidden h-screen font-sans flex bg-dark-osc">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen ml-16">
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
}
