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
    // دالة تحديث كلمة مرور المسؤول
    window.updateAdminPassword = async function(currentPassword, newPassword) {
        try {
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

    // دالة تحديث رقم الإصدار
    window.updateAppVersion = async function(versionData) {
        try {
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
})();
