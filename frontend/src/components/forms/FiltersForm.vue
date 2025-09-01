<template>
    <div class="filter">
        <label for="category">Категория</label>

        <select v-model="localSelectedCategory"
                class="filter-input">
            <option value="">Любая категория</option>            
            <option v-for="category in categories"
                    :key="category.id"
                    :value="category.id">
                {{ category.category_name }}
            </option>
        </select>
    </div>
    
    <div class="filter">
        <AppInput
            label="Включить ингредиенты"
            name="include-ingredients"
            iD="include-ingredients"
            type="text"
            v-model="localIncludeQuery"
            input-class="filter-input"
            placeholder="Введите ингредиент"
            @keydown.enter.prevent="addIngredient(localIncludeQuery, 'include')"
        />
        
        <ul v-if="includeSuggestions.length" 
            class="suggestions">
            <li v-for="item in includeSuggestions" 
                :key="item.id" 
                @click="addIngredient(item.ingredient_name, 'include')">
                {{ item.ingredient_name }}
            </li>
        </ul>
        
        <div class="selected-tags">
            <span v-for="(ingredient, index) in includeIngredients" 
                  :key="index" 
                  class="tag">
                {{ ingredient }} 
                <button @click="removeIngredient(index, 'include')">&times;</button>
            </span>
        </div>
    </div>

    <div class="filter">
        <AppInput
            label="Исключить ингредиенты"
            name="exclude-ingredients"
            iD="exclude-ingredients"
            type="text"
            v-model="localExcludeQuery"
            input-class="filter-input"
            placeholder="Введите ингредиент"
            @keydown.enter.prevent="addIngredient(localExcludeQuery, 'exclude')"
        />
        
        <ul v-if="excludeSuggestions.length" 
            class="suggestions">
            <li v-for="item in excludeSuggestions" 
                :key="item.id" 
                @click="addIngredient(item.ingredient_name, 'exclude')">
                {{ item.ingredient_name }}
            </li>
        </ul>
        
        <div class="selected-tags">
            <span v-for="(ingredient, index) in excludeIngredients" 
                  :key="index" 
                  class="tag">
                {{ ingredient }}
                <button @click="removeIngredient(index, 'exclude')">&times;</button>
            </span>
        </div>
    </div>
    
    <div class="filter">
        <AppInput
            label="Калорийность (не более)"
            name="calories"
            iD="calories"
            type="number"
            v-model.number="localMaxCalories"
            input-class="filter-input"
            placeholder="Введите калории" />
    </div>

    <AppButton @click="applyFilters" 
               class="select-button">Подобрать рецепты</AppButton>
    
    <AppButton v-if="filtersChanged" 
               @click="resetFilters" 
               class="select-button">Сбросить</AppButton>
</template>

<script setup>
import { computed, ref, toRefs, watch } from 'vue';
import axios from 'axios';
import {
    AppButton,
    AppInput,
} from '@ui';

const props = defineProps({
    categories: { 
        type: Array, 
        default: () => [],
    },
    selectedCategory: {
        type: String,
        default: '',
    },
    includeQuery: String,
    excludeQuery: String,
    includeIngredients: {
        type: Array,
        default: () => [],
    },
    excludeIngredients: {
        type: Array,
        default: () => [],
    },
    maxCalories: {
        type: Number,
        default: null,
    },
    includeSuggestions: {
        type: Array,
        default: () => [],
    },
    excludeSuggestions: {
        type: Array,
        default: () => [],
    },
    filtersChanged: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits([
    'update:selectedCategory',
    'update:includeQuery',
    'update:excludeQuery',
    'update:includeIngredients',
    'update:excludeIngredients',
    'update:maxCalories',
    'fetch-ingredients',
    'add-ingredient',
    'remove-ingredient',
    'apply-filters',
    'reset-filters',
]);

const includeSuggestions = ref(...props.includeSuggestions);
const excludeSuggestions = ref(...props.excludeSuggestions);
const loading = ref(false);

const localIncludeQuery = computed({
    get: () => props.includeQuery,
    set: (value) => emit('update:includeQuery', value),
});

const localExcludeQuery = computed({
    get: () => props.excludeQuery,
    set: (value) => emit('update:excludeQuery', value),
});

const localSelectedCategory = computed({
    get: () => props.selectedCategory,
    set: value => emit('update:selectedCategory', value),
});

const localMaxCalories = computed({
    get: () => props.maxCalories,
    set: value => emit('update:maxCalories', value),
});

watch(localIncludeQuery, v => fetchIngredients(v, 'include'));
watch(localExcludeQuery, v => fetchIngredients(v, 'exclude'));

const {
    categories,
    includeIngredients,
    excludeIngredients,
    filtersChanged,
} = toRefs(props);

// Получение ингредиентов с автодополнением
const fetchIngredients = async (query, type) => {
    if (!query || query.length < 2) {
        includeSuggestions.value = [];
        excludeSuggestions.value = [];
        return;
    }

    loading.value = true;
    try {
        const { data } = await axios.get(`http://localhost/api/ingredients/?query=${query}`);
        if (type === 'include') {
            includeSuggestions.value = data;
        }
        else {
            excludeSuggestions.value = data;
        }
    } catch (e) {
        console.error('Ошибка при получении ингредиентов:', e);
    } finally {
        loading.value = false;
    }
};

// Добавление ингредиента в список
const addIngredient = (name, type) => {
    if (!name.trim()) {
        return;
    }

    if (type === 'include') {
        emit('update:includeIngredients', [...props.includeIngredients, name]);
        localIncludeQuery.value = '';
        includeSuggestions.value = [];
    } else {
        emit('update:excludeIngredients', [...props.excludeIngredients, name]);
        localExcludeQuery.value = '';
        excludeSuggestions.value = [];
    }
};

// Удаление ингредиента
const removeIngredient = (index, type) => {
    const list = type === 'include' ? [...props.includeIngredients] : [...props.excludeIngredients];
    list.splice(index, 1);
    emit(type === 'include'
        ? 'update:includeIngredients'
        : 'update:excludeIngredients', list);
};

function applyFilters() {
    emit('apply-filters');
}

function resetFilters() {
    emit('update:selectedCategory', '');
    emit('update:includeIngredients', []);
    emit('update:excludeIngredients', []);
    emit('update:maxCalories', null);
    localIncludeQuery.value = '';
    localExcludeQuery.value = '';
    emit('reset-filters');
}
</script>

<style scoped>
.filter {
    position: relative;

    min-width: 200px;
    display: flex;
    flex-direction: column;
}

.filter label {
    margin-bottom: 3px;
}

.filter-input {
    padding: 8px;
    font-size: 14px;

    border: 1px solid #333;
    border-radius: 5px;
}

.selected-tags {
    margin-top: 5px;
}

.selected-tags:empty {
    margin-top: 0;
}

.tag {
    display: inline-flex;
    align-items: center;
    margin-right: 5px;
    margin-bottom: 2px;
    padding: 5px 10px;

    font-size: 12px;

    border-radius: 15px;
    background: #ddd;
}

.tag button {
    margin-left: 5px;

    background: none;
    border: none;

    cursor: pointer;
}

@media (max-width: 970px) {
    .filters-container {
        justify-content: start;
    }
}
</style>
