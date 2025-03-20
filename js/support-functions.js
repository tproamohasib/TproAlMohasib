/**
 * وظائف إدارة طلبات الدعم الفني
 */

// جلب جميع طلبات الدعم الفني
async function getSupportRequests() {
    try {
        const supportRef = firebase.firestore().collection('support');
        const snapshot = await supportRef.orderBy('date', 'desc').get();
        return snapshot;
    } catch (error) {
        console.error("خطأ في جلب طلبات الدعم:", error);
        throw error;
    }
}

// جلب طلب دعم فني محدد
async function getSupportRequestById(requestId) {
    try {
        const supportRef = firebase.firestore().collection('support').doc(requestId);
        const doc = await supportRef.get();
        
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            throw new Error("لم يتم العثور على طلب الدعم");
        }
    } catch (error) {
        console.error("خطأ في جلب طلب الدعم:", error);
        throw error;
    }
}

// تحديث حالة طلب الدعم الفني
async function updateSupportRequestStatus(requestId, newStatus) {
    try {
        const supportRef = firebase.firestore().collection('support').doc(requestId);
        await supportRef.update({
            status: newStatus,
            lastUpdated: firebase.firestore.Timestamp.now()
        });
        return true;
    } catch (error) {
        console.error("خطأ في تحديث حالة طلب الدعم:", error);
        throw error;
    }
}

// إضافة رد على طلب الدعم الفني
async function addSupportReply(requestId, replyText) {
    try {
        const supportRef = firebase.firestore().collection('support').doc(requestId);
        const doc = await supportRef.get();
        
        if (!doc.exists) {
            throw new Error("لم يتم العثور على طلب الدعم");
        }
        
        // إنشاء مجموعة الردود إذا لم تكن موجودة
        let replies = doc.data().replies || [];
        
        // إضافة الرد الجديد
        replies.push({
            text: replyText,
            date: firebase.firestore.Timestamp.now(),
            isAdmin: true
        });
        
        // تحديث الطلب بالرد الجديد وتغيير الحالة إلى "تم الرد"
        await supportRef.update({
            replies: replies,
            status: 'تم الرد',
            lastUpdated: firebase.firestore.Timestamp.now()
        });
        
        return true;
    } catch (error) {
        console.error("خطأ في إضافة رد على طلب الدعم:", error);
        throw error;
    }
}

// حذف طلب دعم فني
async function deleteSupportRequest(requestId) {
    try {
        const supportRef = firebase.firestore().collection('support').doc(requestId);
        await supportRef.delete();
        return true;
    } catch (error) {
        console.error("خطأ في حذف طلب الدعم:", error);
        throw error;
    }
}

// الحصول على إحصائيات طلبات الدعم الفني
async function getSupportStats() {
    try {
        const supportRef = firebase.firestore().collection('support');
        const snapshot = await supportRef.get();
        
        let stats = {
            total: snapshot.size,
            new: 0,
            inProgress: 0,
            replied: 0,
            closed: 0
        };
        
        snapshot.forEach(doc => {
            const status = doc.data().status;
            
            if (status === 'جديد') {
                stats.new++;
            } else if (status === 'قيد المعالجة') {
                stats.inProgress++;
            } else if (status === 'تم الرد') {
                stats.replied++;
            } else if (status === 'مغلق') {
                stats.closed++;
            }
        });
        
        return stats;
    } catch (error) {
        console.error("خطأ في جلب إحصائيات طلبات الدعم:", error);
        throw error;
    }
}

// تصدير طلبات الدعم الفني إلى ملف Excel
function exportSupportToExcel(supportRequests) {
    try {
        // تحويل بيانات الطلبات إلى تنسيق مناسب للتصدير
        const data = [];
        
        // إضافة رأس الجدول
        data.push([
            'رقم الطلب',
            'الاسم',
            'البريد الإلكتروني',
            'الموضوع',
            'الرسالة',
            'التاريخ',
            'الحالة'
        ]);
        
        // إضافة بيانات الطلبات
        supportRequests.forEach(request => {
            const requestData = request.data();
            data.push([
                request.id,
                requestData.name,
                requestData.email,
                requestData.subject,
                requestData.message,
                new Date(requestData.date.toDate()).toLocaleString('ar-SA'),
                requestData.status
            ]);
        });
        
        // إنشاء مصنف Excel
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'طلبات الدعم');
        
        // تصدير الملف
        XLSX.writeFile(wb, 'طلبات_الدعم_الفني.xlsx');
        
        return true;
    } catch (error) {
        console.error("خطأ في تصدير طلبات الدعم إلى Excel:", error);
        throw error;
    }
}

// إرسال بريد إلكتروني للعميل بخصوص طلب الدعم
async function sendSupportEmail(email, name, subject, message) {
    try {
        // يمكن استخدام خدمة EmailJS أو أي خدمة أخرى لإرسال البريد الإلكتروني
        /* 
        await emailjs.send(
            'service_id',
            'template_id',
            {
                to_email: email,
                to_name: name,
                subject: subject,
                message: message
            },
            'user_id'
        );
        */
        
        // محاكاة إرسال البريد الإلكتروني (للتجربة فقط)
        console.log(`تم إرسال بريد إلكتروني إلى ${name} (${email}) بخصوص: ${subject}`);
        return true;
    } catch (error) {
        console.error("خطأ في إرسال البريد الإلكتروني:", error);
        throw error;
    }
}

// تنسيق تاريخ طلب الدعم
function formatSupportDate(timestamp) {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    return new Date(date).toLocaleString('ar-SA');
}
