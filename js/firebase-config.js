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
