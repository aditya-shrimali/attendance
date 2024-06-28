import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import io from "socket.io-client";

// const socket = io.connect("http://localhost:4000"); // Ensure this matches your server address
const socket = io.connect("https://attendance-4.onrender.com"); // Ensure this matches your server address

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
      <section className="flex flex-col mt-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          QR Based Real-Time Attendance System
        </h1>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-3/5 w-full px-4 sm:px-6 lg:px-8 mb-8 lg:mb-0">
            <h1 className="text-2xl font-bold mb-4">Attendance for:</h1>
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <div className="grid grid-cols-1 gap-5 lg:w-1/2">
                {Object.entries(form).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-5">
                    <label
                      className="text-lg sm:text-2xl font-semibold text-gray-600 w-1/3"
                      htmlFor={key}
                    >
                      {key}
                    </label>
                    {key === "Date" ? (
                      <input
                        type="date"
                        className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3"
                        name={key}
                        value={value}
                        onChange={handleChange}
                      />
                    ) : key === "Subject" ||
                      key === "Session" ||
                      key === "Professor" ? (
                      <select
                        className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3"
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
                        className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3"
                        name={key}
                        value={value}
                        onChange={handleChange}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold px-4 py-2 rounded"
                    onClick={handleSubmit}
                  >
                    Generate QR Code
                  </button>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center lg:justify-start mt-4 lg:mt-0">
                {qrData && (
                  <div>
                    <QRCode value={qrData} size={300} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-2/5 w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-2">
                Count: {attendanceList.length}
              </h2>
              <div>
                <h2 className="text-2xl font-bold mb-2">Attendance List</h2>
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
          </div>
        </div>
      </section>
    </>
  );
}

export default Teacher;
