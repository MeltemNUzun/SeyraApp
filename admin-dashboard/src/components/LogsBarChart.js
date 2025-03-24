import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, Label } from "recharts";

const LogsBarChart = ({ data }) => {
  const barChartColors = ["#6A1B9A", "#1E88E5", "#D32F2F"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="date">
          <Label
            value="Tarih"
            offset={-5}
            position="insideBottom"
            style={{ fontWeight: "bold", fontSize: 16 }}
          />
        </XAxis>
        <YAxis>
          <Label
            value="Log Sayısı"
            angle={-90}
            position="insideLeft"
            style={{ fontWeight: "bold", fontSize: 16 }}
          />
        </YAxis>
        <Tooltip />
        <Bar dataKey="count">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barChartColors[index % barChartColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LogsBarChart;
