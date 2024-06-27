import { useEffect, useRef, useState } from "react";
import QRScanner from "qr-scanner";
import io from "socket.io-client";

const socket = io.connect("https://attendance-backend-rho.vercel.app/"); // Ensure this matches your server address

QRScanner.WORKER_PATH = "/qr-scanner-worker.min.js";

function Student() {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [uploadMode, setUploadMode] = useState(false);

  useEffect(() => {
    if (!uploadMode) {
      const qrScanner = new QRScanner(videoRef.current, (result) =>
        setScanResult(JSON.parse(result))
      );
      qrScanner.start();

      return () => {
        qrScanner.stop(); // Stop scanning when the component unmounts
      };
    }
  }, [uploadMode]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await QRScanner.scanImage(file);
        setScanResult(JSON.parse(result));
      } catch (error) {
        console.error("Error scanning QR code: ", error);
        alert("Failed to scan QR code. Please try again.");
      }
    }
  };

  const handleSelectChange = (e) => {
    setStudentName(e.target.value);
  };

  const handleSubmit = () => {
    if (studentName && scanResult) {
      socket.emit("submitAttendance", { studentName, ...scanResult });
      alert("Attendance submitted!");
    } else {
      alert("Please scan the QR code and select your name.");
    }
  };

  return (
    <section>
      <div className="container max-w-[70%] m-auto mt-5">
        <h1 className="text-center text-4xl font-bold mb-5">
          Scan or Upload QR Code
        </h1>
        <div className="mode-buttons mb-5 flex gap-5">
          <button
            onClick={() => setUploadMode(false)}
            className="bg-blue-400 p-3 rounded-xl"
          >
            Scan QR Code
          </button>
          <button
            onClick={() => setUploadMode(true)}
            className="bg-green-400 p-3 rounded-xl"
          >
            Upload QR Code
          </button>
        </div>

        {!uploadMode ? (
          <video ref={videoRef} style={{ width: "100%" }} />
        ) : (
          <div className="upload-section">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        )}

        {scanResult && (
          <div className="class-details">
            <h2 className="text-green-800 text-2xl font-semibold">
              Class Details
            </h2>
            <p>Date: {scanResult.Date}</p>
            <p>Subject: {scanResult.Subject}</p>
            <p>Session: {scanResult.Session}</p>
            <p>Professor: {scanResult.Professor}</p>
            <select onChange={handleSelectChange} value={studentName}>
              <option value="">Select Your Name</option>
              {/* Example student names; replace with dynamic data */}
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
            </select>
            <button
              onClick={handleSubmit}
              className="bg-blue-400 p-2 rounded-xl ml-2 mt-3"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Student;
