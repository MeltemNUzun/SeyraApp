import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import Dashboard from "../components/Dashboard"; // Dashboard bileşeni
import ChatBot from "../components/ChatBot";


function DashboardPage() {
  const { serverId } = useParams(); // URL'den sunucu ID'sini al
  const navigate = useNavigate();
  const [serverName, setServerName] = useState(""); // Sunucu adı state

  // **✅ API'den Sunucu Adını Çek**
  useEffect(() => {
    const fetchServerName = async () => {
      try {
        const response = await api.get("http://127.0.0.1:8080/api/v1/servers");
        console.log("DashboardPage API'den gelen sunucular:", response.data);

        // ID'ye göre sunucuyu bul
        const server = response.data.find((s) => Number(s.server_id) === Number(serverId));

        if (server) {
          setServerName(server.server_name);
        } else {
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

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6A1B9A" }}>
          {serverName ? `${serverName} Dashboard` : "Dashboard"}
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
          Geri Dön
        </Button>
      </Box>
      <Dashboard serverId={serverId} />
      <ChatBot serverId={serverId} /> {/* ✅ Server ID geçildi */}
    </Container>
  );
}

export default DashboardPage;
