class AIAssistant {
    constructor() {
        this.conversation = [
            {
                role: "system",
                content: "أنت مساعد طهي ذكي يساعد المستخدمين في إنشاء خطط وجبات أسبوعية صحية. اسأل عن تفضيلاتهم الغذائية، عدد الأشخاص، الميزانية، وأي قيود غذائية، ثم قدم اقتراحات وجبات متوازنة."
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.addWelcomeMessage();
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action')) {
                this.handleQuickAction(e.target.textContent);
            }
            
            if (e.target.classList.contains('send-button') || 
                (e.target.classList.contains('ai-input') && e.key === 'Enter')) {
                this.handleUserMessage();
            }
        });
    }
    
    addWelcomeMessage() {
        const messagesContainer = document.querySelector('.ai-assistant-body');
        const welcomeMessages = [
            "مرحباً! أنا مساعد وجبتي الذكي.",
            "يمكنني مساعدتك في إنشاء خطة وجبات أسبوعية مخصصة تماماً لاحتياجاتك.",
            "لنبدأ! هل يمكنك إخباري ببعض المعلومات عن تفضيلاتك الغذائية؟"
        ];
        
        welcomeMessages.forEach((msg, index) => {
            setTimeout(() => {
                this.addBotMessage(msg);
            }, index * 800);
        });
    }
    
    handleQuickAction(action) {
        this.addUserMessage(action);
        
        const responses = {
            "أريد خطة نباتية": "رائع! لدي العديد من الخيارات النباتية اللذيذة. كم عدد الأشخاص الذين تخطط لهم؟",
            "خطة لخسارة الوزن": "لخسارة الوزن، سأركز على وجبات غنية بالبروتين والألياف وقليلة السعرات. ما هي المكونات المفضلة لديك؟",
            "وجبات لأسبوع مشغول": "فهمت! سأقترح وجبات سريعة التحضير (تحتاج أقل من 30 دقيقة). هل لديك أي حساسيات غذائية؟"
        };
        
        setTimeout(() => {
            this.addBotMessage(responses[action] || "شكراً لمشاركة هذه المعلومات. كيف يمكنني مساعدتك أكثر؟");
        }, 800);
    }
    
    handleUserMessage() {
        const input = document.querySelector('.ai-input');
        const message = input.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            input.value = '';
            
            // Simulate AI thinking
            this.showTypingIndicator();
            
            // In a real app, you would call your AI API here
            setTimeout(() => {
                this.hideTypingIndicator();
                this.generateAIResponse(message);
            }, 1500);
        }
    }
    
    addUserMessage(message) {
        this.conversation.push({ role: "user", content: message });
        this.renderMessage(message, 'user');
    }
    
    addBotMessage(message) {
        this.conversation.push({ role: "assistant", content: message });
        this.renderMessage(message, 'bot');
    }
    
    renderMessage(message, sender) {
        const messagesContainer = document.querySelector('.ai-assistant-body');
        const messageElement = document.createElement('div');
        messageElement.classList.add('ai-message', sender);
        
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">الآن</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.querySelector('.ai-assistant-body');
        const typingElement = document.createElement('div');
        typingElement.classList.add('ai-message', 'bot', 'typing');
        typingElement.innerHTML = `
            <div class="message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.typingElement = typingElement;
    }
    
    hideTypingIndicator() {
        if (this.typingElement) {
            this.typingElement.remove();
        }
    }
    
    generateAIResponse(userMessage) {
        // In a real app, this would call your AI API
        // For demo purposes, we'll use simple responses
        
        const lowerMessage = userMessage.toLowerCase();
        let response;
        
        if (lowerMessage.includes('مرحبا') || lowerMessage.includes('اهلا')) {
            response = "مرحباً بك! كيف يمكنني مساعدتك في التخطيط لوجباتك الأسبوعية؟";
        } 
        else if (lowerMessage.includes('شكرا') || lowerMessage.includes('متشكر')) {
            response = "العفو! هل هناك أي شيء آخر يمكنني مساعدتك به؟";
        }
        else if (lowerMessage.includes('شخص') || lowerMessage.includes('افراد')) {
            response = "فهمت! الآن هل يمكنك إخباري بنظامك الغذائي المفضل؟ (عادي، نباتي، كيتو، إلخ)";
        }
        else if (lowerMessage.includes('نباتي')) {
            response = "رائع! لدي العديد من الأفكار النباتية اللذيذة. هل تفضل أن تركز الخطة على:<br>" +
                       "- البروتينات النباتية مثل العدس والبقوليات<br>" +
                       "- الخضروات الموسمية<br>" +
                       "- وصفات عالمية نباتية";
        }
        else if (lowerMessage.includes('كيتو')) {
            response = "لنظام الكيتو، سأركز على:<br>" +
                       "- الدهون الصحية (أفوكادو، زيت زيتون)<br>" +
                       "- بروتينات معتدلة<br>" +
                       "- خضروات قليلة الكربوهيدرات<br><br>" +
                       "هل لديك أي أطعمة مفضلة تريد تضمينها؟";
        }
        else {
            response = "شكراً لمشاركة هذه المعلومات. بناءً على ما ذكرت، أقترح البدء بالخطة التالية:<br><br>" +
                       "1. الإفطار: عجة بالخضار مع أفوكادو<br>" +
                       "2. الغداء: صدر دجاج مشوي مع خضار سوتيه<br>" +
                       "3. العشاء: سمك مشوي مع سلطة<br><br>" +
                       "هل تود أي تعديلات على هذه الاقتراحات؟";
        }
        
        this.addBotMessage(response);
        
        // If the conversation is advanced enough, show meal plan
        if (this.conversation.length > 4) {
            setTimeout(() => {
                this.showMealPlanPreview();
            }, 1000);
        }
    }
    
    showMealPlanPreview() {
        const mealPlanHTML = `
            <div class="meal-plan-preview">
                <h4>خطة وجبات مقترحة</h4>
                <div class="meal-plan-days">
                    <div class="day">
                        <h5>الأحد</h5>
                        <ul>
                            <li>فطور: شوفان بالحليب والموز</li>
                            <li>غداء: صدر دجاج مشوي مع أرز بني</li>
                            <li>عشاء: سلطة التونة مع خبز توست</li>
                        </ul>
                    </div>
                    <div class="day">
                        <h5>الإثنين</h5>
                        <ul>
                            <li>فطور: بيض مسلوق مع أفوكادو</li>
                            <li>غداء: سمك مشوي مع بطاطا حلوة</li>
                            <li>عشاء: شوربة عدس</li>
                        </ul>
                    </div>
                </div>
                <button class="btn btn-primary save-plan">حفظ الخطة</button>
            </div>
        `;
        
        this.addBotMessage(mealPlanHTML);
        
        // Scroll to the bottom
        const messagesContainer = document.querySelector('.ai-assistant-body');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize the AI Assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});