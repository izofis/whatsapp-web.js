# Logger - Geçici Çözüm

Bu logger sistemi **geçici bir çözümdür** ve ihtiyaç duyulduğunda kolayca kaldırılabilir veya tekrar eklenebilir.

## 📂 Dosyalar

- ✅ `src/util/Logger.js` - Logger implementasyonu (yeni eklenen dosya)
- ✅ `src/Client.js` - Logger'ı kullanan dosya (satır ~140)

---

## 🗑️ Kaldırma Talimatları

Eğer bu logger'ı kaldırmak isterseniz:

### 1. Logger Dosyasını Silin

```bash
rm src/util/Logger.js
```

### 2. Client.js'te Değişiklik Yapın

`src/Client.js` dosyasında **satır ~140** civarında:

**ÖNCE (Logger ile):**
```javascript
this.logger = this.options.logger || require('./util/Logger');
```

**SONRA (Logger olmadan):**
```javascript
this.logger = this.options.logger || {
    info: (...args) => console.log('[INFO]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    debug: (...args) => console.log('[DEBUG]', ...args)
};
```

**İşte bu kadar!** 3 satır değişti, logger kaldırıldı.

---

## 🔄 Tekrar Ekleme Talimatları (Update Sonrası)

Eğer update geldi ve logger'ı tekrar eklemek istiyorsanız:

### 1. Logger Dosyasını Geri Ekleyin

```bash
# Backup'tan kopyalayın
cp backup/Logger.js src/util/Logger.js
```

### 2. Client.js'te Tek Satır Değiştirin

`src/Client.js` dosyasında constructor içinde:

```javascript
// Önceki satırı bul:
this.logger = this.options.logger || { /* ... */ };

// Bu şekilde değiştir:
this.logger = this.options.logger || require('./util/Logger');
```

---

## 📝 Log Dosyası Konumu

**Günlük Rotation:** Her gün yeni bir dosya otomatik oluşturulur 🗓️

```
your-project/
├── logs/
│   ├── whatsapp-client-2026-03-05.json  👈 Bugünün logları
│   ├── whatsapp-client-2026-03-04.json  👈 Dünün logları
│   └── whatsapp-client-2026-03-03.json  👈 Önceki günün logları
```

**Avantajlar:**
- ✅ Dosyalar şişmez (günlük ayrılır)
- ✅ JSON uzantısı (syntax highlighting)
- ✅ Eski loglar kolayca silinebilir
- ✅ Tarih bazlı analiz kolay

---

## 🧪 Test

```bash
# Bugünün log dosyasını izle
tail -f logs/whatsapp-client-$(date +%Y-%m-%d).json

# JSON formatında görüntüle
tail -f logs/whatsapp-client-$(date +%Y-%m-%d).json | jq .

# E2E notification loglarını filtrele
cat logs/whatsapp-client-$(date +%Y-%m-%d).json | grep "E2E" | jq .

# Son 100 log girişi
tail -n 100 logs/whatsapp-client-$(date +%Y-%m-%d).json | jq .

# Bugünün tüm error logları
cat logs/whatsapp-client-$(date +%Y-%m-%d).json | jq 'select(.level=="error")'

# 30 günden eski logları temizle
find logs/ -name "whatsapp-client-*.json" -mtime +30 -delete
```

---

## 🎯 Ne Loglanıyor?

- ✅ Browser console.log'ları
- ✅ E2E notification debug bilgileri
- ✅ Browser error'ları
- ✅ Page error'ları
- ✅ Tüm ✅ ve ⛔ işaretli mesajlar

---

## ⚙️ Özelleştirme

Kendi logger sisteminizi kullanmak isterseniz:

```javascript
const { Client } = require('whatsapp-web.js');
const myLogger = require('./my-logger');

const client = new Client({
    logger: myLogger  // Custom logger inject et
});
```

Logger interface:
```javascript
{
    info: (message, ...args) => void,
    warn: (message, ...args) => void,
    error: (message, ...args) => void,
    debug: (message, ...args) => void
}
```
