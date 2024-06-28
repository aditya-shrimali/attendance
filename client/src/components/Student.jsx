import { useEffect, useRef, useState } from "react";
import QRScanner from "qr-scanner";
import io from "socket.io-client";

// const socket = io.connect("http://localhost:4000"); // Ensure this matches your server address
const socket = io.connect("https://attendance-4.onrender.com"); // Ensure this matches your server address

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
    <section className="flex flex-col items-center mt-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-[70%] mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl font-bold mb-5">
          Scan or Upload QR Code
        </h1>
        <div className="mode-buttons mb-5 flex gap-5 justify-center">
          <button
            onClick={() => setUploadMode(false)}
            className="bg-blue-400 p-3 rounded-xl text-white"
          >
            Scan QR Code
          </button>
          <button
            onClick={() => setUploadMode(true)}
            className="bg-green-400 p-3 rounded-xl text-white"
          >
            Upload QR Code
          </button>
        </div>

        {!uploadMode ? (
          <video
            ref={videoRef}
            className="w-full h-auto border-2 border-gray-300 rounded-lg shadow-md"
          />
        ) : (
          <div className="upload-section flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
        )}

        {scanResult && (
          <div className="class-details mt-5">
            <h2 className="text-green-800 text-2xl font-semibold mb-2">
              Class Details
            </h2>
            <p>Date: {scanResult.Date}</p>
            <p>Subject: {scanResult.Subject}</p>
            <p>Session: {scanResult.Session}</p>
            <p>Professor: {scanResult.Professor}</p>
            <div className="mt-3 flex flex-col">
              <select
                onChange={handleSelectChange}
                value={studentName}
                className="border border-gray-300 rounded-lg p-2 w-[40%]"
              >
                <option value="">Select Your Name</option>
                {/* Example student names; replace with dynamic data */}
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
              </select>
              <button
                onClick={handleSubmit}
                className="bg-blue-400 p-2 rounded-xl text-white mt-3 w-[40%]"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Student;
