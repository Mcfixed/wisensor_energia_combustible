import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";
import AppRouter from "./routes/AppRouter.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter> 
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
