import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";

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

        prep_time_min: yup.number()
            .min(0, 'Отрицательное значение.')
            .required('Введите время приготовления (минуты).'),

        prep_time_hour: yup.number()
            .min(0, 'Отрицательное значение.')
            .required('Введите время приготовления (часы).'),

        servings: yup.number()
            .min(1, 'Не менее 1.')
            .required('Введите количество порций.'),

        category: yup.string()
            .required('Выберите категорию.'),

        ingredients: yup
            .array()
            .of(
                yup.object({
                    ingredient: yup
                        .string()
                        .trim()
                        .required("Название обязательно."),
                    quantity: yup
                        .number()
                        .min(0.1, "Отрицательное значение.")
                        .required("Введите количество."),
                    unit: yup
                        .string()
                        .required("Выберите единицу измерения."),
                })
            )
            .min(1, "Добавьте хотя бы один ингредиент."),

        steps: yup
            .array()
            .of(
                yup.object({
                    description: yup
                        .string()
                        .trim()
                        .required("Описание шага обязательно."),
                })
            )
            .min(1, "Добавьте хотя бы один шаг приготовления."),
    });

    // Инициализируем форму с данной схемой
    const { handleSubmit, isSubmitting} = useForm({ validationSchema: schema } );

    // Поля формы
    const {
        value: recipe_title,
        errorMessage: rtError,
        handleBlur: rtBlur,
    } = useField('recipe_title');

    const {
        value: description,
        errorMessage: descError,
        handleBlur: descBlur,
    } = useField('description');

    const {
        value: main_photo,
        errorMessage: mpError,
        handleBlur: mpBlur,
    } = useField('main_photo');

    const {
        value: prep_time_min,
        errorMessage: ptMinError,
        handleBlur: ptMinBlur,
    } = useField('prep_time_min');

    const {
        value: prep_time_hour,
        errorMessage: ptHourError,
        handleBlur: ptHourBlur,
    } = useField('prep_time_hour');

    const {
        value: servings,
        errorMessage: servError,
        handleBlur: servBlur,
    } = useField('servings');

    const {
        value: category,
        errorMessage: catError,
        handleBlur: catBlur,
    } = useField('category', undefined, {
        initialValue: ""
    });

    return {
        recipe_title,
        rtError,
        rtBlur,

        description,
        descError,
        descBlur,

        main_photo,
        mpError,
        mpBlur,

        prep_time_min,
        ptMinError,
        ptMinBlur,

        prep_time_hour,
        ptHourError,
        ptHourBlur,

        servings,
        servError,
        servBlur,

        category,
        catError,
        catBlur,

        isSubmitting,
        handleSubmit,
        backendErrors,
    };
}