class MealPlanner {
    constructor() {
        this.mealTemplates = {
            vegetarian: this.getVegetarianMeals(),
            keto: this.getKetoMeals(),
            mediterranean: this.getMediterraneanMeals(),
            quick: this.getQuickMeals(),
            // إضافة قوائم طعام جديدة حسب نوع الجسم
            weightGain: this.getWeightGainMeals(),
            weightLoss: this.getWeightLossMeals()
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderMealCategories();
        this.renderBodyTypeSelector();
    }
    
    setupEventListeners() {
        // Event listeners for meal planner form
        document.getElementById('generate-plan').addEventListener('click', (e) => {
            e.preventDefault();
            this.generateMealPlan();
        });
        
        // Event listeners for category selection
        document.querySelectorAll('.meal-category').forEach(category => {
            category.addEventListener('click', () => {
                this.selectCategory(category.dataset.category);
            });
        });
        
        // إضافة مستمع حدث لنوع الجسم
        document.addEventListener('change', (e) => {
            if (e.target.id === 'body-type') {
                this.handleBodyTypeChange(e.target.value);
            }
        });
    }
    
    renderMealCategories() {
        const categoriesContainer = document.querySelector('.meal-categories');
        
        const categories = [
            { id: 'vegetarian', name: 'نباتي', icon: 'leaf' },
            { id: 'keto', name: 'كيتو', icon: 'weight' },
            { id: 'mediterranean', name: 'متوسطي', icon: 'sun' },
            { id: 'quick', name: 'سريع', icon: 'bolt' },
            { id: 'family', name: 'عائلي', icon: 'home' },
            { id: 'budget', name: 'اقتصادي', icon: 'wallet' },
            // إضافة فئات جديدة لزيادة الوزن وإنقاصه
            { id: 'weightGain', name: 'زيادة الوزن', icon: 'plus-circle' },
            { id: 'weightLoss', name: 'إنقاص الوزن', icon: 'minus-circle' }
        ];
        
        categoriesContainer.innerHTML = '';
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'meal-category';
            categoryElement.dataset.category = category.id;
            
            categoryElement.innerHTML = `
                <div class="category-icon">
                    <i class="fas fa-${category.icon}"></i>
                </div>
                <h4>${category.name}</h4>
            `;
            
            categoriesContainer.appendChild(categoryElement);
        });
    }
    
    // إضافة مربع اختيار نوع الجسم
    renderBodyTypeSelector() {
        // التحقق من وجود عنصر النموذج أولاً
        const formContainer = document.querySelector('.meal-plan-form');
        if (!formContainer) return;
        
        // إنشاء عنصر نوع الجسم
        const bodyTypeField = document.createElement('div');
        bodyTypeField.className = 'form-group';
        bodyTypeField.innerHTML = `
            <label for="body-type">نوع الجسم</label>
            <select id="body-type" class="form-control">
                <option value="">-- اختر نوع الجسم --</option>
                <option value="slim">نحيف - أحتاج زيادة وزن</option>
                <option value="overweight">بدين - أحتاج إنقاص وزن</option>
                <option value="normal">متوسط - أريد المحافظة على وزني</option>
            </select>
        `;
        
        // إضافة العنصر بعد حقل النظام الغذائي
        const dietField = document.getElementById('diet').closest('.form-group');
        if (dietField && dietField.parentNode) {
            dietField.parentNode.insertBefore(bodyTypeField, dietField.nextSibling);
        } else {
            formContainer.appendChild(bodyTypeField);
        }
    }
    
    // معالجة تغيير نوع الجسم
    handleBodyTypeChange(bodyType) {
        // إعادة تعيين التحديد الحالي للفئات
        document.querySelectorAll('.meal-category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        // تحديد الفئة المناسبة تلقائياً بناءً على نوع الجسم
        let categoryToSelect = '';
        
        switch(bodyType) {
            case 'slim':
                categoryToSelect = 'weightGain';
                document.getElementById('diet').value = 'weightGain';
                break;
            case 'overweight':
                categoryToSelect = 'weightLoss';
                document.getElementById('diet').value = 'weightLoss';
                break;
            case 'normal':
                categoryToSelect = 'mediterranean';
                document.getElementById('diet').value = 'regular';
                break;
        }
        
        if (categoryToSelect) {
            const categoryElement = document.querySelector(`.meal-category[data-category="${categoryToSelect}"]`);
            if (categoryElement) {
                categoryElement.classList.add('active');
                this.showSampleMeals(categoryToSelect);
            }
        }
    }
    
    selectCategory(categoryId) {
        // Update UI
        document.querySelectorAll('.meal-category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        document.querySelector(`.meal-category[data-category="${categoryId}"]`).classList.add('active');
        
        // تحديث النظام الغذائي في النموذج تلقائياً
        const dietSelect = document.getElementById('diet');
        if (dietSelect) {
            // تعيين النظام الغذائي بناءً على الفئة المختارة
            switch(categoryId) {
                case 'weightGain':
                    dietSelect.value = 'weightGain';
                    break;
                case 'weightLoss':
                    dietSelect.value = 'weightLoss';
                    break;
                case 'vegetarian':
                    dietSelect.value = 'vegetarian';
                    break;
                case 'keto':
                    dietSelect.value = 'keto';
                    break;
                case 'mediterranean':
                    dietSelect.value = 'mediterranean';
                    break;
                default:
                    dietSelect.value = 'regular';
            }
        }
        
        // Show sample meals for this category
        this.showSampleMeals(categoryId);
    }
    
    showSampleMeals(categoryId) {
        const meals = this.mealTemplates[categoryId] || this.getDefaultMeals();
        const sampleContainer = document.querySelector('.sample-meals');
        
        sampleContainer.innerHTML = '';
        
        meals.forEach(meal => {
            const mealElement = document.createElement('div');
            mealElement.className = 'sample-meal';
            
            mealElement.innerHTML = `
                <div class="meal-image" style="background-color: ${meal.color}">
                    <i class="fas fa-${meal.icon}"></i>
                </div>
                <div class="meal-info">
                    <h5>${meal.name}</h5>
                    <p>${meal.description}</p>
                    <div class="meal-meta">
                        <span><i class="fas fa-clock"></i> ${meal.time}</span>
                        <span><i class="fas fa-fire"></i> ${meal.calories} سعرات</span>
                        <span><i class="fas fa-info-circle"></i> ${meal.bodyType || 'مناسب للجميع'}</span>
                    </div>
                </div>
            `;
            
            sampleContainer.appendChild(mealElement);
        });
    }
    
    generateMealPlan() {
        const formData = {
            people: document.getElementById('people').value,
            diet: document.getElementById('diet').value,
            budget: document.getElementById('budget').value,
            bodyType: document.getElementById('body-type').value,
            excludes: Array.from(document.querySelectorAll('input[name="exclude"]:checked')).map(el => el.value)
        };
        
        // Show loading animation
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.displayMealPlan(formData);
        }, 2000);
    }
    
    displayMealPlan(formData) {
        const planContainer = document.querySelector('.meal-plan-results');
        const meals = this.generateMealsBasedOnPreferences(formData);
        
        let planHTML = `
            <div class="plan-header">
                <h3>خطة وجباتك الأسبوعية</h3>
                <p>مخصصة لـ ${formData.people} أشخاص - نظام ${this.getDietName(formData.diet)}</p>
                ${formData.bodyType ? `<p class="body-type-indicator">مصممة خصيصاً لأصحاب الجسم ${this.getBodyTypeName(formData.bodyType)}</p>` : ''}
            </div>
            <div class="nutrition-summary">
                ${this.generateNutritionSummary(formData.bodyType, formData.diet)}
            </div>
            <div class="plan-days">
        `;
        
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        
        days.forEach((day, index) => {
            const dayMeals = meals[index % meals.length]; // Cycle through meals
            
            planHTML += `
                <div class="plan-day">
                    <h4>${day}</h4>
                    <div class="day-meals">
                        <div class="meal">
                            <h5>الفطور</h5>
                            <p>${dayMeals.breakfast}</p>
                            <div class="meal-calories">${dayMeals.breakfastCalories || ''} سعرة</div>
                        </div>
                        <div class="meal">
                            <h5>الغداء</h5>
                            <p>${dayMeals.lunch}</p>
                            <div class="meal-calories">${dayMeals.lunchCalories || ''} سعرة</div>
                        </div>
                        <div class="meal">
                            <h5>العشاء</h5>
                            <p>${dayMeals.dinner}</p>
                            <div class="meal-calories">${dayMeals.dinnerCalories || ''} سعرة</div>
                        </div>
                        ${dayMeals.snack ? `
                        <div class="meal">
                            <h5>وجبة خفيفة</h5>
                            <p>${dayMeals.snack}</p>
                            <div class="meal-calories">${dayMeals.snackCalories || ''} سعرة</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        planHTML += `
            </div>
            <div class="plan-actions">
                <button class="btn btn-outline print-plan"><i class="fas fa-print"></i> طباعة الخطة</button>
                <button class="btn btn-primary generate-list"><i class="fas fa-shopping-basket"></i> إنشاء قائمة التسوق</button>
            </div>
        `;
        
        planContainer.innerHTML = planHTML;
        
        // Scroll to results
        planContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Add event listeners for new buttons
        document.querySelector('.print-plan').addEventListener('click', () => {
            window.print();
        });
        
        document.querySelector('.generate-list').addEventListener('click', () => {
            this.generateShoppingList(meals);
        });
    }
    
    // إنشاء ملخص التغذية حسب نوع الجسم والنظام الغذائي
    generateNutritionSummary(bodyType, diet) {
        let summaryHTML = '<div class="nutrition-breakdown">';
        
        if (bodyType === 'slim') {
            summaryHTML += `
                <div class="nutrition-item">
                    <span class="nutrition-label">البروتين</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 85%"></div>
                    </div>
                    <span class="nutrition-value">عالي (25-35%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">الكربوهيدرات</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 65%"></div>
                    </div>
                    <span class="nutrition-value">متوسط (45-55%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">الدهون</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 50%"></div>
                    </div>
                    <span class="nutrition-value">متوسط (20-30%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">السعرات اليومية</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 90%"></div>
                    </div>
                    <span class="nutrition-value">3000-3500 سعرة</span>
                </div>
            `;
        } else if (bodyType === 'overweight') {
            summaryHTML += `
                <div class="nutrition-item">
                    <span class="nutrition-label">البروتين</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 80%"></div>
                    </div>
                    <span class="nutrition-value">عالي (30-40%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">الكربوهيدرات</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 40%"></div>
                    </div>
                    <span class="nutrition-value">منخفض (20-30%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">الدهون</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 60%"></div>
                    </div>
                    <span class="nutrition-value">متوسط (30-40%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">السعرات اليومية</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 45%"></div>
                    </div>
                    <span class="nutrition-value">1500-1800 سعرة</span>
                </div>
            `;
        } else {
            summaryHTML += `
                <div class="nutrition-item">
                    <span class="nutrition-label">البروتين</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 60%"></div>
                    </div>
                    <span class="nutrition-value">متوازن (20-30%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">الكربوهيدرات</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 60%"></div>
                    </div>
                    <span class="nutrition-value">متوازن (45-55%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">الدهون</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 50%"></div>
                    </div>
                    <span class="nutrition-value">متوازن (20-30%)</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">السعرات اليومية</span>
                    <div class="nutrition-bar">
                        <div class="nutrition-fill" style="width: 60%"></div>
                    </div>
                    <span class="nutrition-value">2000-2500 سعرة</span>
                </div>
            `;
        }
        
        summaryHTML += '</div>';
        return summaryHTML;
    }
    
    generateShoppingList(meals) {
        // تجميع جميع المكونات المطلوبة من جميع الوجبات
        const ingredientSet = new Set();
        
        // إضافة مكونات من جميع الوجبات
        meals.forEach(dayMeal => {
            // استخراج المكونات من كل وجبة
            const breakfastIngredients = this.extractIngredientsFromMeal(dayMeal.breakfast);
            const lunchIngredients = this.extractIngredientsFromMeal(dayMeal.lunch);
            const dinnerIngredients = this.extractIngredientsFromMeal(dayMeal.dinner);
            
            // إضافة المكونات إلى المجموعة
            breakfastIngredients.forEach(ingredient => ingredientSet.add(ingredient));
            lunchIngredients.forEach(ingredient => ingredientSet.add(ingredient));
            dinnerIngredients.forEach(ingredient => ingredientSet.add(ingredient));
            
            // إضافة مكونات الوجبة الخفيفة إذا وجدت
            if (dayMeal.snack) {
                const snackIngredients = this.extractIngredientsFromMeal(dayMeal.snack);
                snackIngredients.forEach(ingredient => ingredientSet.add(ingredient));
            }
        });
        
        // تحويل المجموعة إلى مصفوفة وترتيبها
        const ingredients = Array.from(ingredientSet).sort();
        
        // تقسيم المكونات إلى فئات
        const categorizedIngredients = {
            'بروتينات': [],
            'خضروات وفواكه': [],
            'حبوب ونشويات': [],
            'منتجات ألبان': [],
            'توابل وزيوت': [],
            'أخرى': []
        };
        
        // فئات المكونات - هذا سيكون أكثر تعقيدًا في التطبيق الحقيقي
        const proteinItems = ['دجاج', 'لحم', 'سمك', 'تونة', 'بيض', 'بقوليات', 'عدس', 'حمص'];
        const produceItems = ['خضار', 'فواكه', 'موز', 'تفاح', 'خيار', 'طماطم', 'خس', 'سبانخ', 'بروكلي', 'أفوكادو'];
        const grainsItems = ['أرز', 'معكرونة', 'خبز', 'شوفان', 'كينوا', 'برغل', 'توست'];
        const dairyItems = ['حليب', 'جبنة', 'لبن', 'زبادي', 'زبدة'];
        const condimentItems = ['زيت', 'توابل', 'ملح', 'فلفل', 'ثوم', 'بصل'];
        
        // تصنيف المكونات
        ingredients.forEach(ingredient => {
            if (proteinItems.some(item => ingredient.includes(item))) {
                categorizedIngredients['بروتينات'].push(ingredient);
            } else if (produceItems.some(item => ingredient.includes(item))) {
                categorizedIngredients['خضروات وفواكه'].push(ingredient);
            } else if (grainsItems.some(item => ingredient.includes(item))) {
                categorizedIngredients['حبوب ونشويات'].push(ingredient);
            } else if (dairyItems.some(item => ingredient.includes(item))) {
                categorizedIngredients['منتجات ألبان'].push(ingredient);
            } else if (condimentItems.some(item => ingredient.includes(item))) {
                categorizedIngredients['توابل وزيوت'].push(ingredient);
            } else {
                categorizedIngredients['أخرى'].push(ingredient);
            }
        });
        
        const listContainer = document.querySelector('.shopping-list-results');
        
        let listHTML = `
            <div class="list-header">
                <h3>قائمة التسوق الأسبوعية</h3>
                <p>كل ما تحتاجه لخطة وجباتك</p>
            </div>
        `;
        
        // إضافة المكونات حسب الفئة
        for (const [category, items] of Object.entries(categorizedIngredients)) {
            if (items.length > 0) {
                listHTML += `
                    <div class="ingredients-category">
                        <h4>${category}</h4>
                        <ul class="ingredients-list">
                `;
                
                items.forEach(ingredient => {
                    listHTML += `
                        <li>
                            <label>
                                <input type="checkbox">
                                <span>${ingredient}</span>
                            </label>
                        </li>
                    `;
                });
                
                listHTML += `
                        </ul>
                    </div>
                `;
            }
        }
        
        listHTML += `
            <div class="list-actions">
                <button class="btn btn-outline send-list"><i class="fas fa-share"></i> مشاركة القائمة</button>
                <button class="btn btn-primary save-list"><i class="fas fa-save"></i> حفظ القائمة</button>
            </div>
        `;
        
        listContainer.innerHTML = listHTML;
        
        // Scroll to list
        listContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // استخراج المكونات من نص الوجبة
    extractIngredientsFromMeal(mealText) {
        // قاموس بسيط للمكونات الشائعة
        const commonIngredients = [
            'دجاج', 'لحم', 'سمك', 'تونة', 'بيض', 'أرز', 'معكرونة', 'خبز', 'شوفان',
            'حليب', 'جبنة', 'لبن', 'زبادي', 'خضار', 'فواكه', 'موز', 'تفاح', 'أفوكادو',
            'بطاطا', 'بطاطا حلوة', 'بروكلي', 'خيار', 'طماطم', 'خس', 'سبانخ', 'عدس',
            'حمص', 'فول', 'زيتون', 'زيت زيتون', 'زبدة', 'كينوا', 'برغل'
        ];
        
        // البحث عن المكونات في نص الوجبة
        const foundIngredients = [];
        commonIngredients.forEach(ingredient => {
            if (mealText.includes(ingredient)) {
                // استخراج الكمية إذا وجدت
                const regex = new RegExp(`(\\d+)\\s*(جرام|كيلو|حبة|ملعقة|كوب)\\s*${ingredient}`, 'i');
                const match = mealText.match(regex);
                
                if (match) {
                    foundIngredients.push(`${ingredient} (${match[1]} ${match[2]})`);
                } else {
                    foundIngredients.push(ingredient);
                }
            }
        });
        
        return foundIngredients;
    }
    
    showLoading() {
        const loader = document.createElement('div');
        loader.className = 'meal-plan-loading';
        loader.innerHTML = `
            <div class="loader">
                <div class="loader-spinner"></div>
                <p>جاري إنشاء خطتك المخصصة...</p>
            </div>
        `;
        
        document.querySelector('.meal-plan-results').innerHTML = '';
        document.querySelector('.meal-plan-results').appendChild(loader);
    }
    
    hideLoading() {
        const loader = document.querySelector('.meal-plan-loading');
        if (loader) {
            loader.remove();
        }
    }
    
    // وجبات لزيادة الوزن
    getWeightGainMeals() {
        return [
            {
                name: "سموذي عالي السعرات",
                description: "حليب كامل الدسم، موز، عسل، زبدة فول سوداني",
                time: "5 دقائق",
                calories: "650",
                icon: "blender",
                color: "#9C27B0",
                bodyType: "للنحيفين"
            },
            {
                name: "بيض بالأفوكادو والجبن",
                description: "بيض مقلي مع أفوكادو وجبنة شيدر على خبز محمص",
                time: "15 دقائق",
                calories: "580",
                icon: "egg",
                color: "#4CAF50",
                bodyType: "للنحيفين"
            },
            {
                name: "معكرونة بصلصة الكريمة",
                description: "معكرونة مع دجاج وصلصة كريمة وجبن",
                time: "30 دقائق",
                calories: "850",
                icon: "utensils",
                color: "#FF9800",
                bodyType: "للنحيفين"
            },
            {
                name: "سلطة بروتين غنية",
                description: "سلطة مع دجاج وأفوكادو وبيض وجبنة فيتا",
                time: "20 دقائق",
                calories: "720",
                icon: "salad",
                color: "#8BC34A",
                bodyType: "للنحيفين"
            }
        ];
    }
    
    // وجبات لإنقاص الوزن
    getWeightLossMeals() {
        return [
            {
                name: "فطور منخفض السعرات",
                description: "بيض مسلوق مع خضار مشكلة",
                time: "10 دقائق",
                calories: "220",
                icon: "carrot",
                color: "#FF5722",
                bodyType: "للبدناء"
            },
            {
                name: "سلطة البروتين النباتي",
                description: "كينوا مع حمص وخضروات ملونة",
                time: "15 دقائق",
                calories: "320",
                icon: "seedling",
                color: "#4CAF50",
                bodyType: "للبدناء"
            },
            {
                name: "شوربة الخضار بالدجاج",
                description: "شوربة خضار غنية بالألياف مع دجاج مسلوق",
                time: "25 دقائق",
                calories: "250",
                icon: "bowl-food",
                color: "#2196F3",
                bodyType: "للبدناء"
            },
            {
                name: "سمك مشوي مع خضار",
                description: "فيليه سمك مشوي مع خضار مطهية بالبخار",
                time: "20 دقائق",
                calories: "300",
                icon: "fish",
                color: "#00BCD4",
                bodyType: "للبدناء"
            }
        ];
    }
    
    // Meal templates (in a real app, these would come from a database)
        getVegetarianMeals() {
            return [
                {
                    name: "شوفان بالفواكه",
                    description: "شوفان مع حليب لون كامل وفواكه موسمية",
                    time: "10 دقائق",
                    calories: "300",
                    icon: "bowl-rice",
                    color: "#4CAF50"
                }
            ];
        }
    
        getKetoMeals() {
            return [
                {
                    name: "بيض وأفوكادو",
                    description: "بيض مقلي مع أفوكادو وجبنة",
                    time: "15 دقائق",
                    calories: "400",
                    icon: "egg",
                    color: "#FF9800"
                }
            ];
        }
    
        getMediterraneanMeals() {
            return [
                {
                    name: "سلطة يونانية",
                    description: "خضروات طازجة مع زيتون وجبنة فيتا",
                    time: "10 دقائق",
                    calories: "250",
                    icon: "leaf",
                    color: "#2196F3"
                }
            ];
        }
    
        getQuickMeals() {
            return [
                {
                    name: "سندويش تونة",
                    description: "تونة مع خضروات في خبز القمح الكامل",
                    time: "5 دقائق",
                    calories: "350",
                    icon: "bolt",
                    color: "#9C27B0"
                }
            ];
        }
    
        getDefaultMeals() {
            return [
                {
                    name: "وجبة متوازنة",
                    description: "أرز مع دجاج وخضروات",
                    time: "20 دقائق",
                    calories: "450",
                    icon: "utensils",
                    color: "#607D8B"
                }
            ];
        }
    
        getDietName(diet) {
            const dietNames = {
                'vegetarian': 'نباتي',
                'keto': 'كيتو',
                'mediterranean': 'متوسطي',
                'weightGain': 'زيادة الوزن',
                'weightLoss': 'إنقاص الوزن',
                'regular': 'متوازن'
            };
            return dietNames[diet] || 'متوازن';
        }
    
        getBodyTypeName(bodyType) {
            const bodyTypeNames = {
                'slim': 'النحيف',
                'overweight': 'البدين',
                'normal': 'المتوسط'
            };
            return bodyTypeNames[bodyType] || 'المتوسط';
        }
    }