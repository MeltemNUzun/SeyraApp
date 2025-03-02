import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const ImportancePieChart = ({ data }) => {
  const importanceColors = {
    High: "#d32f2f",  // Kırmızı
    Medium: "#fbc02d", // Sarı (DÜZELTİLDİ)
    Low: "#388e3c",    // Yeşil
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {data.map((entry, index) => {
            const color = importanceColors[entry.name] || "#8884d8"; // Default renk
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ImportancePieChart;
