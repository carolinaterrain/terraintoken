import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initGlobalErrorHandlers } from "./lib/errorReporting";

// Initialize global error handlers for production error monitoring
initGlobalErrorHandlers();

createRoot(document.getElementById("root")!).render(<App />);
