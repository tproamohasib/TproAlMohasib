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
        { path: 'images/الشاشة-الرئيسية.png', title: 'الشاشة الرئيسية للبرنامج' },
        { path: 'images/فاتورة-المبيعات.png', title: 'شاشة المبيعات' },
        { path: 'images/إعدادات-النظام.png', title: 'شاشة إدارة النظام' },
        { path: 'images/كرت-الصنف.png', title: 'شاشة إدارة الأصناف' },
        { path: 'images/نقاط-البيع.png', title: 'شاشة نقاط البيع' },
        { path: 'images/المشتريات.png', title: 'شاشة المشتريات' },
        { path: 'images/تقارير.png', title: 'شاشة التقارير' },
        { path: 'images/سندات.png', title: 'شاشة السندات' },
        { path: 'images/صلاحيات-المستخدمين.png', title: 'شاشة صلاحيات المستخدمين' },
        { path: 'images/نقاط-البيع-2.png', title: 'شاشة نقاط البيع المتقدمة' },
        { path: 'images/إدارة-الموارد-البشرية-العملاء.png', title: 'إدارة الموارد البشرية - العملاء' },
        { path: 'images/إدارة-الموارد-البشرية-المندوبين.png', title: 'إدارة الموارد البشرية - المندوبين' }
    ];

    // عرض الصور في القسم المخصص
    const screenshotsContainer = document.getElementById('screenshots-container');
    if (!screenshotsContainer) return;

    // إضافة CSS لتحسين عرض الصور
    const style = document.createElement('style');
    style.textContent = `
        .card-img-container:hover .image-overlay {
            opacity: 1 !important;
        }
        .card {
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);

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
                        <div class="image-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); opacity: 0; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s;">
                            <button class="btn btn-light" onclick="showImageInModal('${imageUrl}', '${screenshot.title}')" style="padding: 8px 15px; border-radius: 5px;">عرض</button>
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
    const imagePath = imageSrc.split('/').pop();
    currentImageIndex = programScreenshots.findIndex(img => img.path.includes(imagePath));
    
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
