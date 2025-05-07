import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref } from "vue";
import { useStore } from 'vuex';

export function UseProfileChangeForm() {
    const PASSWORD_MIN_LENGTH = 8;

    const { handleSubmit, isSubmitting } = useForm({
        validationSchema: yup.object({
            oldPassword: yup.string()
                .nullable()
                .trim()
                .when(['newPassword', 'confirmPassword'], {
                    is: (newPassword, confirmPassword) => newPassword || confirmPassword,
                    then: (schema) => schema.required('Старый пароль обязателен для изменения пароля.'),
                    otherwise: (schema) => schema.notRequired() // Поле не обязательно, если newPassword и confirmPassword пустые
                }),

            newPassword: yup.string()
                .nullable()
                .trim()
                .min(PASSWORD_MIN_LENGTH, `Минимум ${PASSWORD_MIN_LENGTH} символов.`)
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    'Пароль должен состоять из цифр, заглавных и строчных латинских букв.'
                )
                .notRequired(), // Поле не обязательно

            confirmPassword: yup.string()
                .trim()
                .nullable()
                .oneOf([yup.ref('newPassword'), null], 'Пароли не совпадают')
                .when('newPassword', {
                    is: (newPassword) => !!newPassword, // Проверяем, ввёл ли пользователь новый пароль
                    then: (schema) => schema.required('Подтвердите пароль'),
                    otherwise: (schema) => schema.notRequired() // Поле не обязательно, если `newPassword` пустое
                }),
        }),

        initialValues: {
            newPassword: null,
            confirmPassword: null,
            oldPassword: null
        },

        context: { values: { newPassword: null, confirmPassword: null, oldPassword: null } } // Явно передаем контекст
    });

    const store = useStore();
    const error = ref(null);
    const successMessage = ref(null);

    // Поля профиля
    const { value: username, errorMessage: usernameError, handleBlur: usernameBlur } = useField(
        'username',
        yup
            .string()
            .trim()
            .matches(/^[a-zA-Z0-9_-]+$/, 'Имя может состоять только из заглавных и строчных латинских букв, цифр, знаков _ и -.')
    );

    const { value: email, errorMessage: emailError, handleBlur: emailBlur } = useField(
        'email',
        yup
            .string()
            .trim()
            .email('Некорректный email.')
    );

    // Поля пароля
    const { value: oldPassword, errorMessage: oldPasswordError, handleBlur: oldPasswordBlur } = useField(
        'oldPassword'
    );


    const { value: newPassword, errorMessage: newPasswordError, handleBlur: newPasswordBlur } = useField(
        'newPassword'
    );

    const { value: confirmPassword, errorMessage: confirmPasswordError, handleBlur: confirmPasswordBlur } = useField(
        'confirmPassword'
    );

    // Обработка файла аватара
    const avatar = ref(null);
    const previewAvatar = ref(null);
    const avatarLoaded = ref(false);
    const avatarError = ref(false);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (previewAvatar.value) {
                URL.revokeObjectURL(previewAvatar.value); // Освобождаем старый объект
            }
            avatar.value = file;
            previewAvatar.value = URL.createObjectURL(file);
        }
    };

    const handleAvatarLoad = () => {
        setTimeout(() => {
            avatarLoaded.value = true;
        }, 150); // небольшая задержка для плавности
    };

    const handleAvatarError = () => {
        avatarError.value = true;
    };

    // Объект для ошибок бэкенда
    const backendErrors = ref({
        username: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: ''
    });

    const onSubmit = handleSubmit(async (values) => {
        try {
            Object.keys(backendErrors.value).forEach(key => backendErrors.value[key] = ''); // Сбрасываем ошибки перед отправкой
            const formData = new FormData();

            // Добавляем только заполненные поля
            if (values.username) formData.append('username', values.username);
            if (values.email) formData.append('email', values.email);
            console.log("avatar value:", avatar.value)

            if (avatar.value) formData.append('avatar', avatar.value);

            // Обновляем профиль
            await store.dispatch('user/updateUser', formData);

            // Если заполнены все поля пароля, меняем его
            if (values.oldPassword && values.newPassword && values.confirmPassword) {
                await store.dispatch('auth/changePassword', {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword
                });
            }

            // Обновление данных пользователя
            await store.dispatch('user/fetchUser');

            // Сброс полей
            avatar.value = null;
            previewAvatar.value = null;
            oldPassword.value = null;
            newPassword.value = null;
            confirmPassword.value = null;

            successMessage.value = 'Данные успешно обновлены!';
            console.log(successMessage.value)
            error.value = null;

        } catch (error) {
            console.log("DEBUG: Данные ответа:", error.response?.data);
            if (error.response?.data) {
                // Обрабатываем ошибки валидации Django
                const fieldMap = {
                    new_password: 'newPassword',
                    old_password: 'oldPassword',
                    new_password2: 'confirmPassword'
                };

                for (const [field, messages] of Object.entries(error.response.data)) {
                    const mappedField = fieldMap[field] || field;
                    if (backendErrors.value.hasOwnProperty(mappedField)) {
                        backendErrors.value[mappedField] = Array.isArray(messages)
                            ? messages.join(', ')
                            : messages;
                    }
                }
            }
            // Пробрасываем ошибку дальше, чтобы её можно было обработать в onEdit
            throw error;
        }
    });

    return {
        // Поля формы
        username,
        email,
        avatar,
        previewAvatar,
        oldPassword,
        newPassword,
        confirmPassword,

        // Ошибки валидации
        usernameError,
        emailError,
        oldPasswordError,
        newPasswordError,
        confirmPasswordError,
        backendErrors,

        // Обработчики
        usernameBlur,
        emailBlur,
        oldPasswordBlur,
        newPasswordBlur,
        confirmPasswordBlur,
        handleAvatarChange,
        handleAvatarLoad,
        handleAvatarError,
        avatarLoaded,
        avatarError,

        // Форма
        onSubmit,
        isSubmitting,
        error,
        successMessage
    };
}