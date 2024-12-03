import paramiko
import datetime
import re
import pyodbc  # Veritabanınızın türüne göre farklı bir kütüphane kullanabilirsiniz

# LogTypeId değerini almak için yardımcı fonksiyon
def get_log_type_id(log_type_name):
    log_type_map = {
        'INFO': 1,
        'ERROR': 2,
        'WARNING': 3
        # Diğer log türleri
    }
    return log_type_map.get(log_type_name.upper(), 0)  # Bulunamazsa 0 döndürür

# Uzak sunucu bilgileri
hostname = 'kali'
username = 'root'

# SSH özel anahtarınızın yolu
key_path = r"C:\Users\MEL\.ssh\id_rsa"  # 'r' harfi ile raw string yapıldı

# Bugünün tarihini al
today = datetime.date.today()
formatted_date = today.strftime('%Y%m%d')  # Örn: 20231128

# Dosya yollarını oluştur
remote_file_path = f'/remote/path/log_{formatted_date}.log'
local_file_path = f'C:\\Users\\MEL\\scripts\\log_{formatted_date}.log'

# Dosyayı log yazma amacıyla açma
def log_to_file(message, mode='a'):
    try:
        with open('C:\\Users\\MEL\\scripts\\log_fetch.log', mode) as f:
            f.write(message + '\n')
    except Exception as e:
        print(f"Log dosyasına yazarken bir hata oluştu: {e}")

# SSH istemcisi oluşturma
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# SSH özel anahtarını yükleme
try:
    key = paramiko.RSAKey.from_private_key_file(key_path)
    print("SSH anahtarı başarıyla yüklendi.")
    log_to_file("SSH anahtarı başarıyla yüklendi.")
except Exception as e:
    print(f"SSH anahtarını yüklerken bir hata oluştu: {e}")
    log_to_file(f"SSH anahtarını yüklerken bir hata oluştu: {e}")
    exit()

# Sunucuya bağlanma
try:
    ssh.connect(hostname=hostname, username=username, pkey=key)
    print("Sunucuya başarıyla bağlanıldı.")
    log_to_file("Sunucuya başarıyla bağlanıldı.")
except Exception as e:
    print(f"Sunucuya bağlanırken bir hata oluştu: {e}")
    log_to_file(f"Sunucuya bağlanırken bir hata oluştu: {e}")
    exit()

# SFTP istemcisi oluşturma
sftp = ssh.open_sftp()

# Dosyayı çekme
try:
    sftp.get(remote_file_path, local_file_path)
    print(f"{formatted_date} tarihli log dosyası başarıyla indirildi.")
    log_to_file(f"{formatted_date} tarihli log dosyası başarıyla indirildi.")
except FileNotFoundError:
    print(f"{formatted_date} tarihli log dosyası bulunamadı.")
    log_to_file(f"{formatted_date} tarihli log dosyası bulunamadı.", mode='w')  # 'w' modu ile dosyayı temizler
    sftp.close()
    ssh.close()
    exit()
except Exception as e:
    print(f"Dosya indirilirken bir hata oluştu: {e}")
    log_to_file(f"Dosya indirilirken bir hata oluştu: {e}")
    sftp.close()
    ssh.close()
    exit()

# Bağlantıları kapatma
sftp.close()
ssh.close()
print("Sunucu bağlantısı kapatıldı.")
log_to_file("Sunucu bağlantısı kapatıldı.")

# Log dosyasını işleme
log_entries = []
try:
    with open(local_file_path, 'r') as file:
        for line in file:
            # Log satırını parseliyoruz
            match = re.match(r'^(.*?) \[(.*?)\] (.*)$', line.strip())
            if match:
                timestamp_str, log_type_name, message = match.groups()
                # Zaman damgasını datetime formatına çevir
                timestamp = datetime.datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
                # LogTypeId değerini al
                log_type_id = get_log_type_id(log_type_name)
                # ServerId değerini belirleyin (örneğin, 1)
                server_id = 1
                # Log girişini ekle
                log_entries.append((log_type_id, timestamp, message, server_id))
            else:
                print(f"Satır parselenemedi: {line}")
                log_to_file(f"Satır parselenemedi: {line}")
    print("Log dosyası başarıyla okundu ve işlendi.")
    log_to_file("Log dosyası başarıyla okundu ve işlendi.")
except Exception as e:
    print(f"Log dosyasını okurken bir hata oluştu: {e}")
    log_to_file(f"Log dosyasını okurken bir hata oluştu: {e}")
    exit()

# Veritabanına bağlanma
try:
    conn_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=ServerManagementsystem;UID=sa;PWD=Password_123#'
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    print("Veritabanına başarıyla bağlanıldı.")
    log_to_file("Veritabanına başarıyla bağlanıldı.")
except Exception as e:
    print(f"Veritabanına bağlanırken bir hata oluştu: {e}")
    log_to_file(f"Veritabanına bağlanırken bir hata oluştu: {e}")
    exit()

# Log girişlerini veritabanına ekleme
try:
    for entry in log_entries:
        log_type_id, timestamp, message, server_id = entry
        cursor.execute("""
            INSERT INTO Log (LogTypeId, Timestamp, Message, ServerId)
            VALUES (?, ?, ?, ?)
        """, log_type_id, timestamp, message, server_id)
    conn.commit()
    print("Log dosyaları veritabanına başarıyla kaydedildi.")
    log_to_file("Log dosyaları veritabanına başarıyla kaydedildi.")
except Exception as e:
    print(f"Veritabanına veri eklerken bir hata oluştu: {e}")
    log_to_file(f"Veritabanına veri eklerken bir hata oluştu: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()
    print("Veritabanı bağlantısı kapatıldı.")
    log_to_file("Veritabanı bağlantısı kapatıldı.")
