import { useField, useForm } from 'vee-validate';
import * as yup from 'yup'
import { ref } from "vue";
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'


export function UseLoginForm(){
    const PASSWORD_MIN_LENGTH = 8

    const store = useStore()
    const router = useRouter()
    const loginError = ref(null);

    const { handleSubmit, isSubmitting} = useForm()

    const {value: username, errorMessage: uError, handleBlur: uBlur} = useField(
        'username',
        yup
            .string()
            .trim()
            .required('Пожалуйста, введите имя пользователя')
            .matches(/^[a-zA-Z0-9_-]+$/, 'Имя пользователя может содержать только буквы, цифры, _ и -')
        )

    const {value: password, errorMessage: pError, handleBlur: pBlur} = useField(
        'password',
         yup
            .string()
            .trim()
            .required('Пожалуйста, введите пароль')
            .min(PASSWORD_MIN_LENGTH, `Пароль не может быть меньше ${PASSWORD_MIN_LENGTH} символов`)
    )

    const onSubmit = handleSubmit(async values =>{
        try{
            console.log('Form:', values)
            await store.dispatch('auth/login', values)
            // Чтобы после авторизации приложение пересылало на страницу какую либо (!!добавить какую!!! пока на главную пусть)
            router.push('/')
        } catch(e){
            loginError.value = 'Неверное имя пользователя или пароль'; // Чтобы не происходило редиректа (не изменялся url), если введен неверный пароль
        }
    })

    return{
        // Поля формы
        username,
        password,

        // Ошибки валидации
        uError,
        pError,

        // Обработчики
        uBlur,
        pBlur,

        onSubmit,
        isSubmitting,
        loginError,
    }
}