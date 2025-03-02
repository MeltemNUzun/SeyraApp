import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import api from "../axiosConfig";
import ImportancePieChart from "../components/ImportancePieChart";
import LogsBarChart from "../components/LogsBarChart";

const Dashboard = ({ serverId }) => {
  const [logs, setLogs] = useState([]);
  const [serverName, setServerName] = useState(""); // Başlangıçta boş bırakıyoruz

  // **1️⃣ Sunucu Adını API'den Çek**
  useEffect(() => {
    const fetchServerName = async () => {
      try {
        const response = await api.get("http://127.0.0.1:8080/api/v1/servers");
        console.log("API'den gelen tüm sunucular:", response.data);

        // Sunucu ID'yi doğru şekilde eşleştir
        const server = response.data.find((s) => Number(s.server_id) === Number(serverId));

        if (server) {
          console.log(`Eşleşen Sunucu: ${server.server_name}`);
          setServerName(server.server_name);
        } else {
          console.warn("Server ID eşleşmedi, sunucu bulunamadı!");
          setServerName("Bilinmeyen Sunucu");
        }
      } catch (error) {
        console.error("Sunucu adı alınırken hata oluştu:", error);
        setServerName("Bilinmeyen Sunucu");
      }
    };

    if (serverId) {
      fetchServerName();
    }
  }, [serverId]);

  // **2️⃣ Logları API'den Çek**
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get(`/logs/${serverId}`);
        setLogs(response.data);
      } catch (error) {
        console.error("Dashboard verisi alınırken hata oluştu:", error);
      }
    };

    if (serverId) {
      fetchLogs();
    }
  }, [serverId]);

  // **3️⃣ Pie Chart için Veriyi Hazırla**
  const importanceCounts = logs.reduce((acc, log) => {
    const importanceKey = log.importance.trim().charAt(0).toUpperCase() + log.importance.trim().slice(1).toLowerCase();
    acc[importanceKey] = (acc[importanceKey] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(importanceCounts).map((key) => ({
    name: key,
    value: importanceCounts[key],
  }));

  // **4️⃣ Bar Chart için Veriyi Hazırla**
  const logsByDate = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(logsByDate).map((key) => ({
    date: key,
    count: logsByDate[key],
  }));

  return (
    <Container>
    

      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold", color: "#1E88E5" }}>
              Log Önem Derecesi Dağılımı
            </Typography>
            <ImportancePieChart data={pieChartData} />
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold", color: "#D32F2F" }}>
              Günlük Log Dağılımı
            </Typography>
            <LogsBarChart data={barChartData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
