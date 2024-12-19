// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAAFS7-4b4jow4IRyVRzpIiSJf4SexGwvs",
    authDomain: "tpro-almohasib.firebaseapp.com",
    projectId: "tpro-almohasib",
    storageBucket: "tpro-almohasib.firebasestorage.app",
    messagingSenderId: "983397471575",
    appId: "1:983397471575:web:340adfeb88bff0c1dcda12",
    measurementId: "G-P7PM4E05H1"
};

// تهيئة Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// تهيئة Firestore
const db = firebase.firestore();

// دوال Firebase
(function() {
    // دالة التحقق من الأذونات
    async function checkAdminPermissions() {
        try {
            const adminRef = db.collection('admin').doc('credentials');
            const adminDoc = await adminRef.get();
            
            if (!adminDoc.exists) {
                throw new Error('لم يتم العثور على بيانات المسؤول');
            }
            
            const permissions = adminDoc.data().permissions || {};
            
            return {
                canUpdateVersion: permissions.canUpdateVersion || false,
                canChangePassword: permissions.canChangePassword || false
            };
        } catch (error) {
            console.error('خطأ في التحقق من الأذونات:', error);
            throw error;
        }
    }

    // دالة تحديث رقم الإصدار مع التحقق من الأذونات
    window.updateAppVersion = async function(versionData) {
        try {
            // التحقق من الأذونات
            const permissions = await checkAdminPermissions();
            
            if (!permissions.canUpdateVersion) {
                throw new Error('ليس لديك إذن لتحديث رقم الإصدار');
            }

            // التحقق من صحة المدخلات
            if (!versionData.currentVersion || !versionData.newVersion) {
                throw new Error('يجب إدخال رقم الإصدار الحالي والجديد');
            }

            // التحقق من صحة تنسيق رقم الإصدار
            const versionRegex = /^\d+\.\d+\.\d+$/;
            if (!versionRegex.test(versionData.newVersion)) {
                throw new Error('تنسيق رقم الإصدار غير صحيح. يجب أن يكون بالشكل X.Y.Z');
            }

            // تحديث رقم الإصدار في Firebase
            await db.collection('app_settings').doc('version').set(versionData, { merge: true });
            
            // تحديث رقم الإصدار في الصفحة الرئيسية
            await db.collection('app_settings').doc('index').set({ 
                version: versionData.newVersion 
            }, { merge: true });

            console.log("تم تحديث رقم الإصدار بنجاح");
            return true;
        } catch (error) {
            console.error("خطأ في تحديث رقم الإصدار:", error);
            throw error;
        }
    }

    // دالة تحديث كلمة مرور المسؤول مع التحقق من الأذونات
    window.updateAdminPassword = async function(currentPassword, newPassword) {
        try {
            // التحقق من الأذونات
            const permissions = await checkAdminPermissions();
            
            if (!permissions.canChangePassword) {
                throw new Error('ليس لديك إذن لتغيير كلمة المرور');
            }

            // التحقق من صحة المدخلات
            if (!currentPassword || !newPassword) {
                throw new Error('يجب إدخال كلمة المرور الحالية والجديدة');
            }

            if (newPassword.length < 8) {
                throw new Error('يجب أن تكون كلمة المرور على الأقل 8 أحرف');
            }

            // التحقق من كلمة المرور الحالية
            const adminRef = db.collection('admin').doc('credentials');
            const adminDoc = await adminRef.get();
            
            if (!adminDoc.exists) {
                throw new Error('لم يتم العثور على بيانات المسؤول');
            }
            
            const storedPassword = adminDoc.data().password;
            
            // التحقق من كلمة المرور الحالية
            if (currentPassword !== storedPassword) {
                throw new Error('كلمة المرور الحالية غير صحيحة');
            }
            
            // تحديث كلمة المرور
            await adminRef.update({
                password: newPassword,
                lastPasswordUpdate: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('تم تحديث كلمة المرور بنجاح');
            return true;
        } catch (error) {
            console.error('خطأ في تحديث كلمة المرور:', error);
            throw error;
        }
    }

    // دالة تسجيل دخول المسؤول
    window.adminLogin = async function(password) {
        try {
            // التحقق من صحة المدخلات
            if (!password) {
                throw new Error('يجب إدخال كلمة المرور');
            }

            // جلب بيانات المسؤول
            const adminRef = db.collection('admin').doc('credentials');
            const adminDoc = await adminRef.get();
            
            if (!adminDoc.exists) {
                throw new Error('لم يتم العثور على بيانات المسؤول');
            }
            
            const storedPassword = adminDoc.data().password;
            
            // التحقق من كلمة المرور
            if (password !== storedPassword) {
                throw new Error('كلمة المرور غير صحيحة');
            }

            // تسجيل وقت آخر تسجيل دخول
            await adminRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return true;
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            throw error;
        }
    }

    // دالة تسجيل العميل
    window.registerCustomer = async function(customerData) {
        try {
            const docRef = await db.collection('customers').add({
                ...customerData,
                registrationDate: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("تم تسجيل العميل بنجاح، ID:", docRef.id);
            return docRef.id;
        } catch (error) {
            console.error("خطأ في تسجيل العميل:", error);
            throw error;
        }
    }

    // دالة جلب قائمة العملاء
    window.getCustomers = async function() {
        try {
            const snapshot = await db.collection('customers').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("خطأ في جلب قائمة العملاء:", error);
            throw error;
        }
    }

    // دالة جلب رقم الإصدار الحالي
    window.getCurrentVersion = async function() {
        try {
            const doc = await db.collection('app_settings').doc('version').get();
            return doc.exists ? doc.data().newVersion : '1.0.0';
        } catch (error) {
            console.error("خطأ في جلب رقم الإصدار:", error);
            return '1.0.0';
        }
    }

    // دالة تحديث رقم الإصدار في الصفحة الرئيسية
    window.updateIndexVersion = async function(version) {
        try {
            const indexRef = db.collection('app_settings').doc('index');
            await indexRef.set({ version: version }, { merge: true });
            console.log("تم تحديث رقم الإصدار في الصفحة الرئيسية");
            return true;
        } catch (error) {
            console.error("خطأ في تحديث رقم الإصدار في الصفحة الرئيسية:", error);
            throw error;
        }
    }
})();
