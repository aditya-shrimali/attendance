import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import io from "socket.io-client";

// const socket = io.connect("http://localhost:4000"); // Ensure this matches your server address
const socket = io.connect("https://attendance-backend-rho.vercel.app"); // Ensure this matches your server address

function Teacher() {
  const [form, setForm] = useState({
    Date: "",
    Subject: "",
    Session: "",
    Professor: "",
  });
  const [attendanceList, setAttendanceList] = useState([]);
  const [qrData, setQrData] = useState(""); // Holds the QR code data
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    socket.on("updateAttendance", (attendance) => {
      setAttendanceList((prev) => [...prev, attendance]);
    });

    // Check if all form fields are filled
    setIsFormComplete(
      Object.values(form).every((field) => field.trim() !== "")
    );

    return () => {
      socket.off("updateAttendance");
    };
  }, [form]); // Dependency array includes form to re-check when it changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isFormComplete) {
      setQrData(JSON.stringify(form));
    } else {
      alert("Please fill in all fields before submitting.");
    }
  };

  return (
    <>
      <section className="flex mt-12">
        <div className="container w-full m-auto px-8 flex flex-col gap-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Generate QR Code
          </h1>
          <div className="grid grid-cols-1 gap-8">
            {Object.entries(form).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <label
                  className="text-xl font-semibold text-gray-600 w-[20%]"
                  htmlFor={key}
                >
                  {key}
                </label>
                {key === "Date" ? (
                  <input
                    type="date"
                    className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[80%]"
                    name={key}
                    value={value}
                    onChange={handleChange}
                  />
                ) : key === "Subject" ||
                  key === "Session" ||
                  key === "Professor" ? (
                  <select
                    className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[80%]"
                    name={key}
                    value={value}
                    onChange={handleChange}
                  >
                    <option value="">Select {key}</option>
                    {key === "Subject" &&
                      ["Math", "Science", "History"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    {key === "Session" &&
                      ["Morning", "Afternoon", "Evening"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    {key === "Professor" &&
                      ["Dr. Smith", "Prof. Johnson", "Mr. Lee"].map(
                        (option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        )
                      )}
                  </select>
                ) : (
                  <input
                    className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[80%]"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Generate QR Code
            </button>
          </div>
          {qrData && (
            <div className="flex justify-center mt-8">
              <QRCode value={qrData} className="w-32 h-32" />
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="flex flex-col mx-auto">
            <h2 className="text-4xl font-bold text-center mb-2">
              Attendance List
            </h2>
            <ul className="list-disc pl-4">
              {attendanceList.map((attendance, index) => (
                <li key={index}>
                  {attendance.studentName} - {attendance.Date} -{" "}
                  {attendance.Subject} - {attendance.Session} -{" "}
                  {attendance.Professor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Teacher;
