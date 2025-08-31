import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([]);
  const [empleado, setEmpleado] = useState("");
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  // URL pública del Excel en GitHub
  const EXCEL_URL = "https://raw.githubusercontent.com/nestum447/Empleado/main/empleados.xlsx";

  useEffect(() => {
    fetch(EXCEL_URL)
      .then((res) => res.arrayBuffer()) // importante para XLSX
      .then((ab) => {
        const wb = XLSX.read(ab, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { raw: false });
        setData(jsonData);
      })
      .catch((err) => console.error("Error al leer Excel:", err));
  }, []);

  const empleados = [...new Set(data.map((d) => d.Empleado))];

  const dataFiltrada = data.filter((row) => {
    let cumpleEmpleado = empleado ? row.Empleado === empleado : true;
    let cumpleFecha = true;
    if (fechaInicial) cumpleFecha = new Date(row.Fecha) >= new Date(fechaInicial);
    if (fechaFinal) cumpleFecha = cumpleFecha && new Date(row.Fecha) <= new Date(fechaFinal);
    return cumpleEmpleado && cumpleFecha;
  });

const resumen = dataFiltrada.reduce((acc, curr) => acc + (Number(curr.Horas) || 0), 0);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          📊 Control de Horas por Empleado
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
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

          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring focus:ring-blue-300"
            value={fechaInicial}
            onChange={(e) => setFechaInicial(e.target.value)}
          />

          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring focus:ring-blue-300"
            value={fechaFinal}
            onChange={(e) => setFechaFinal(e.target.value)}
          />
        </div>

        {dataFiltrada.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Total horas:{" "}
              <span className="text-green-600 font-bold">{resumen}</span>
            </h2>

            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="w-full border border-gray-300 text-left">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3">Empleado</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Horas</th>
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
        ) : (
          <p className="text-center text-gray-500 mt-6 text-lg">
            No hay registros para el filtro seleccionado.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
