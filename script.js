document.addEventListener('DOMContentLoaded', function() {
    // التحقق من صحة النموذج وإرساله
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع بيانات النموذج
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // هنا يمكنك إضافة كود لإرسال البيانات إلى الخادم
            console.log('تم إرسال النموذج:', formData);
            
            // عرض رسالة نجاح
            alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
            supportForm.reset();
        });
    }

    // التمرير السلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
