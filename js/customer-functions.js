// تصدير إلى Excel
async function exportToExcel() {
    try {
        const customers = await getCustomers();
        const ws = XLSX.utils.json_to_sheet(customers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");
        XLSX.writeFile(wb, "customers.xlsx");
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        alert('حدث خطأ أثناء تصدير البيانات');
    }
}

// تصدير إلى PDF
async function exportToPDF() {
    try {
        const customers = await getCustomers();
        const doc = new jsPDF();
        
        // إعداد الخط العربي
        doc.addFont('assets/fonts/arial.ttf', 'arial', 'normal');
        doc.setFont('arial');
        
        // عنوان الملف
        doc.setFontSize(18);
        doc.text('قائمة العملاء', 200, 20, { align: 'right' });
        
        // إعداد البيانات للجدول
        const tableData = customers.map(customer => [
            customer.name,
            customer.companyName,
            customer.email,
            customer.phone,
            customer.version,
            new Date(customer.registrationDate.toDate()).toLocaleDateString('ar-SA')
        ]);
        
        // إنشاء الجدول
        doc.autoTable({
            head: [['الاسم', 'الشركة', 'البريد الإلكتروني', 'رقم الهاتف', 'النسخة', 'تاريخ التسجيل']],
            body: tableData,
            startY: 30,
            styles: { font: 'arial', halign: 'right' },
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        // حفظ الملف
        doc.save('customers.pdf');
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        alert('حدث خطأ أثناء تصدير البيانات');
    }
}

// طباعة القائمة
function printList() {
    window.print();
}

// إرسال بريد إلكتروني للعميل
async function sendEmailToCustomer(customerEmail, subject, message) {
    try {
        const templateParams = {
            to_email: customerEmail,
            subject: subject,
            message: message
        };
        
        await emailjs.send('service_id', 'template_id', templateParams);
        alert('تم إرسال البريد الإلكتروني بنجاح');
    } catch (error) {
        console.error('خطأ في إرسال البريد الإلكتروني:', error);
        alert('حدث خطأ أثناء إرسال البريد الإلكتروني');
    }
}

// إضافة مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // أزرار التصدير
    document.getElementById('exportExcel').addEventListener('click', exportToExcel);
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
    document.getElementById('printList').addEventListener('click', printList);
});
