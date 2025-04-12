// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize AI Assistant
    initAIAssistant();
    
    // Initialize meal planner
    initMealPlanner();
    
    // Hide loading screen
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1500);
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    });
});

function initAnimations() {
    // Simple AOS implementation
    const animateElements = document.querySelectorAll('[data-aos]');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('aos-animate');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
    checkScroll(); // Initial check
}

function initAIAssistant() {
    const assistantTrigger = document.querySelector('.ai-assistant-trigger');
    const assistantModal = document.querySelector('.ai-assistant-modal');
    
    assistantTrigger.addEventListener('click', function() {
        assistantModal.classList.add('active');
        loadAIAssistantContent();
    });
    
    assistantModal.addEventListener('click', function(e) {
        if (e.target === assistantModal) {
            assistantModal.classList.remove('active');
        }
    });
}

function loadAIAssistantContent() {
    const assistantContainer = document.querySelector('.ai-assistant-container');
    
    // In a real app, you would load dynamic content here
    assistantContainer.innerHTML = `
        <div class="ai-assistant-header">
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <h3>مساعد وجبتي الذكي</h3>
            <button class="close-assistant"><i class="fas fa-times"></i></button>
        </div>
        <div class="ai-assistant-body">
            <div class="ai-message">
                <div class="message-content">
                    مرحباً! أنا مساعد وجبتي. كيف يمكنني مساعدتك في التخطيط لوجباتك الأسبوعية؟
                </div>
                <div class="message-time">الآن</div>
            </div>
        </div>
        <div class="ai-assistant-footer">
            <div class="quick-actions">
                <button class="quick-action">أريد خطة نباتية</button>
                <button class="quick-action">خطة لخسارة الوزن</button>
                <button class="quick-action">وجبات لأسبوع مشغول</button>
            </div>
            <div class="input-container">
                <input type="text" placeholder="اكتب رسالتك هنا..." class="ai-input">
                <button class="send-button"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    // Add event listener for close button
    document.querySelector('.close-assistant').addEventListener('click', function() {
        document.querySelector('.ai-assistant-modal').classList.remove('active');
    });
}

function initMealPlanner() {
    // This would be initialized in meal-planner.js
    console.log('Meal planner initialized');
}