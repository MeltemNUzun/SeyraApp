import sys
import ollama

def analyze_logs(log_file_path):
    # Log dosyasını oku
    try:
        with open(log_file_path, "r", encoding="utf-8") as f:
            logs = f.readlines()
    except FileNotFoundError:
        print("Log dosyası bulunamadı.")
        return

    if not logs:
        print("Log dosyası boş.")
        return

    # İlk 50 satırı kullanarak LLM'e prompt oluştur
    prompt = f"""
Aşağıdaki sunucu loglarını analiz et:
- Özetle ve önemli olayları belirt.
- Olası anormallikleri tespit et (örneğin, başarısız girişler, yavaş sorgular, hatalar).

Loglar:
{' '.join(logs[:50])}

Eğer anomali varsa açıkla, yoksa normal olduğunu belirt.
    """

    try:
        response = ollama.chat(
            model="mistral",
            messages=[{"role": "user", "content": prompt}]
        )
        print(response["message"]["content"])  # Go backend bu çıktıyı alır
    except Exception as e:
        print(f"LLM Hatası: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Kullanım: python deepsek.py <log_dosyası>")
        sys.exit()

    log_file_path = sys.argv[1]
    analyze_logs(log_file_path)
