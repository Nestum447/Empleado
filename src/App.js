import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([]);
  const [empleado, setEmpleado] = useState("");

  // Cargar el Excel desde /public
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/empleados.xlsx")
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        setData(jsonData);
      });
  }, []);

  const empleados = [...new Set(data.map((d) => d.Empleado))];

  const dataFiltrada = empleado
    ? data.filter((d) => d.Empleado === empleado)
    : data;

  const resumen = dataFiltrada.reduce((acc, curr) => acc + (curr.Horas || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          📊 Control de Horas por Empleado
        </h1>

        {empleados.length > 0 && (
          <div className="flex justify-center mb-6">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring focus:ring-blue-300"
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
          </div>
        )}

        {dataFiltrada.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Total horas:{" "}
              <span className="text-green-600 font-bold">{resumen}</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-left rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-2">Empleado</th>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2">Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFiltrada.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-2 border-t">{row.Empleado}</td>
                      <td className="px-4 py-2 border-t">{row.Fecha}</td>
                      <td className="px-4 py-2 border-t">{row.Horas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
