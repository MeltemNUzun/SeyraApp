import React, { useState } from "react";
import {
  Drawer, Box, Typography, IconButton, Button, Stack, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";

const ChatBot = ({ serverId }) => {

  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Merhaba, ben Seyra IA. Sizin için ne yapabilirim?" }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalLogs, setModalLogs] = useState([]);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAdvice, setModalAdvice] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    const userText =
      option === "daily"
        ? "📅  Günlük Logları Analiz Et"
        : option === "weekly"
        ? "📊 Bir Haftalık Analiz"
        : "🗓️ Aylık Analiz";

    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setMessages((prev) => [...prev, { from: "bot", text: "Seyra IA yazıyor...", typing: true }]);

    const steps = [
      "Analiz başlatılıyor...",
      "Loglar toplanıyor...",
      "Anomali kontrolü yapılıyor...",
      "Analiz tamamlandı ✅",
      "İşte bazı örnek loglar:"
    ];

    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => !msg.typing));
      steps.forEach((text, i) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text }]);

          if (i === steps.length - 1) {
            setTimeout(() => {
              const logs = [
                "[ERROR] 2025-03-22 15:22:14 - CPU aşırı kullanım!",
                "[WARN] 2025-03-22 15:10:02 - Memory sınırı %85'e ulaştı.",
                "[INFO] 2025-03-22 14:59:32 - Sistem yeniden başlatıldı."
              ];

              logs.forEach((log, j) => {
                setTimeout(() => {
                  setMessages((prev) => [...prev, { from: "bot", text: log }]);
                }, j * 500);
              });

              const errorLogs = logs.filter((log) => log.includes("[ERROR]"));
              const warnLogs = logs.filter((log) => log.includes("[WARN]"));

              setTimeout(() => {
                setModalLogs(logs);

                if (errorLogs.length > 0) {
                  setModalType("error");
                  setModalTitle("❌ Kritik Hata Tespit Edildi");
                  setModalMessage("Sistem loglarında ciddi hatalar bulundu.");
                  setModalAdvice("Lütfen CPU kaynak kullanımını izleyin.");
                } else if (warnLogs.length > 0) {
                  setModalType("warning");
                  setModalTitle("⚠️ Uyarı Tespit Edildi");
                  setModalMessage("Loglarda bazı potansiyel riskler mevcut.");
                  setModalAdvice("Bellek kullanımını kontrol etmeniz önerilir.");
                } else {
                  setModalType("success");
                  setModalTitle("✅ Her Şey Yolunda");
                  setModalMessage("Loglar temiz, bir sorun bulunamadı.");
                  setModalAdvice("İzleme sisteminizi aynı düzende sürdürün.");
                }

                setModalOpen(true);
              }, logs.length * 500 + 500);
            }, 1000);
          }
        }, i * 1000);
      });
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
  
    setMessages((prev) => [...prev, { from: "user", text: userInput }]);
    setUserInput("");
  
    setMessages((prev) => [...prev, { from: "bot", text: "Seyra IA yazıyor...", typing: true }]);
  // 👇
  console.log("Sunucuya gönderilen veri:", {
    message: userInput,
    server_id: serverId
  });

    try {
      const token = localStorage.getItem("auth_token"); // 💡 JWT token buradaysa
  
      const response = await fetch("http://localhost:8080/api/v1/analyze-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // 👈 token ekleniyor
        },
        body: JSON.stringify({ message: userInput,   server_id: Number(serverId) })
       
      });
  
      const data = await response.json();
  
      setMessages((prev) => prev.filter((msg) => !msg.typing));
      setMessages((prev) => [...prev, { from: "bot", text: data.answer }]);
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => !msg.typing));
      setMessages((prev) => [...prev, {
        from: "bot",
        text: "⚠️ DeepSEK API'den cevap alınamadı. Lütfen giriş yaptığınızdan emin olun."
      }]);
    }
  };
  

  const handleDownloadLogs = () => {
    const blob = new Blob([modalLogs.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seyra_log_analizi.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {!open && (
              <IconButton
              onClick={() => setOpen(true)}
              sx={{
                position: "fixed", top: 25, right: 140, width: 80, height: 80,
                backgroundColor: "#6A1B9A", color: "#fff", zIndex: 9999,
                boxShadow: "0 0 12px 4px rgba(106, 27, 154, 0.6)",
                animation: "pulse 2s infinite",
                "&:hover": { backgroundColor: "#4A148C" },
                "@keyframes pulse": {
                  "0%": { boxShadow: "0 0 0px 0px rgba(106,27,154, 0.7)" },
                  "50%": { boxShadow: "0 0 12px 6px rgba(106,27,154, 0.6)" },
                  "100%": { boxShadow: "0 0 0px 0px rgba(106,27,154, 0.7)" }
                }
              }}
            >
              <SmartToyIcon sx={{ fontSize: 45 }} />
            </IconButton>
      )}

      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedOption(null);
          setMessages([
            { from: "bot", text: "Merhaba, ben Seyra IA. Sizin için ne yapabilirim?" }
          ]);
        }}
        PaperProps={{ sx: { width: 340, padding: 2, backgroundColor: "#F3E5F5" } }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", top: 10, right: 10 }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#6A1B9A", textAlign: "center", mb: 2 }}>
            🤖 Seyra IA
          </Typography>

          <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2, mb: 2 }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{
                display: "flex",
                justifyContent: msg.from === "bot" ? "flex-start" : "flex-end", mb: 1
              }}>
                <Box sx={{
                  bgcolor: msg.typing ? "#E0E0E0" : msg.from === "bot" ? "#EDE7F6" : "#D0F8CE",
                  px: 2, py: 1, borderRadius: 2, maxWidth: "80%"
                }}>
                  <Typography variant="body2" sx={{ fontStyle: msg.typing ? "italic" : "normal" }}>
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {!selectedOption && (
            <Stack spacing={2} sx={{ mb: 2 }}>
              <Button variant="contained" fullWidth onClick={() => handleOptionClick("daily")}>📅  Günlük Logları Analiz Et</Button>
              <Button variant="contained" fullWidth onClick={() => handleOptionClick("weekly")}>📊 Bir Haftalık Analiz</Button>
              <Button variant="contained" fullWidth onClick={() => handleOptionClick("monthly")}>🗓️ Aylık Analiz</Button>
            </Stack>
          )}

          <Box sx={{ display: "flex" }}>
            <TextField
              size="small"
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Mesaj yaz..."
              sx={{ bgcolor: "white", borderRadius: 1 }}
            />
            <Button onClick={handleSendMessage} variant="contained" sx={{ ml: 1 }}>
              Gönder
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>{modalMessage}</Typography>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Sistem Önerisi: {modalAdvice}
          </Typography>
          <Box component="pre" sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, maxHeight: 200, overflow: "auto", mt: 2 }}>
            {modalLogs.join("\n")}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadLogs}>⬇️ Raporu İndir</Button>
          <Button onClick={() => setModalOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatBot;
