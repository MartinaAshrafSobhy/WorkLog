import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Helmet } from "react-helmet";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  const formik = useFormik({
    initialValues: {
      month: "",
      year: "",
      code: "",
    },
    validationSchema: Yup.object({
      month: Yup.string(),
      year: Yup.string().required("Year is required"),
      code: Yup.string(), 
    }),
    onSubmit: async (values) => {
       try {
    if (values.code) {
      // Report for user
      const response = await axios.get("http://localhost:7000/report/ReportForUser", { params: values });
      if (response.data.success) {
        setAttendanceData([response.data.report]); // [] to view table
      } else {
        alert("No report found for this code.");
      }
    } else {
      // Report for all users
      const response = await axios.get("http://localhost:7000/report/Report", { params: values });
      if (response.data.success && response.data.report.length > 0) {
        setAttendanceData(response.data.report);
      } else {
        alert("No report found.");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to fetch data. Please try again.");
  }
    },
  });

 



  const handleExport = () => {
    const fileName = attendanceData?.length ? `Report_${attendanceData[0].name || "report"}` : "summary";

    if (exportFormat === "pdf") {
      exportToPDF(fileName);
    } else if (exportFormat === "csv") {
      exportToCSV(fileName);
    } else if (exportFormat === "both") {
      exportToPDF(fileName);
      exportToCSV(fileName);
    }

    setExportMenuOpen(false);
  };

  const exportToPDF = (fileName) => {
    const doc = new jsPDF();
    doc.text("Attendance Summary Report", 14, 10);

    const tableColumn = ["Code","Name", "Notes", "Present", "Absent", "Late", "Permission"];
    const tableRows = attendanceData.map((data) => [
      data.code || "-",
      data.name || "-",
      data.notes?.join(", ") || "-",
      data.totalPresent || 0,
      data.totalAbsent || 0,
      data.totalLate || 0,
      data.totalPermission || 0,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
      },
    });

    doc.save(`${fileName}.pdf`);
  };

  const exportToCSV = (fileName) => {
    const headers = ["Code,Name,Notes,Present,Absent,Late,Permission"];
    const rows = attendanceData.map((data) => [
      `"${data.code || "-"}"`,
      `"${data.name || "-"}"`,
      `"${data.notes?.join("; ") || "-"}"`,
      data.totalPresent || 0,
      data.totalAbsent || 0,
      data.totalLate || 0,
      data.totalPermission || 0,
    ].join(","));

    const csvContent = headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${fileName}.csv`);
  };

  return <>
   <Helmet>
        <title>Attendance Summary</title>
        <meta property="og:title" content="Attendance Summary" />
        <meta property="og:description" content="Manage attendance records, search, filter, and export reports." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/home " />
        <link rel="canonical" href="https://yourdomain.com/home " />
      </Helmet>
  <div
      style={{ backgroundColor: "rgb(228, 240, 255)" }}
      className="container p-4 border rounded-4 shadow-sm mb-5"
    >
      <h2 className="text-center mb-4" style={{ color: "#FDC800" }}>
        Attendance Summary
      </h2>

      {!attendanceData ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="row justify-content-center gy-4">
            {["month", "year", "code"].map((field, index) => (
              <div className="col-12 col-md-3" key={index}>
                <label htmlFor={field} className="form-label text-capitalize">
                  {field}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  className={`form-control ${formik.touched[field] && formik.errors[field] ? "is-invalid" : ""}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field]}
                />
                {formik.touched[field] && formik.errors[field] && (
                  <div className="text-danger small mt-1">{formik.errors[field]}</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary w-25 py-2"
              disabled={formik.isSubmitting}
            >
              Search
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              onClick={() => setAttendanceData(null)}
              className="button w-25"
            >
              Search Again
            </button>

            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="me-5 btn btn-success"
              >
                Export
              </button>

              {exportMenuOpen && (
                <div
                  className="shadow"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <label className="d-block mb-2">
                    <input
                      type="radio"
                      value="pdf"
                      checked={exportFormat === "pdf"}
                      onChange={() => setExportFormat("pdf")}
                      className="me-2"
                    />
                    PDF
                  </label>
                  <label className="d-block mb-2">
                    <input
                      type="radio"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={() => setExportFormat("csv")}
                      className="me-2"
                    />
                    CSV
                  </label>
                  <label className="d-block mb-2">
                    <input
                      type="radio"
                      value="both"
                      checked={exportFormat === "both"}
                      onChange={() => setExportFormat("both")}
                      className="me-2"
                    />
                    Both
                  </label>
                  <button
                    className="btn btn-sm btn-primary w-100 mt-2"
                    onClick={handleExport}
                  >
                    Export
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="table-responsive mt-4">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Code</th> 
                  <th>Name</th>
                  <th>Total Present</th>
                  <th>Total Absents</th>
                  <th>Total Lates</th>
                  <th>Total Permission</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((data, index) => (
                  <tr key={data._id || data.userId}>
                    <td>{data.code}</td> 
                    <td>{data.name}</td>
                    <td>{data.totalPresent}</td>
                    <td>{data.totalAbsent}</td>
                    <td>{data.totalLate}</td>
                    <td>{data.totalPermission}</td>
                    <td>
                      {data.notes?.length
                        ? data.notes.map((note, i) => (
                            <div key={i} className="text-wrap">
                              {note}
                            </div>
                          ))
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  </>;
};

export default Attendance;