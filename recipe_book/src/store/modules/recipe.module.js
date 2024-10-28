export default {
    namespaced: true,
    state: {
      recipes:[ 
        {
            id: 0,
            title: 'Спагетти Карбонара',
            description: 'Классическое итальянское блюдо из пасты.',
            author: 'Liza',
            image: require('@/assets/images/carbonara.jpg'),
            servings: 4,
            kkal: 378,
            prepTime: 40,
            ingredients: [
            { name: 'Спагетти', amount: 200, unit:'граммы' },
            { name: 'Яйца', amount: 2, unit:'шт' },
            { name: 'Бекон', amount: 100, unit:'граммы' },
            { name: 'Сыр пармезан', amount: 50, unit:'граммы' },
            { name: 'Сливки', amount: 50, unit:'миллилитры' }
            ],
            steps: [
            { description: 'Сколько и как правильно варить макароны (пасту)? В классическом виде паста должна быть в состоянии аль денте, полуготовая, слегка твердая внутри. Время ее варки очень зависит от состава и производителя. Обычно на упаковке указано примерное время варки - ориентируйтесь на него. Слейте воду через дуршлаг, а пасту сбрызните оливковым маслом и перемешайте. Можно накрыть кастрюлю крышкой, если соус к этому времени не готов.',
                image: require('@/assets/images/step1.jpg') },
            { description: 'Как нарезать бекон? Ломтики бекона нарежьте на кусочки квадратной формы. Подогрейте на сковороде масло и обжарьте бекон до золотистого цвета на среднем огне, помешивая все лопаточкой. При желании оливковое масло можно заменить любым другим. Следите, чтобы на сковороду не попала влага, иначе масло станет шипеть. Если жир с бекона стал потрескивать и брызгаться, убавьте огонь. как выбрать сковороду и масло читайте в статьях на эти темы в конце рецепта.',
                image: require('@/assets/images/step2.jpg') }
            ]
        },
        {
            id: 1,
            title: 'Куриное карри',
            description: 'Ароматное куриное карри со специями.',
            author: 'Liza',
            image: require('@/assets/images/carry.jpg'),
            servings: 4,
            kkal: 103,
            prepTime: 60,
            ingredients: [
                { name: 'Курица', amount: 200, unit:'граммы' },
                { name: 'Карри', amount: 1, unit:'щепотки' },
                { name: 'Кокосовое молоко', amount: 400, unit:'миллилитры' },
                { name: 'Лук', amount: 1, unit:'шт' },
                { name: 'Чеснок', amount: 2, unit:'зубчики' }
                ],
            steps: [
                { description: 'Первым делом нужно вымыть и обсушить грудку. Нарежьте ее некрупными кусочками.',
                    image: require('@/assets/images/step1.jpg') },
                { description: 'Очистите луковицу и сладкий перец. Выложите в чашу блендера.',
                    image: require('@/assets/images/step2.jpg') }
                ]
          },
          {
            id: 2,
            title: 'Салат Цезарь',
            description: 'Свежий салат с хрустящими листьями айсберга и соусом Цезарь.',
            author: 'Liza',
            image: require('@/assets/images/caesarsalad.jpg'),
            servings: 4,
            kkal: 203,
            prepTime: 35,
            ingredients: [
                { name: 'Листья салата', amount: 400, unit:'граммы' },
                { name: 'Курица', amount: 280, unit:'граммы' },
                { name: 'Сыр пармезан', amount: 80, unit:'граммы' },
                { name: 'Гренки', amount: 200, unit:'граммы' },
                { name: 'Соус Цезарь', amount: 300, unit:'граммы' },
                { name: 'Помидоры черри', amount: 10, unit:'шт' }
                ],
            steps: [
                { description: 'Куриное филе нарежьте на небольшие медальоны одинакового размера. Посолите и поперчите их.',
                    image: require('@/assets/images/caesarsaladStep1.jpg') },
                { description: 'Поджарьте филе на сковороде с небольшим количеством растительного масла с двух сторон до румяной корочки. Готовое филе снимите со сковороды и остудите.',
                    image: require('@/assets/images/caesarsaladStep2.jpg') }
                ]
          },
          {
            id: 3,
            title: 'Борщ',
            description: 'Традиционный украинский борщ со свеклой и мясом.',
            author: 'Liza',
            image: require('@/assets/images/borscht.jpg'),
            servings: 6,
            kkal: 58,
            prepTime: 50,
            ingredients: [
                { name: 'Свекла', amount: 400, unit:'граммы' },
                { name: 'Мясо', amount: 600, unit:'граммы' },
                { name: 'Картофель', amount: 3, unit:'шт' },
                { name: 'Морковь', amount: 1, unit:'шт' },
                { name: 'Капуста', amount: 200, unit:'граммы' },
                { name: 'Лук', amount: 1, unit:'шт' },
                { name: 'Томатная паста', amount: 2, unit:'столовые ложки' }
                ],
            steps: [
                { description: 'Свинину можно использовать любую часть. Но если варить свинину на кости, то бульон будет получаться более наваристый. Поместите свинину в холодную воду, доведите до кипения и варите 1-1,5 часа. При закипании снимайте пенку, которая будет появляться. Готовый бульон процедите. Мясо нарежьте на кусочки и верните в кастрюлю.',
                    image: require('@/assets/images/borschtStep1.jpg') },
                { description: 'Капусту нашинкуйте, а картофель нарежьте на кусочки.',
                    image: require('@/assets/images/borschtStep2.jpg') }
                ]
          },
          {
            id: 4,
            title: 'Плов',
            description: 'Узбекский плов с ароматными специями и мясом.',
            author: 'Liza',
            image: require('@/assets/images/plov.jpg'),
            servings: 4,
            kkal: 101,
            prepTime: 60,
            ingredients: [
                { name: 'Рис', amount: 300, unit: 'граммы' },
                { name: 'Мясо(баранина)', amount: 300, unit: 'граммы' },
                { name: 'Морковь', amount: 1, unit: 'шт' },
                { name: 'Чеснок', amount: 1, unit: 'зубчики' },
                { name: 'Лук', amount: 1, unit: 'шт' },
                { name: 'Зира', amount: 1, unit: 'чайные ложки' },
                { name: 'Шафран', amount: 1, unit: 'щепотки'}
                ],
            steps: [
                { description: 'Кипятком залейте сухой барбарис, пусть он размачивается. Рис нужно перебрать и хорошо промыть, затем откинуть на сито и дать стечь с него воде.',
                    image: require('@/assets/images/plovStep1.jpg') },
                { description: 'Поставьте казан на огонь, разогрейте и налейте в него масло. В разогретом подсолнечном масле обжарьте сначала лук, нарезанный полукольцами.',
                    image: require('@/assets/images/plovStep2.jpg') }
                ]
          },
          {
            id: 5,
            title: 'Пицца Маргарита',
            description:
              'Классическое итальянское блюдо с тонкой хрустящей корочкой, украшенное свежими томатами, сыром моцарелла и ароматным базиликом.',
            author: 'Liza',
            image: require('@/assets/images/margherita.jpg'),
            servings: 2,
            kkal: 253,
            prepTime: 60,
            ingredients: [
                { name: 'Пшеничная мука', amount: 195, unit:'граммы' },
                { name: 'Сухие дрожжи', amount: 1, unit:'шт' },
                { name: 'Сахар', amount: 1, unit:'столовые ложки' },
                { name: 'Соль', amount: 1, unit:'щепотки' },
                { name: 'Томатная паста', amount: 3, unit:'столовые ложки' },
                { name: 'Моцарелла', amount: 200, unit:'граммы' },
                { name: 'Помидоры черри', amount: 8, unit:'шт' },
                { name: 'Оливковое масло', amount: 4, unit:'столовые ложки' }
                ],
            steps: [
                { description: 'Начните приготовление пиццы с теста. Нагрейте воду до температуры 37-40 градусов. Растворите в ней сахар и добавьте дрожжи. Если нет кулинарного термометра температуру определите следующим способом: капните на внутреннюю сторону запястья каплю воды. Если ощущение нейтральное - значит температура правильная. Оставьте в теплом месте на 5-15 минут для активации дрожжей.',
                    image: require('@/assets/images/margheritaStep1.jpg') },
                { description: 'Добавьте в тесто соль, 2 столовых ложки оливкового масла и хорошо размешайте до однородности.',
                    image: require('@/assets/images/margheritaStep2.jpg') }
                ]
          }
    ],
      servings: 4, // Хранение текущего количества порций
    },
    getters: {
        // Возвращает все рецепты
        allRecipes: (state) => state.recipes,
        // Возвращает рецепт
        recipe: (state) => state.recipe,
        // Возвращает текущее количество порций
        servings: (state) => state.servings,
        // Пересчитывает ингредиенты на основе количества порций
        adjustedIngredients: (state) => {
            if (!state.recipe || !Array.isArray(state.recipe.ingredients)) {
              return [];
            }
          
            return state.recipe.ingredients.map((ingredient) => ({
              name: ingredient.name,
              amount: ((ingredient.amount / state.recipe.servings) * state.servings).toFixed(1),
              unit: ingredient.unit || '' // Добавьте единицу измерения, если она отсутствует
            }));
          },
        getRecipeById: (state) => (id) => {
            console.log(id)
            return state.recipes.find(recipe => Number(recipe.id) === id)|| null;
          },
    },
    mutations: {
        setRecipe(state, recipe) {
            state.recipe = recipe;
          },
      // Изменяет количество порций
      setServings(state, servings) {
        state.servings = Math.max(1, servings); // Минимум 1 порция
      },
    },
    actions: {
        // Устанавливаем текущий рецепт
        setRecipe({ commit }, recipe) {
            commit('setRecipe', recipe);
        },
      // Действие для изменения количества порций
      updateServings({ commit }, amount) {
        commit('setServings', amount);
      },
    },
  };