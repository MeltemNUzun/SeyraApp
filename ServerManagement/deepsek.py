import sys
import ollama

def analyze_custom_logs(log_file_path):
    try:
        with open(log_file_path, "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f.readlines()]
    except FileNotFoundError:
        print("Log dosyası bulunamadı.")
        return

    if len(lines) < 4:
        print("Yetersiz log verisi.")
        return

    # 4 satır = 1 log formatına göre grupla
    logs = []
    for i in range(0, len(lines), 4):
        if i + 3 < len(lines):
            logs.append({
                "timestamp": lines[i],
                "level": lines[i+1],
                "importance": lines[i+2],
                "message": lines[i+3]
            })

    # Logları string olarak yaz prompt'a göm
    log_text = "\n".join([f"{log['timestamp']} | {log['level']} | {log['importance']} | {log['message']}" for log in logs])

    # Net ve görev odaklı prompt
    prompt = f"""
You are a system log analyst.

Your task is to analyze server logs that include the following fields:
- Timestamp
- Log Level (Information, Warning, Error)
- Importance Level (Normal, High, Low)
- Message

Instructions:
- Do NOT explain what you are doing.
- Do NOT write or suggest any code.
- Do NOT describe the structure of the logs.
- Just return a very short summary in 1–2 sentences only.
- Example responses:
    - "System appears normal."
    - "2 Error logs and 1 Critical log detected. Check recommended."

Respond only with the final summary.
Logs:
{log_text}
"""

    try:
        response = ollama.chat(
            model="deepseek-coder",
            messages=[{"role": "user", "content": prompt}]
        )
        print("\nLLM Analizi:\n")
        print(response["message"]["content"])
    except Exception as e:
        print(f"LLM Hatası: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Kullanım: python deepsek.py <log_dosyası>")
        sys.exit()

    log_file_path = sys.argv[1]
    analyze_custom_logs(log_file_path)
