// تصدير إلى Excel
async function exportToExcel() {
    try {
        const customers = await getCustomers();
        
        // تحويل البيانات إلى تنسيق مناسب للتصدير
        const formattedCustomers = customers.map(customer => {
            return {
                'اسم العميل': customer.name,
                'اسم الشركة': customer.companyName || '-',
                'البريد الإلكتروني': customer.email,
                'رقم الهاتف': customer.phone,
                'النسخة': getVersionName(customer.version),
                'الحالة': customer.status || 'غير نشط',
                'تاريخ التسجيل': customer.registrationDate ? new Date(customer.registrationDate.toDate()).toLocaleDateString('ar-SA') : '-',
                'العنوان': customer.address || '-',
                'ملاحظات': customer.notes || '-'
            };
        });
        
        const ws = XLSX.utils.json_to_sheet(formattedCustomers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");
        XLSX.writeFile(wb, "customers.xlsx");
        
        showAlert('تم تصدير البيانات إلى Excel بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        showAlert('حدث خطأ أثناء تصدير البيانات: ' + error.message, 'danger');
    }
}

// تصدير إلى PDF
async function exportToPDF() {
    try {
        const customers = await getCustomers();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // إعداد الخط العربي (إذا كان متاحًا)
        try {
            doc.addFont('assets/fonts/arial.ttf', 'arial', 'normal');
            doc.setFont('arial');
        } catch (e) {
            console.warn('لم يتم العثور على الخط العربي، سيتم استخدام الخط الافتراضي');
        }
        
        // عنوان الملف
        doc.setFontSize(18);
        doc.text('قائمة العملاء', 200, 20, { align: 'right' });
        
        // إعداد البيانات للجدول
        const tableData = customers.map(customer => [
            customer.name,
            customer.companyName || '-',
            customer.email,
            customer.phone,
            getVersionName(customer.version),
            customer.status || 'غير نشط',
            customer.registrationDate ? new Date(customer.registrationDate.toDate()).toLocaleDateString('ar-SA') : '-'
        ]);
        
        // إنشاء الجدول
        doc.autoTable({
            head: [['الاسم', 'الشركة', 'البريد الإلكتروني', 'رقم الهاتف', 'النسخة', 'الحالة', 'تاريخ التسجيل']],
            body: tableData,
            startY: 30,
            styles: { halign: 'right' },
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        // حفظ الملف
        doc.save('customers.pdf');
        
        showAlert('تم تصدير البيانات إلى PDF بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        showAlert('حدث خطأ أثناء تصدير البيانات: ' + error.message, 'danger');
    }
}

// طباعة القائمة
function printList() {
    window.print();
}

// إرسال بريد إلكتروني للعميل
async function sendEmailToCustomer(customerEmail, subject, message) {
    try {
        // فتح تطبيق البريد الإلكتروني الافتراضي
        const encodedSubject = encodeURIComponent(subject);
        const encodedMessage = encodeURIComponent(message);
        window.open(`mailto:${customerEmail}?subject=${encodedSubject}&body=${encodedMessage}`, '_blank');
        
        // يمكن استخدام خدمة مثل EmailJS للإرسال المباشر
        // await emailjs.send('service_id', 'template_id', { to_email: customerEmail, subject, message });
        
        return true;
    } catch (error) {
        console.error('خطأ في إرسال البريد الإلكتروني:', error);
        showAlert('حدث خطأ أثناء إرسال البريد الإلكتروني: ' + error.message, 'danger');
        return false;
    }
}

// الحصول على عميل بواسطة المعرف
async function getCustomerById(customerId) {
    try {
        const doc = await firebase.firestore().collection('customers').doc(customerId).get();
        if (!doc.exists) {
            return null;
        }
        const customer = doc.data();
        customer.id = doc.id;
        return customer;
    } catch (error) {
        console.error('خطأ في الحصول على بيانات العميل:', error);
        throw error;
    }
}

// تحديث بيانات العميل
async function updateCustomer(customerId, updatedData) {
    try {
        // التحقق من صحة البيانات
        if (!validateCustomerData(updatedData)) {
            throw new Error('البيانات غير صالحة');
        }
        
        // تحديث البيانات في قاعدة البيانات
        await firebase.firestore().collection('customers').doc(customerId).update({
            ...updatedData,
            lastUpdated: firebase.firestore.Timestamp.now()
        });
        
        return true;
    } catch (error) {
        console.error('خطأ في تحديث بيانات العميل:', error);
        throw error;
    }
}

// تغيير حالة العميل
async function changeCustomerStatus(customerId, newStatus) {
    try {
        await firebase.firestore().collection('customers').doc(customerId).update({
            status: newStatus,
            lastUpdated: firebase.firestore.Timestamp.now()
        });
        
        return true;
    } catch (error) {
        console.error('خطأ في تغيير حالة العميل:', error);
        throw error;
    }
}

// تصفية العملاء حسب معايير محددة
async function filterCustomers(criteria) {
    try {
        let query = firebase.firestore().collection('customers');
        
        // تطبيق معايير التصفية
        if (criteria.status) {
            query = query.where('status', '==', criteria.status);
        }
        
        if (criteria.version) {
            query = query.where('version', '==', criteria.version);
        }
        
        if (criteria.dateFrom && criteria.dateTo) {
            const dateFrom = new Date(criteria.dateFrom);
            const dateTo = new Date(criteria.dateTo);
            dateTo.setHours(23, 59, 59, 999); // نهاية اليوم
            
            query = query.where('registrationDate', '>=', firebase.firestore.Timestamp.fromDate(dateFrom))
                         .where('registrationDate', '<=', firebase.firestore.Timestamp.fromDate(dateTo));
        }
        
        const snapshot = await query.get();
        const customers = [];
        
        snapshot.forEach(doc => {
            const customer = doc.data();
            customer.id = doc.id;
            customers.push(customer);
        });
        
        return customers;
    } catch (error) {
        console.error('خطأ في تصفية العملاء:', error);
        throw error;
    }
}

// البحث عن العملاء
async function searchCustomers(searchTerm) {
    try {
        if (!searchTerm || searchTerm.trim() === '') {
            return await getCustomers();
        }
        
        const snapshot = await firebase.firestore().collection('customers').get();
        const customers = [];
        const searchTermLower = searchTerm.toLowerCase();
        
        snapshot.forEach(doc => {
            const customer = doc.data();
            customer.id = doc.id;
            
            // البحث في الحقول المختلفة
            if (
                (customer.name && customer.name.toLowerCase().includes(searchTermLower)) ||
                (customer.companyName && customer.companyName.toLowerCase().includes(searchTermLower)) ||
                (customer.email && customer.email.toLowerCase().includes(searchTermLower)) ||
                (customer.phone && customer.phone.includes(searchTerm)) ||
                (customer.notes && customer.notes.toLowerCase().includes(searchTermLower))
            ) {
                customers.push(customer);
            }
        });
        
        return customers;
    } catch (error) {
        console.error('خطأ في البحث عن العملاء:', error);
        throw error;
    }
}

// إضافة مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // أزرار التصدير
    const exportExcelBtn = document.getElementById('exportExcel');
    const exportPDFBtn = document.getElementById('exportPDF');
    const printListBtn = document.getElementById('printList');
    const searchInput = document.getElementById('searchCustomers');
    
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportToExcel);
    if (exportPDFBtn) exportPDFBtn.addEventListener('click', exportToPDF);
    if (printListBtn) printListBtn.addEventListener('click', printList);
    
    // البحث في العملاء
    if (searchInput) {
        searchInput.addEventListener('input', debounce(async function() {
            const searchTerm = this.value;
            try {
                showLoading(true);
                const customers = await searchCustomers(searchTerm);
                renderCustomers(customers);
            } catch (error) {
                console.error('خطأ في البحث:', error);
                showAlert('حدث خطأ أثناء البحث: ' + error.message, 'danger');
            } finally {
                showLoading(false);
            }
        }, 500));
    }
    
    // تصفية العملاء
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const status = document.getElementById('filterStatus').value;
            const version = document.getElementById('filterVersion').value;
            const dateFrom = document.getElementById('filterDateFrom').value;
            const dateTo = document.getElementById('filterDateTo').value;
            
            try {
                showLoading(true);
                const customers = await filterCustomers({ status, version, dateFrom, dateTo });
                renderCustomers(customers);
                showAlert(`تم العثور على ${customers.length} عميل`, 'info');
            } catch (error) {
                console.error('خطأ في تصفية العملاء:', error);
                showAlert('حدث خطأ أثناء تصفية العملاء: ' + error.message, 'danger');
            } finally {
                showLoading(false);
            }
        });
    }
});

