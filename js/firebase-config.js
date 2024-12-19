// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAAFS7-4b4jow4IRyVRzpIiSJf4SexGwvs",
    authDomain: "tpro-almohasib.firebaseapp.com",
    projectId: "tpro-almohasib",
    storageBucket: "tpro-almohasib.appspot.com",
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
function adminLogin(password) {
    return new Promise(async (resolve, reject) => {
        try {
            // التحقق من صحة المدخلات
            if (!password) {
                reject(new Error('يجب إدخال كلمة المرور'));
                return;
            }

            // جلب بيانات المسؤول
            const adminRef = db.collection('admin').doc('credentials');
            const adminDoc = await adminRef.get();
            
            if (!adminDoc.exists) {
                reject(new Error('لم يتم العثور على بيانات المسؤول'));
                return;
            }
            
            const storedPassword = adminDoc.data().password;
            
            // التحقق من كلمة المرور
            if (password !== storedPassword) {
                reject(new Error('كلمة المرور غير صحيحة'));
                return;
            }

            // تسجيل وقت آخر تسجيل دخول
            await adminRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            resolve(true);
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            reject(error);
        }
    });
}

function updateAdminPassword(currentPassword, newPassword) {
    return new Promise(async (resolve, reject) => {
        try {
            // التحقق من صحة المدخلات
            if (!currentPassword || !newPassword) {
                reject(new Error('يجب إدخال كلمة المرور الحالية والجديدة'));
                return;
            }

            if (newPassword.length < 8) {
                reject(new Error('يجب أن تكون كلمة المرور على الأقل 8 أحرف'));
                return;
            }

            // التحقق من كلمة المرور الحالية
            const adminRef = db.collection('admin').doc('credentials');
            const adminDoc = await adminRef.get();
            
            if (!adminDoc.exists) {
                reject(new Error('لم يتم العثور على بيانات المسؤول'));
                return;
            }
            
            const storedPassword = adminDoc.data().password;
            
            // التحقق من كلمة المرور الحالية
            if (currentPassword !== storedPassword) {
                reject(new Error('كلمة المرور الحالية غير صحيحة'));
                return;
            }
            
            // تحديث كلمة المرور
            await adminRef.update({
                password: newPassword,
                lastPasswordUpdate: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            resolve(true);
        } catch (error) {
            console.error('خطأ في تحديث كلمة المرور:', error);
            reject(error);
        }
    });
}

function updateAppVersion(versionData) {
    return new Promise(async (resolve, reject) => {
        try {
            // التحقق من صحة المدخلات
            if (!versionData.currentVersion || !versionData.newVersion) {
                reject(new Error('يجب إدخال رقم الإصدار الحالي والجديد'));
                return;
            }

            // التحقق من صحة تنسيق رقم الإصدار
            const versionRegex = /^\d+\.\d+\.\d+$/;
            if (!versionRegex.test(versionData.newVersion)) {
                reject(new Error('تنسيق رقم الإصدار غير صحيح. يجب أن يكون بالشكل X.Y.Z'));
                return;
            }

            // تحديث رقم الإصدار في Firebase
            await db.collection('app_settings').doc('version').set(versionData, { merge: true });
            
            // تحديث رقم الإصدار في الصفحة الرئيسية
            await db.collection('app_settings').doc('index').set({ 
                version: versionData.newVersion 
            }, { merge: true });

            resolve(true);
        } catch (error) {
            console.error("خطأ في تحديث رقم الإصدار:", error);
            reject(error);
        }
    });
}

function getCurrentVersion() {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = await db.collection('app_settings').doc('version').get();
            resolve(doc.exists ? doc.data().newVersion : '1.0.0');
        } catch (error) {
            console.error("خطأ في جلب رقم الإصدار:", error);
            resolve('1.0.0');
        }
    });
}

// تعريف الدوال في النافذة
window.adminLogin = adminLogin;
window.updateAdminPassword = updateAdminPassword;
window.updateAppVersion = updateAppVersion;
window.getCurrentVersion = getCurrentVersion;
