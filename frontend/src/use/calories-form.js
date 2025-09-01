import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export const caloriesFormSchema = yup.object({
    age: yup
        .number()
        // Разрешить пустое поле через transform(), чтобы пустая строка автоматически превращалась в undefined (и required сработал правильно)
        .transform(value => (isNaN(value) ? undefined : value))
        .required('Возраст обязателен')
        .min(10, 'Минимальный возраст — 10 лет')
        .max(120, 'Максимальный возраст — 120 лет'),

    height: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('Рост обязателен')
        .min(50, 'Минимальный рост — 50 см')
        .max(300, 'Максимальный рост — 300 см'),

    weight: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('Вес обязателен')
        .min(20, 'Минимальный вес — 20 кг')
        .max(400, 'Максимальный вес — 400 кг'),
});

// Функция, которую можно использовать в компонентах
export function useCaloriesForm() {
    const { handleSubmit } = useForm({
        validationSchema: caloriesFormSchema,
    });

    const { value: ageField, errorMessage: ageError, handleBlur: ageBlur } = useField('age');
    const { value: heightField, errorMessage: heightError, handleBlur: heightBlur } = useField('height');
    const { value: weightField, errorMessage: weightError, handleBlur: weightBlur } = useField('weight');


    return {
        ageField,
        ageError,
        ageBlur,
        heightField,
        heightError,
        heightBlur,
        weightField,
        weightError,
        weightBlur,
        handleSubmit,
    };
}
