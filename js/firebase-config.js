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
const db = firebase.firestore();

// دالة لتسجيل عميل جديد
async function registerCustomer(customerData) {
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

// دالة للحصول على قائمة العملاء
async function getCustomers() {
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
