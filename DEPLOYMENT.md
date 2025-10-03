# دليل نشر تطبيق فكّر على fakker.net

## المتطلبات الأساسية

1. خادم يعمل بنظام Ubuntu 20.04 أو أحدث
2. Node.js v16 أو أحدث
3. Nginx
4. SSL certificate (Let's Encrypt)
5. PM2 لإدارة العمليات

## خطوات النشر

### 1. إعداد الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت Nginx
sudo apt install -y nginx

# تثبيت Certbot للحصول على شهادة SSL
sudo apt install -y certbot python3-certbot-nginx

# تثبيت PM2
sudo npm install -g pm2
```

### 2. إعداد SSL

```bash
# الحصول على شهادة SSL
sudo certbot --nginx -d fakker.net -d www.fakker.net
```

### 3. بناء التطبيق

```bash
# تثبيت الاعتماديات
npm install

# بناء نسخة الويب
expo build:web

# بناء لوحة التحكم
cd admin && npm install && npm run build
```

### 4. نقل الملفات إلى الخادم

```bash
# إنشاء المجلدات اللازمة
sudo mkdir -p /var/www/fakker
sudo chown -R $USER:$USER /var/www/fakker

# نقل ملفات التطبيق
scp -r web-build/* user@fakker.net:/var/www/fakker/
scp -r admin/build/* user@fakker.net:/var/www/fakker/admin/
```

### 5. إعداد Nginx

```bash
# نسخ ملف الإعدادات
sudo cp nginx.conf /etc/nginx/sites-available/fakker.net

# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/fakker.net /etc/nginx/sites-enabled/

# اختبار الإعدادات
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

### 6. تشغيل خدمة API

```bash
# تثبيت اعتماديات API
cd api && npm install

# بدء الخدمة باستخدام PM2
pm2 start ecosystem.config.js
pm2 save
```

### 7. إعداد Firewall

```bash
# فتح المنافذ المطلوبة
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## التحقق من النشر

1. تأكد من أن الموقع يعمل على https://www.fakker.net
2. تأكد من أن لوحة التحكم تعمل على https://www.fakker.net/admin
3. تأكد من أن API يعمل على https://www.fakker.net/api
4. تأكد من أن WebSocket يعمل على wss://www.fakker.net/ws

## تحديث التطبيق

لتحديث التطبيق في المستقبل:

```bash
# بناء نسخة جديدة
npm run build

# نقل الملفات الجديدة
scp -r web-build/* user@fakker.net:/var/www/fakker/

# تنظيف ذاكرة التخزين المؤقت
sudo nginx -s reload
```

## النسخ الاحتياطي

قم بإعداد نسخ احتياطي يومي:

```bash
# إنشاء سكربت النسخ الاحتياطي
sudo nano /etc/cron.daily/fakker-backup

# محتوى السكربت
#!/bin/bash
BACKUP_DIR="/backup/fakker"
DATE=$(date +%Y%m%d)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/fakker-$DATE.tar.gz /var/www/fakker
find $BACKUP_DIR -type f -mtime +7 -delete
```

## المراقبة

1. استخدم PM2 لمراقبة حالة API:
   ```bash
   pm2 monit
   ```

2. راقب سجلات Nginx:
   ```bash
   tail -f /var/log/nginx/access.log
   tail -f /var/log/nginx/error.log
   ```

## الدعم

إذا واجهت أي مشاكل، يمكنك:
1. مراجعة السجلات في `/var/log/nginx/`
2. التحقق من حالة الخدمات باستخدام `systemctl status nginx`
3. مراجعة سجلات PM2 باستخدام `pm2 logs`
