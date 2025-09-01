import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { computed, ref } from 'vue';

export function useAddRecipeForm() {
    // Объект для ошибок, возвращаемых бэкендом, например, если recipe_title не уникален
    const backendErrors = ref({
        recipe_title: '',
    });

    const schema = yup.object({
        recipe_title: yup.string()
            .trim()
            .required('Название рецепта обязательно.'),

        description: yup.string()
            .trim()
            .required('Описание обязательно.'),

        servings: yup.number()
            .min(1, 'Не менее 1.')
            .typeError('Введите количество порций.')
            .required('Введите количество порций.'),

        category: yup.string()
            .required('Выберите категорию.')
            .notOneOf([''], 'Категория обязательна.'),

        ingredients: yup
            .array()
            .of(
                yup.object({
                    ingredient: yup
                        .string()
                        .trim()
                        .required('Название обязательно.'),
                    quantity: yup
                        .number()
                        .min(0.1, 'Отрицательное значение.')
                        .required('Введите количество.'),
                    unit: yup
                        .string()
                        .required('Выберите единицу измерения.'),
                }),
            )
            .min(1, 'Добавьте хотя бы один ингредиент.'),

        steps: yup
            .array()
            .of(
                yup.object({
                    description: yup
                        .string()
                        .trim()
                        .required('Описание шага обязательно.'),
                }),
            )
            .min(1, 'Добавьте хотя бы один шаг приготовления.'),
    });

    // Инициализируем форму с данной схемой
    const { handleSubmit, isSubmitting, resetForm } = useForm({
        validationSchema: schema,
    } );

    // Поля формы
    const {
        value: recipe_title,
        errorMessage: rtError,
        handleBlur: rtBlur,
        meta: rtMeta,
    } = useField('recipe_title', undefined);

    const rtDisplayError = computed(() => rtMeta.touched ? rtError.value : '');

    const {
        value: description,
        errorMessage: descError,
        handleBlur: descBlur,
        meta: descMeta,
    } = useField('description', undefined);

    const descDisplayError = computed(() => descMeta.touched ? descError.value : '');

    const {
        value: servings,
        errorMessage: servError,
        handleBlur: servBlur,
        meta: servMeta,
    } = useField('servings',undefined, {
        initialValue: null,
    });

    const servDisplayError = computed(() => servMeta.touched ? servError.value : '');

    const {
        value: category,
        errorMessage: catError,
        handleBlur: catBlur,
        meta: catMeta,
    } = useField('category', undefined, {
        initialValue: '',
    });

    const catDisplayError = computed(() => catMeta.touched ? catError.value : '');

    return {
        recipe_title,
        rtError,
        rtBlur,
        rtDisplayError,

        description,
        descError,
        descBlur,
        descDisplayError,

        servings,
        servError,
        servBlur,
        servDisplayError,

        category,
        catError,
        catBlur,
        catDisplayError,

        isSubmitting,
        handleSubmit,
        backendErrors,
        resetForm,
    };
}
