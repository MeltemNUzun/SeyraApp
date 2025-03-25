import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Snackbar,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function ServerLogs() {
  const { serverId } = useParams();
  const [serverName, setServerName] = useState("");
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [importance, setImportance] = useState("");
  const [logType, setLogType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get(`/logs/${serverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🔍 API'den gelen log verisi:", response.data);
      setLogs(response.data);
      setFilteredLogs(response.data);
    } catch (error) {
      console.error("❌ Loglar alınırken hata oluştu:", error);
      showNotification("Loglar alınırken hata oluştu.", "error");
    }
  };

  useEffect(() => {
    const fetchServerName = async () => {
      try {
        const response = await api.get("http://127.0.0.1:8080/api/v1/servers");
        const server = response.data.find((s) => Number(s.server_id) === Number(serverId));
        setServerName(server ? server.server_name : "Bilinmeyen Sunucu");
      } catch (error) {
        setServerName("Bilinmeyen Sunucu");
      }
    };

    if (serverId) {
      fetchServerName();
      fetchLogs();
    }
  }, [serverId]);

  useEffect(() => {
    let filtered = logs;

    console.log("🧾 Orijinal loglar:", logs);

    if (searchTerm) {
      filtered = filtered.filter((log) =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (importance) {
      filtered = filtered.filter((log) => log.importance === importance);
    }

    if (logType) {
      filtered = filtered.filter((log) => log.log_type_id === parseInt(logType, 10));
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filtered = filtered.filter((log) => {
        const logDate = new Date(
          new Date(log.timestamp).toLocaleString("en-US", { timeZone: "Europe/Istanbul" })
        );
        return logDate >= start && logDate <= end;
      });
    }

    console.log("✅ Filtrelenmiş loglar:", filtered);
    setFilteredLogs(filtered);
  }, [logs, searchTerm, importance, logType, startDate, endDate]);

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const goToDashboard = () => {
    navigate(`/dashboard/${serverId}`);
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
        <Button variant="contained" color="primary" onClick={goToDashboard}>
          Dashboard’u Görüntüle
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>
          Çıkış Yap
        </Button>
      </Box>

      <Typography
        variant="h4"
        align="center"
        sx={{
          marginBottom: "20px",
          color: "#6A1B9A",
          fontFamily: "Poppins, sans-serif",
          fontWeight: "bold",
        }}
      >
        Sunucu Logları - {serverName}
      </Typography>

      {/* Filtreler */}
      <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <TextField label="Loglarda Ara" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
        <FormControl fullWidth>
          <InputLabel id="logType-label">Log Türü</InputLabel>
          <Select labelId="logType-label" value={logType} onChange={(e) => setLogType(e.target.value)}>
            <MenuItem value="">ALL</MenuItem>
            <MenuItem value="3">INFO</MenuItem>
            <MenuItem value="2">WARN</MenuItem>
            <MenuItem value="1">ERROR</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="importance-label">Önem Derecesi</InputLabel>
          <Select labelId="importance-label" value={importance} onChange={(e) => setImportance(e.target.value)}>
            <MenuItem value="">ALL</MenuItem>
            <MenuItem value="Low">LOW</MenuItem>
            <MenuItem value="Medium">MEDIUM</MenuItem>
            <MenuItem value="High">HIGH</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="datetime-local"
          label="Başlangıç Tarihi"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
        />
        <TextField
          type="datetime-local"
          label="Bitiş Tarihi"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Tablo */}
      <Box sx={{ height: 400, width: "100%" }}>
        {console.log("📦 filteredLogs:", filteredLogs)}
        <DataGrid
          rows={filteredLogs}
          columns={[
            {
              field: "timestamp",
              headerName: "Tarih",
              flex: 1,
              renderCell: (params) => {
                const timestamp = params.row?.timestamp;
                if (!timestamp) return "Zaman Yok";
          
                const date = new Date(timestamp);
                const formatted = date.toLocaleString("tr-TR", {
                  timeZone: "Europe/Istanbul",
                  hour12: false,
                });
          
                return formatted;
              },
            },
            { field: "log_type_name", headerName: "Log Türü", flex: 1 },
            { field: "importance", headerName: "Önem Derecesi", flex: 1 },
            { field: "message", headerName: "Mesaj", flex: 2 },
          ]}
          pageSize={5}
          getRowId={(row) => row.log_id}
          sx={{ "& .MuiDataGrid-row": { backgroundColor: "#ffffff" } }}
        />
      </Box>

      {/* Bildirim */}
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleNotificationClose}>
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ServerLogs;