// عرض قائمة العملاء
function renderCustomers(customers) {
    const tbody = document.getElementById('customersList');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (customers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" class="text-center">لا يوجد عملاء مطابقين للبحث</td>`;
        tbody.appendChild(row);
        return;
    }
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.dataset.customerId = customer.id;
        
        // تحديد لون الصف بناءً على حالة العميل
        if (customer.status === 'غير نشط') {
            row.classList.add('table-secondary');
        }
        
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.companyName || '-'}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${getVersionName(customer.version) || '-'}</td>
            <td><span class="badge ${customer.status === 'نشط' ? 'bg-success' : 'bg-secondary'}">${customer.status || 'غير نشط'}</span></td>
            <td>${customer.registrationDate ? (customer.registrationDate.toDate ? customer.registrationDate.toDate().toLocaleDateString() : new Date(customer.registrationDate).toLocaleDateString()) : 'غير محدد'}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary edit-customer" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-customer" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm ${customer.status === 'نشط' ? 'btn-warning' : 'btn-success'} toggle-status" title="${customer.status === 'نشط' ? 'تعطيل' : 'تفعيل'}">
                        <i class="fas ${customer.status === 'نشط' ? 'fa-ban' : 'fa-check'}"></i>
                    </button>
                    <button class="btn btn-sm btn-info send-email" title="إرسال بريد إلكتروني">
                        <i class="fas fa-envelope"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
        
        // إضافة مستمعي الأحداث للأزرار
        const editBtn = row.querySelector('.edit-customer');
        const deleteBtn = row.querySelector('.delete-customer');
        const toggleStatusBtn = row.querySelector('.toggle-status');
        const sendEmailBtn = row.querySelector('.send-email');
        
        editBtn.addEventListener('click', () => editCustomer(customer.id));
        deleteBtn.addEventListener('click', () => confirmDeleteCustomer(customer.id, customer.name));
        toggleStatusBtn.addEventListener('click', () => toggleCustomerStatus(customer.id, customer.status));
        sendEmailBtn.addEventListener('click', () => sendEmail(customer.email, customer.name));
    });
}

// وظيفة debounce للبحث
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}
