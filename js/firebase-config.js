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

// تصدير الدوال
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

// دالة تحديث رقم الإصدار
window.updateAppVersion = async function(versionData) {
    try {
        await db.collection('app_settings').doc('version').set(versionData, { merge: true });
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
