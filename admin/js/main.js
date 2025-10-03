import { API_CONFIG, REPORT_TYPES } from '../../config/constants.js';

class ReportsManager {
    constructor() {
        this.reports = [];
        this.selectedReport = null;
        this.filters = {
            status: 'all',
            type: 'all'
        };
        this.setupEventListeners();
        this.initializeWebSocket();
    }

    setupEventListeners() {
        // تحديث الفلاتر
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.renderReports();
        });

        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filters.type = e.target.value;
            this.renderReports();
        });

        // تحديث البلاغات
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.fetchReports();
        });

        // التعامل مع النافذة المنبثقة
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.closeResponseModal();
        });

        document.getElementById('cancelResponse').addEventListener('click', () => {
            this.closeResponseModal();
        });

        document.getElementById('submitResponse').addEventListener('click', () => {
            this.submitResponse();
        });
    }

    initializeWebSocket() {
        this.ws = new WebSocket('wss://www.fakker.net/ws/reports');
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'new_report') {
                this.handleNewReport(data.report);
            }
        };

        this.ws.onclose = () => {
            // إعادة الاتصال بعد 5 ثواني
            setTimeout(() => this.initializeWebSocket(), 5000);
        };
    }

    async fetchReports() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/reports`);
            if (!response.ok) throw new Error('فشل جلب البلاغات');
            
            this.reports = await response.json();
            this.renderReports();
        } catch (error) {
            console.error('Error fetching reports:', error);
            this.showError('حدث خطأ أثناء جلب البلاغات');
        }
    }

    handleNewReport(report) {
        this.reports.unshift(report);
        this.updateNewReportsCount();
        this.renderReports();
        this.showNotification('بلاغ جديد', `تم استلام بلاغ جديد: ${report.question.substring(0, 50)}...`);
    }

    renderReports() {
        const reportsList = document.getElementById('reportsList');
        const filteredReports = this.filterReports();

        reportsList.innerHTML = filteredReports.map(report => `
            <div class="report-card ${this.selectedReport?.id === report.id ? 'selected' : ''}"
                 onclick="reportsManager.selectReport('${report.id}')">
                <div class="report-header">
                    <span class="report-type">${REPORT_TYPES[report.reportType].label}</span>
                    <span class="report-status status-${report.status}">${this.getStatusLabel(report.status)}</span>
                </div>
                <div class="report-question">${report.question}</div>
                <div class="report-details">${report.details || 'لا توجد تفاصيل إضافية'}</div>
                <div class="report-meta">
                    <span>${new Date(report.timestamp).toLocaleDateString('ar-SA')}</span>
                    <span>${report.category}</span>
                </div>
            </div>
        `).join('');
    }

    filterReports() {
        return this.reports.filter(report => {
            if (this.filters.status !== 'all' && report.status !== this.filters.status) return false;
            if (this.filters.type !== 'all' && report.reportType !== this.filters.type) return false;
            return true;
        });
    }

    selectReport(reportId) {
        this.selectedReport = this.reports.find(r => r.id === reportId);
        this.renderReports();
        this.renderReportDetails();
    }

    renderReportDetails() {
        const detailsContainer = document.getElementById('reportDetails');
        if (!this.selectedReport) {
            detailsContainer.innerHTML = `
                <div class="no-selection">
                    <i class="mdi mdi-flag-outline"></i>
                    <p>اختر بلاغاً لعرض تفاصيله</p>
                </div>
            `;
            return;
        }

        detailsContainer.innerHTML = `
            <div class="report-full-details">
                <h3>تفاصيل البلاغ</h3>
                <div class="detail-group">
                    <label>السؤال:</label>
                    <p>${this.selectedReport.question}</p>
                </div>
                <div class="detail-group">
                    <label>نوع المشكلة:</label>
                    <p>${REPORT_TYPES[this.selectedReport.reportType].label}</p>
                </div>
                <div class="detail-group">
                    <label>الفئة:</label>
                    <p>${this.selectedReport.category}</p>
                </div>
                <div class="detail-group">
                    <label>مستوى الصعوبة:</label>
                    <p>${this.selectedReport.difficulty}</p>
                </div>
                <div class="detail-group">
                    <label>التفاصيل:</label>
                    <p>${this.selectedReport.details || 'لا توجد تفاصيل إضافية'}</p>
                </div>
                <div class="detail-group">
                    <label>معلومات الجهاز:</label>
                    <p>النظام: ${this.selectedReport.deviceInfo.platform}</p>
                    <p>الإصدار: ${this.selectedReport.deviceInfo.version}</p>
                </div>
                <div class="detail-group">
                    <label>تاريخ البلاغ:</label>
                    <p>${new Date(this.selectedReport.timestamp).toLocaleString('ar-SA')}</p>
                </div>
                
                <button class="btn btn-primary" onclick="reportsManager.showResponseModal()">
                    <i class="mdi mdi-reply"></i>
                    الرد على البلاغ
                </button>
            </div>
        `;
    }

    showResponseModal() {
        const modal = document.getElementById('responseModal');
        modal.classList.add('active');
    }

    closeResponseModal() {
        const modal = document.getElementById('responseModal');
        modal.classList.remove('active');
    }

    async submitResponse() {
        if (!this.selectedReport) return;

        const status = document.getElementById('reportStatus').value;
        const response = document.getElementById('responseText').value;

        try {
            const result = await fetch(`${API_CONFIG.BASE_URL}/reports/${this.selectedReport.id}/response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    response,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!result.ok) throw new Error('فشل إرسال الرد');

            this.selectedReport.status = status;
            this.selectedReport.response = response;
            this.renderReports();
            this.renderReportDetails();
            this.closeResponseModal();
            this.showSuccess('تم إرسال الرد بنجاح');
        } catch (error) {
            console.error('Error submitting response:', error);
            this.showError('حدث خطأ أثناء إرسال الرد');
        }
    }

    updateNewReportsCount() {
        const count = this.reports.filter(r => r.status === 'new').length;
        const badge = document.getElementById('newReportsCount');
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    getStatusLabel(status) {
        const labels = {
            new: 'جديد',
            inProgress: 'قيد المراجعة',
            resolved: 'تم الحل',
            rejected: 'مرفوض'
        };
        return labels[status] || status;
    }

    showNotification(title, body) {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            });
        }
    }

    showSuccess(message) {
        // يمكن استخدام مكتبة للإشعارات مثل toastr
        alert(message);
    }

    showError(message) {
        // يمكن استخدام مكتبة للإشعارات مثل toastr
        alert(`خطأ: ${message}`);
    }
}

// تهيئة مدير البلاغات
window.reportsManager = new ReportsManager();
document.addEventListener('DOMContentLoaded', () => {
    window.reportsManager.fetchReports();
});
