import React, { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([]);
  const [empleado, setEmpleado] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const empleados = [...new Set(data.map((d) => d.Empleado))];

  const dataFiltrada = empleado
    ? data.filter((d) => d.Empleado === empleado)
    : data;

  const resumen = dataFiltrada.reduce((acc, curr) => acc + (curr.Horas || 0), 0);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">📊 Control de Horas</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {empleados.length > 0 && (
        <select
          className="border p-2 mb-4"
          value={empleado}
          onChange={(e) => setEmpleado(e.target.value)}
        >
          <option value="">Todos los empleados</option>
          {empleados.map((emp, i) => (
            <option key={i} value={emp}>
              {emp}
            </option>
          ))}
        </select>
      )}

      {dataFiltrada.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Total horas: {resumen}
          </h2>

          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-2 py-1">Empleado</th>
                <th className="border border-gray-400 px-2 py-1">Fecha</th>
                <th className="border border-gray-400 px-2 py-1">Horas</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltrada.map((row, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 px-2 py-1">
                    {row.Empleado}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {row.Fecha}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {row.Horas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
