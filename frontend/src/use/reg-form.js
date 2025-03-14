import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import {ref} from "vue";

export function useRegForm() {
    const PASSWORD_MIN_LENGTH = 8;

    // Схема валидации
    const schema = yup.object({
        username: yup.string()
            .required('Обязательное поле.')
            .matches(/^[a-zA-Z0-9_-]+$/, 'Имя может состоять только из заглавных и строчных латинских букв, цифр, знаков _ и -.'),
        email: yup.string()
            .required('Обязательное поле.')
            .email('Некорректный email'),
        password: yup.string()
            .required('Обязательное поле.')
            .min(PASSWORD_MIN_LENGTH, `Минимум ${PASSWORD_MIN_LENGTH} символов.`)
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Пароль должен состоять из цифр, заглавных и строчных латинских букв.'
            ),
        confirmPassword: yup.string()
            .required('Обязательное поле.')
            .oneOf([yup.ref('password')], 'Пароли не совпадают.')
    });

    const { handleSubmit, isSubmitting } = useForm({
        validationSchema: schema,
    });

    // Поля формы
    const { value: usernameValue, errorMessage: usernameError, handleBlur: usernameBlur } = useField('username');
    const { value: emailValue, errorMessage: emailError, handleBlur: emailBlur } = useField('email');
    const { value: passwordValue, errorMessage: passwordError, handleBlur: passwordBlur } = useField('password');
    const { value: confirmPasswordValue, errorMessage: confirmPasswordError, handleBlur: confirmPasswordBlur } = useField('confirmPassword');

    const backendErrors = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    return {
        // Поля формы
        usernameValue,
        emailValue,
        passwordValue,
        confirmPasswordValue,

        // Ошибки валидации
        usernameError,
        emailError,
        passwordError,
        confirmPasswordError,

        // Обработчики blur
        usernameBlur,
        emailBlur,
        passwordBlur,
        confirmPasswordBlur,

        // Ошибки бэкенда
        backendErrors,

        // Состояние отправки формы
        isSubmitting,

        // Метод для отправки формы
        handleSubmit,
    };
}