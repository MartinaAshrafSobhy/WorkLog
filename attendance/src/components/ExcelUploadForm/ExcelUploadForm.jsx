import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as XLSX from "xlsx";
import * as Yup from "yup";
import axios from "axios";

const ExcelUploadForm = () => {

  const [data, setData] = useState([]);
  const fileInputRef = useRef();

  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required("File is required")
        .test("fileType", "Only Excel files are allowed", (value) => {
          return (
            value &&
            ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(
              value.type
            )
          );
        }),
    }),
    onSubmit: async (values) => {
      const file = values.file;

      //Parse the Excel file
      const reader = new FileReader();
      reader.onload = async (event) => {
        const binaryData = event.target.result;
        const workbook = XLSX.read(binaryData, { type: "binary" });

        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet data into JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Process the data (remove headers, format rows, etc.)
        const headers = jsonData[0]; // First row as headers
        const rows = jsonData.slice(1); // Remaining rows as data
        const formData = new FormData();
        formData.append("file", values.file); // field name MUST match multer field name
        
        try {
          const response = await axios.post('http://localhost:7000/attendance/import', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });      
          formik.resetForm();
          fileInputRef.current.value = "";
        } catch (err) {
          console.error("Error sending data:", err);
        }
      };

      reader.readAsBinaryString(file);
    },
  });

  return (

    <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
      <label htmlFor="file"></label>
      <input
        className="form-control form-control-sm mb-2"
        id="formFileSm"
        name="file"
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={(event) => {
          formik.setFieldValue("file", event.currentTarget.files[0]);
        }}
      />
      {formik.touched.file && formik.errors.file ? (
        <div style={{ color: "red" }}>{formik.errors.file}</div>
      ) : null}

      <button className="button w-50 start-0" type="submit" disabled={formik.isSubmitting}>Upload</button>

    </form>
  );
};

export default ExcelUploadForm;