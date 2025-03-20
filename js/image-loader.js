/**
 * ملف لإدارة تحميل الصور وعرضها
 */

// متغيرات عامة
let programScreenshots = [];
let currentImageIndex = 0;

// تحميل صور شاشات البرنامج
function loadProgramScreenshots() {
    // بيانات الصور
    programScreenshots = [
        { path: 'images/screenshots/screenshot1.jpg', title: 'شاشة تسجيل الدخول' },
        { path: 'images/screenshots/screenshot2.jpg', title: 'الشاشة الرئيسية' },
        { path: 'images/screenshots/screenshot3.jpg', title: 'شاشة إدارة الحسابات' },
        { path: 'images/screenshots/screenshot4.jpg', title: 'شاشة التقارير' },
        { path: 'images/screenshots/screenshot5.jpg', title: 'شاشة المستخدمين' },
        { path: 'images/screenshots/screenshot6.jpg', title: 'شاشة الإعدادات' }
    ];

    // عرض الصور في القسم المخصص
    const screenshotsContainer = document.getElementById('programScreenshots');
    if (!screenshotsContainer) return;

    let html = '';
    programScreenshots.forEach((screenshot, index) => {
        const imageUrl = screenshot.path;
        html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                <div class="card-img-container" style="height: 200px; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
                    <img src="${imageUrl}" alt="${screenshot.title}" class="card-img-top" 
                         style="max-height: 100%; max-width: 100%; object-fit: contain;" loading="lazy" 
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=صورة+غير+متوفرة';">
                    <div class="image-overlay">
                        <button class="view-details" onclick="showImageInModal('${imageUrl}', '${screenshot.title}')">عرض تفاصيل</button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${screenshot.title}</h5>
                </div>
                </div>
            </div>
        `;
    });

    screenshotsContainer.innerHTML = html;
}

// عرض الصورة في المودال
function showImageInModal(imageSrc, title) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalLabel');
    
    // تعيين مصدر الصورة والعنوان
    modalImage.src = imageSrc;
    modalTitle.textContent = title || 'عرض الصورة';
    
    // إظهار المودال
    imageModal.style.display = 'block';
    
    // تحديث الصورة الحالية في قائمة الصور
    currentImageIndex = programScreenshots.findIndex(img => img.path === imageSrc);
    
    // تحديث حالة أزرار التنقل
    updateNavigationButtons();
}

// عرض الصورة السابقة
function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        const prevImage = programScreenshots[currentImageIndex];
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('imageModalLabel');
        
        modalImage.src = prevImage.path;
        modalTitle.textContent = prevImage.title;
        
        // تحديث حالة أزرار التنقل
        updateNavigationButtons();
    }
}

// عرض الصورة التالية
function showNextImage() {
    if (currentImageIndex < programScreenshots.length - 1) {
        currentImageIndex++;
        const nextImage = programScreenshots[currentImageIndex];
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('imageModalLabel');
        
        modalImage.src = nextImage.path;
        modalTitle.textContent = nextImage.title;
        
        // تحديث حالة أزرار التنقل
        updateNavigationButtons();
    }
}

// تحديث حالة أزرار التنقل
function updateNavigationButtons() {
    const prevButton = document.getElementById('prevImage');
    const nextButton = document.getElementById('nextImage');
    
    if (prevButton && nextButton) {
        prevButton.disabled = currentImageIndex === 0;
        nextButton.disabled = currentImageIndex === programScreenshots.length - 1;
    }
}

// تهيئة المودال لعرض الصور
function initializeImageModal() {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalLabel');
    const closeModal = document.querySelector('.close-modal');
    const closeModalCorner = document.querySelector('.close-modal-corner');
    const prevButton = document.getElementById('prevImage');
    const nextButton = document.getElementById('nextImage');
    
    // إغلاق المودال عند النقر على زر الإغلاق
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            imageModal.style.display = 'none';
        });
    }
    
    // إغلاق المودال عند النقر على زر الإغلاق في الزاوية العليا اليمنى
    if (closeModalCorner) {
        closeModalCorner.addEventListener('click', function() {
            imageModal.style.display = 'none';
        });
    }
    
    // إغلاق المودال عند النقر خارج الصورة
    window.addEventListener('click', function(event) {
        if (event.target == imageModal) {
            imageModal.style.display = 'none';
        }
    });
    
    // إغلاق المودال عند الضغط على زر ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            imageModal.style.display = 'none';
        }
        
        // التنقل بين الصور باستخدام أزرار الأسهم
        if (imageModal.style.display === 'block') {
            if (event.key === 'ArrowLeft') {
                showNextImage();
            } else if (event.key === 'ArrowRight') {
                showPrevImage();
            }
        }
    });
    
    // تهيئة أزرار التنقل
    if (prevButton) {
        prevButton.addEventListener('click', showPrevImage);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', showNextImage);
    }
}

// تنفيذ الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeImageModal();
    loadProgramScreenshots();
    
    // جعل الدالة متاحة عالميًا
    window.showImageInModal = showImageInModal;
});
