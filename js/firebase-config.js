// تهيئة Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAAFS7-4b4jow4IRyVRzpIiSJf4SexGwvs",
    authDomain: "tpro-almohasib.firebaseapp.com",
    projectId: "tpro-almohasib",
    storageBucket: "tpro-almohasib.appspot.com",
    messagingSenderId: "983397471575",
    appId: "1:983397471575:web:340adfeb88bff0c1dcda12",
    measurementId: "G-P7PM4E05H1"
};

// تهيئة Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    console.log("تم تهيئة Firebase بنجاح");
} catch (error) {
    console.error("خطأ في تهيئة Firebase:", error);
}

// تهيئة Firestore
var db;
try {
    db = firebase.firestore();
    console.log("تم تهيئة Firestore بنجاح");
} catch (error) {
    console.error("خطأ في تهيئة Firestore:", error);
}

// دالة تسجيل دخول المسؤول
function adminLogin(password) {
    return new Promise(function(resolve, reject) {
        try {
            // التحقق من صحة المدخلات
            if (!password) {
                reject(new Error('يجب إدخال كلمة المرور'));
                return;
            }

            console.log("جاري التحقق من كلمة المرور...");
            
            // جلب بيانات المسؤول
            var adminRef = db.collection('admin').doc('credentials');
            adminRef.get().then(function(adminDoc) {
                if (!adminDoc.exists) {
                    console.error("لم يتم العثور على وثيقة بيانات المسؤول");
                    reject(new Error('لم يتم العثور على بيانات المسؤول'));
                    return;
                }
                
                console.log("تم العثور على وثيقة بيانات المسؤول");
                var storedPassword = adminDoc.data().password;
                
                // التحقق من كلمة المرور
                if (password !== storedPassword) {
                    console.error("كلمة المرور غير صحيحة");
                    reject(new Error('كلمة المرور غير صحيحة'));
                    return;
                }

                console.log("تم التحقق من كلمة المرور بنجاح");
                
                // تسجيل وقت آخر تسجيل دخول
                adminRef.update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function() {
                    console.log("تم تحديث وقت آخر تسجيل دخول");
                    resolve(true);
                }).catch(function(error) {
                    console.error("خطأ في تحديث وقت آخر تسجيل دخول:", error);
                    // نجاح تسجيل الدخول حتى لو فشل تحديث وقت آخر تسجيل دخول
                    resolve(true);
                });
            }).catch(function(error) {
                console.error("خطأ في جلب بيانات المسؤول:", error);
                reject(error);
            });
        } catch (error) {
            console.error("خطأ غير متوقع في دالة تسجيل الدخول:", error);
            reject(error);
        }
    });
}

// دالة تحديث كلمة مرور المسؤول
function updateAdminPassword(currentPassword, newPassword) {
    return new Promise(function(resolve, reject) {
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
            var adminRef = db.collection('admin').doc('credentials');
            adminRef.get().then(function(adminDoc) {
                if (!adminDoc.exists) {
                    reject(new Error('لم يتم العثور على بيانات المسؤول'));
                    return;
                }
                
                var storedPassword = adminDoc.data().password;
                
                // التحقق من كلمة المرور الحالية
                if (currentPassword !== storedPassword) {
                    reject(new Error('كلمة المرور الحالية غير صحيحة'));
                    return;
                }
                
                // تحديث كلمة المرور
                adminRef.update({
                    password: newPassword,
                    lastPasswordUpdate: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function() {
                    resolve(true);
                }).catch(function(error) {
                    reject(error);
                });
            }).catch(function(error) {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

// دالة تحديث رقم الإصدار
function updateAppVersion(versionData) {
    return new Promise(function(resolve, reject) {
        try {
            // التحقق من صحة المدخلات
            if (!versionData.currentVersion || !versionData.newVersion) {
                reject(new Error('يجب إدخال رقم الإصدار الحالي والجديد'));
                return;
            }

            // التحقق من صحة تنسيق رقم الإصدار
            var versionRegex = /^\d+\.\d+\.\d+$/;
            if (!versionRegex.test(versionData.newVersion)) {
                reject(new Error('تنسيق رقم الإصدار غير صحيح. يجب أن يكون بالشكل X.Y.Z'));
                return;
            }

            // تحديث رقم الإصدار في Firebase
            db.collection('app_settings').doc('version').set(versionData, { merge: true })
                .then(function() {
                    // تحديث رقم الإصدار في الصفحة الرئيسية
                    return db.collection('app_settings').doc('index').set({ 
                        version: versionData.newVersion 
                    }, { merge: true });
                })
                .then(function() {
                    resolve(true);
                })
                .catch(function(error) {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

// دالة جلب رقم الإصدار الحالي
function getCurrentVersion() {
    return new Promise(function(resolve, reject) {
        try {
            db.collection('app_settings').doc('version').get()
                .then(function(doc) {
                    resolve(doc.exists ? doc.data().newVersion : '1.0.0');
                })
                .catch(function(error) {
                    console.error("خطأ في جلب رقم الإصدار:", error);
                    resolve('1.0.0');
                });
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
