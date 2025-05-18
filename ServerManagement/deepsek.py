import sys
import json
import ollama

def analyze_custom_logs(log_file_path, user_question=""):
    try:
        with open(log_file_path, "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f.readlines()]

        if len(lines) < 4:
            print(json.dumps({"error": "Yetersiz log verisi."}), flush=True)
            return

        logs = []
        for i in range(0, len(lines), 4):
            if i + 3 < len(lines):
                logs.append({
                    "timestamp": lines[i],
                    "level": lines[i+1],
                    "importance": lines[i+2],
                    "message": lines[i+3]
                })

        log_text = "\n".join([
            f"{log['timestamp']} | {log['level']} | {log['importance']} | {log['message']}"
            for log in logs
        ])

        prompt = f"""
You are a system log analyst.

The user has a specific question about the server status:
🔍 "{user_question}"

Your task is to answer this question based on the server logs, which include:
- Timestamp
- Log Level (Information, Warning, Error)
- Importance Level (Normal, High, Low)
- Message

Instructions:
- Focus on answering the user's question based on evidence from the logs.
- If there's not enough information, say it.
- Do NOT write or suggest code.
- Do NOT explain the structure.
- Keep the response in **1–2 sentences only.**

Logs:
{log_text}
"""

        response = ollama.chat(
            model="deepseek-coder:1.3b",
            messages=[{"role": "user", "content": prompt}]
        )
        print(json.dumps({"response": response["message"]["content"]}), flush=True)

    except Exception as e:
        print(json.dumps({"error": f"LLM hatası: {str(e)}"}), flush=True)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Kullanım: python deepsek.py <log_dosyası> [kullanıcı_mesajı]")
        sys.exit()

    log_file_path = sys.argv[1]
    user_question = sys.argv[2] if len(sys.argv) > 2 else ""
    analyze_custom_logs(log_file_path, user_question)
