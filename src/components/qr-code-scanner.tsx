import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

import useVideoInputDevices from "../hooks/useVideoInputDevices";
import BackButton from "./back-button";
import useToast, { ToastModes } from "../hooks/useToast";
import store from "../services/store.service";
import { useNavigate } from "react-router-dom";

const qrConfig = {
  fps: 10,
  qrbox: { width: 200, height: 200 },
  aspectRatio: 1.333334,
  showTorchButtonIfSupported: true,
};

const regExp = /^PRABASI\-\d{5}$/;

export const QrCodeScanner = () => {
  const { devices, nextDevice, deviceMode, deviceId } = useVideoInputDevices();
  const [lastScan, setLastScan] = React.useState<string>("");
  const [html5QrCode, setHtml5QrCode] = React.useState<Html5Qrcode>();
  const [isScanning, setIsScanning] = React.useState(false);
  const { showToast } = useToast();

  function handleScan(str: string) {
    if (regExp.test(str) === false) {
      setLastScan("Invalid QR Code");
      showToast(`Invalid QR Code`, ToastModes.ERROR);
    } else {
      if (store.scans.some((scan) => scan.name === str) === false) {
        store.scans.push({ name: str, time: new Date().getTime() });
        setLastScan(`Scanned ${str}`);
      } else {
        setLastScan(`Already scanned ${str}`);
        showToast(`Already scanned ${str}`, ToastModes.ERROR);
      }
    }
    setTimeout(() => {
      handleResumeScan();
    }, 1000);
  }

  useEffect(() => {
    if (deviceId) {
      handleStartScan();
    }
  }, [deviceId]);

  useEffect(() => {
    if (!html5QrCode) {
      const temp = new Html5Qrcode("reader");
      setHtml5QrCode(temp);
    }
    return () => {
      if (isScanning) {
        handleStopScan();
      }
    };
  }, [isScanning, html5QrCode]);

  const qrCodeSuccessCallback = (decodedText: string) => {
    handleScan(decodedText);
    handlePauseScan();
  };

  const handleStartScan = () => {
    setIsScanning(true);
    html5QrCode
      ?.start(
        { facingMode: deviceMode },
        qrConfig,
        qrCodeSuccessCallback,
        undefined
      )
      .then(() => {})
      .catch((err) => {
        setIsScanning(false);
        console.error(err);
      });
  };

  const handleResumeScan = () => {
    html5QrCode?.resume();
  };

  const handleStopScan = () => {
    html5QrCode
      ?.stop()
      .then(() => {
        html5QrCode?.clear();
      })
      .catch(() => {
        showToast(`Error while stopping QR scanner`, ToastModes.ERROR);
      });
  };

  const handlePauseScan = () => {
    html5QrCode?.pause();
  };

  return (
    <div className="h-full relative">
      <div className="h-full grid items-center">
        <div id="reader"></div>
      </div>
      <header className="text-white flex justify-between items-center absolute top-0 w-full left-0 py-3 px-4 cursor-pointer">
        <div className="h-fit block overflow-hidden px-4 py-2 rounded-md flex bg-white/80">
          <div className="w-8 pb-1">
            <img
              src="/prabasi-app/logo192.png"
              alt="Prabasi on new England"
              className="h-6 block"
            />
          </div>
          <span className="p-1 text-black">
            Total scan count is {store.scans.length}
          </span>
        </div>
        {devices.length && (
          <div className="flex h-fit space-x-3 items-top px-4 py-2 rounded-md bg-white/80">
            <button className="w-6 h-6" onClick={nextDevice}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21 6h-1.5a.5.5 0 0 1-.5-.5A1.502 1.502 0 0 0 17.5 4h-6A1.502 1.502 0 0 0 10 5.5a.5.5 0 0 1-.5.5H8V5H4v1H3a2.002 2.002 0 0 0-2 2v10a2.002 2.002 0 0 0 2 2h18a2.002 2.002 0 0 0 2-2V8a2.002 2.002 0 0 0-2-2zm1 12a1.001 1.001 0 0 1-1 1H3a1.001 1.001 0 0 1-1-1V8a1.001 1.001 0 0 1 1-1h2V6h2v1h2.5A1.502 1.502 0 0 0 11 5.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5A1.502 1.502 0 0 0 19.5 7H21a1.001 1.001 0 0 1 1 1zM8.2 13h-1a4.796 4.796 0 0 1 8.8-2.644V9h1v3h-3v-1h1.217A3.79 3.79 0 0 0 8.2 13zm7.6 0h1A4.796 4.796 0 0 1 8 15.644V17H7v-3h3v1H8.783a3.79 3.79 0 0 0 7.017-2z" />
                <path fill="none" d="M0 0h24v24H0z" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex h-fit space-x-3 items-top px-4 py-2 rounded-md bg-white/80">
          <BackButton />
        </div>
      </header>
      <footer className="text-white flex items-center justify-center absolute bottom-1 w-full left-0 py-3 px-4 cursor-pointer">
        <div className="h-fit overflow-hidden px-4 py-2 rounded-md flex bg-white/80">
          Last Scan: {lastScan}
        </div>
      </footer>
    </div>
  );
};

export default React.memo(QrCodeScanner);
