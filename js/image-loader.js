/**
 * ملف لإدارة تحميل الصور وعرضها
 */

// قائمة بجميع الصور المستخدمة في الموقع
const programScreenshots = [
    {
        id: 'main-screen',
        title: 'الشاشة الرئيسية للبرنامج',
        path: 'الشاشة-الرئيسية.png'
    },
    {
        id: 'sales-invoice',
        title: 'شاشة المبيعات',
        path: 'فاتورة-المبيعات.png'
    },
    {
        id: 'system-settings',
        title: 'شاشة إدارة النظام',
        path: 'إعدادات-النظام.png'
    },
    {
        id: 'item-card',
        title: 'شاشة إدارة الأصناف',
        path: 'كرت-الصنف.png'
    },
    {
        id: 'pos',
        title: 'شاشة نقاط البيع',
        path: 'نقاط-البيع.png'
    },
    {
        id: 'purchases',
        title: 'شاشة المشتريات',
        path: 'المشتريات.png'
    },
    {
        id: 'reports',
        title: 'شاشة التقارير',
        path: 'تقارير.png'
    },
    {
        id: 'vouchers',
        title: 'شاشة السندات',
        path: 'سندات.png'
    },
    {
        id: 'user-permissions',
        title: 'شاشة صلاحيات المستخدمين',
        path: 'صلاحيات-المستخدمين.png'
    },
    {
        id: 'pos-advanced',
        title: 'شاشة نقاط البيع المتقدمة',
        path: 'نقاط-البيع-2.png'
    },
    {
        id: 'hr-customers',
        title: 'إدارة الموارد البشرية - العملاء',
        path: 'إدارة-الموارد-البشرية-العملاء.png'
    },
    {
        id: 'hr-representatives',
        title: 'إدارة الموارد البشرية - المندوبين',
        path: 'إدارة-الموارد-البشرية-المندوبين.png'
    }
];

// متغير عالمي لتخزين فهرس الصورة الحالية
let currentImageIndex = 0;

// تهيئة عرض الصور عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المودال لعرض الصور
    initializeImageModal();
    
    // تحميل الصور في قسم شاشات البرنامج
    loadProgramScreenshots();
});

// تهيئة المودال لعرض الصور
function initializeImageModal() {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalLabel');
    const closeModal = document.querySelector('.close-modal');
    const prevButton = document.getElementById('prevImage');
    const nextButton = document.getElementById('nextImage');
    
    // إغلاق المودال عند النقر على زر الإغلاق
    if (closeModal) {
        closeModal.addEventListener('click', function() {
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
        if (event.key === 'Escape' && imageModal.style.display === 'flex') {
            imageModal.style.display = 'none';
        }
        
        // التنقل بين الصور باستخدام أزرار الأسهم
        if (imageModal.style.display === 'flex') {
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
    
    // فتح المودال لعرض الصورة
    window.openImageModal = function(imageSrc, title) {
        console.log('فتح الصورة:', imageSrc);
        
        // تحديد فهرس الصورة الحالية
        const imagePath = imageSrc.split('/').pop();
        currentImageIndex = programScreenshots.findIndex(img => img.path === imagePath);
        
        if (currentImageIndex === -1) {
            currentImageIndex = 0;
        }
        
        modalImage.src = imageSrc;
        modalTitle.textContent = title;
        imageModal.style.display = 'flex';
        
        // تحديث حالة أزرار التنقل
        updateNavigationButtons();
    };
    
    // عرض الصورة السابقة
    function showPrevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateModalImage();
        }
    }
    
    // عرض الصورة التالية
    function showNextImage() {
        if (currentImageIndex < programScreenshots.length - 1) {
            currentImageIndex++;
            updateModalImage();
        }
    }
    
    // تحديث الصورة المعروضة في المودال
    function updateModalImage() {
        const screenshot = programScreenshots[currentImageIndex];
        const imagePath = `images/${screenshot.path}`;
        const imageUrl = new URL(imagePath, window.location.href).href;
        
        modalImage.src = imageUrl;
        modalTitle.textContent = screenshot.title;
        
        // تحديث حالة أزرار التنقل
        updateNavigationButtons();
    }
    
    // تحديث حالة أزرار التنقل
    function updateNavigationButtons() {
        if (prevButton && nextButton) {
            prevButton.disabled = currentImageIndex === 0;
            nextButton.disabled = currentImageIndex === programScreenshots.length - 1;
        }
    }
}

// تحميل صور شاشات البرنامج
function loadProgramScreenshots() {
    const screenshotsContainer = document.getElementById('screenshots-container');
    if (!screenshotsContainer) return;
    
    // مسح المحتوى الحالي
    screenshotsContainer.innerHTML = '';
    
    // إضافة كل صورة إلى القسم
    programScreenshots.forEach((screenshot, index) => {
        // إنشاء عنصر العرض
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-4' + (index % 2 === 0 && index === programScreenshots.length - 1 ? ' mx-auto' : '');
        
        // بناء مسار الصورة
        const imagePath = `images/${screenshot.path}`;
        const imageUrl = new URL(imagePath, window.location.href).href;
        
        // إنشاء بطاقة العرض
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 250px;">
                    <img src="${imageUrl}" class="img-fluid" alt="${screenshot.title}" 
                         style="max-height: 100%; max-width: 100%; object-fit: contain;" loading="lazy" 
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=صورة+غير+متوفرة';">
                    <div class="image-overlay">
                        <button class="view-details" onclick="openImageModal('${imageUrl}', '${screenshot.title}')">عرض تفاصيل</button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${screenshot.title}</h5>
                </div>
            </div>
        `;
        
        // إضافة العنصر إلى الحاوية
        screenshotsContainer.appendChild(col);
    });
    
    // إضافة معالجة الصور
    const images = screenshotsContainer.querySelectorAll('img');
    images.forEach(img => {
        // إضافة معالج أخطاء للصور
        img.onerror = function() {
            console.error('فشل تحميل الصورة:', img.src);
            img.src = 'https://via.placeholder.com/400x300?text=صورة+غير+متوفرة';
        };
        
        // إضافة تأثير التحميل التدريجي
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.onload = function() {
            console.log('تم تحميل الصورة بنجاح:', img.src);
            img.style.opacity = '1';
        };
    });
}
