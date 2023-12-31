import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Settings from "./pages/settings";
import Layout from "./components/layout";
import Scan from "./pages/scan";
import Toasts from "./components/toasts";
import Manual from "./pages/manual";
import SessionDialog from "./components/session-dialog";

function App() {
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .catch(function () {
        alert("Please allow camera access to use this app");
      });
  }, []);
  return (
    <React.StrictMode>
      <BrowserRouter basename="/prabasi-app">
        <Toasts />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manual" element={<Manual />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Route>
          <Route path="/scan" element={<Scan />} />
        </Routes>
      </BrowserRouter>
      <SessionDialog />
    </React.StrictMode>
  );
}

export default App;
