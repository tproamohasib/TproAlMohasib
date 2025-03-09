/**
 * ملف إدارة العملاء
 * يحتوي على الوظائف المتعلقة بإدارة العملاء (إضافة، تعديل، حذف، استرجاع)
 */

// إضافة عميل جديد إلى Firebase
/**
 * إضافة عميل جديد إلى قاعدة بيانات Firebase
 * @param {Object} customerData - بيانات العميل
 * @returns {Promise<string>} - معرف العميل الجديد
 */
async function registerCustomer(customerData) {
    try {
        // التحقق من صحة البيانات
        if (!validateCustomerData(customerData)) {
            throw new Error("بيانات العميل غير صالحة");
        }

        // إضافة تاريخ التسجيل
        customerData.registrationDate = firebase.firestore.Timestamp.now();
        
        // إضافة حالة العميل (نشط افتراضيًا)
        if (!customerData.status) {
            customerData.status = "نشط";
        }

        // إضافة العميل إلى Firestore
        const customersRef = firebase.firestore().collection('customers');
        const docRef = await customersRef.add(customerData);
        
        console.log("تمت إضافة العميل بنجاح مع المعرف:", docRef.id);
        
        // إرسال إشعار بالتسجيل الناجح (يمكن تنفيذه لاحقًا)
        // await sendRegistrationNotification(customerData);
        
        return docRef.id;
    } catch (error) {
        console.error("خطأ في تسجيل العميل:", error);
        throw error;
    }
}

/**
 * التحقق من صحة بيانات العميل
 * @param {Object} customerData - بيانات العميل
 * @returns {boolean} - صحة البيانات
 */
function validateCustomerData(customerData) {
    // التحقق من وجود الحقول الإلزامية
    if (!customerData.name || !customerData.email || !customerData.phone) {
        console.error("الحقول الإلزامية مفقودة");
        return false;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
        console.error("البريد الإلكتروني غير صالح");
        return false;
    }
    
    // التحقق من صحة رقم الهاتف (يجب أن يحتوي على أرقام فقط)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(customerData.phone)) {
        console.error("رقم الهاتف غير صالح");
        return false;
    }
    
    return true;
}

/**
 * الحصول على قائمة العملاء من Firebase
 * @returns {Promise<Array>} - قائمة العملاء
 */
async function getCustomers() {
    try {
        const customersRef = firebase.firestore().collection('customers');
        const snapshot = await customersRef.get();
        
        if (snapshot.empty) {
            console.log("لا يوجد عملاء");
            return [];
        }
        
        const customers = [];
        snapshot.forEach(doc => {
            customers.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return customers;
    } catch (error) {
        console.error("خطأ في جلب بيانات العملاء:", error);
        throw error;
    }
}

/**
 * الحصول على بيانات عميل محدد
 * @param {string} customerId - معرف العميل
 * @returns {Promise<Object>} - بيانات العميل
 */
async function getCustomerById(customerId) {
    try {
        const customerRef = firebase.firestore().collection('customers').doc(customerId);
        const doc = await customerRef.get();
        
        if (!doc.exists) {
            console.log("العميل غير موجود");
            return null;
        }
        
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error("خطأ في جلب بيانات العميل:", error);
        throw error;
    }
}

/**
 * تحديث بيانات عميل
 * @param {string} customerId - معرف العميل
 * @param {Object} customerData - بيانات العميل المحدثة
 * @returns {Promise<void>}
 */
async function updateCustomer(customerId, customerData) {
    try {
        // التحقق من صحة البيانات
        if (!validateCustomerData(customerData)) {
            throw new Error("بيانات العميل غير صالحة");
        }
        
        // تحديث بيانات العميل
        const customerRef = firebase.firestore().collection('customers').doc(customerId);
        
        // إضافة تاريخ التحديث
        customerData.lastUpdated = firebase.firestore.Timestamp.now();
        
        await customerRef.update(customerData);
        console.log("تم تحديث بيانات العميل بنجاح");
    } catch (error) {
        console.error("خطأ في تحديث بيانات العميل:", error);
        throw error;
    }
}

/**
 * حذف عميل
 * @param {string} customerId - معرف العميل
 * @returns {Promise<void>}
 */
async function deleteCustomer(customerId) {
    try {
        const customerRef = firebase.firestore().collection('customers').doc(customerId);
        await customerRef.delete();
        console.log("تم حذف العميل بنجاح");
    } catch (error) {
        console.error("خطأ في حذف العميل:", error);
        throw error;
    }
}

/**
 * تغيير حالة العميل (نشط/غير نشط)
 * @param {string} customerId - معرف العميل
 * @param {string} status - الحالة الجديدة
 * @returns {Promise<void>}
 */
async function changeCustomerStatus(customerId, status) {
    try {
        const customerRef = firebase.firestore().collection('customers').doc(customerId);
        await customerRef.update({
            status: status,
            lastUpdated: firebase.firestore.Timestamp.now()
        });
        console.log(`تم تغيير حالة العميل إلى: ${status}`);
    } catch (error) {
        console.error("خطأ في تغيير حالة العميل:", error);
        throw error;
    }
}
