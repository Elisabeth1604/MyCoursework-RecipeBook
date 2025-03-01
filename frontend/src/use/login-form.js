import {useField, useForm} from 'vee-validate'; // Библиотека для валидации форм
import * as yup from 'yup'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {ref} from "vue";


export function UseLoginForm(){
    const{handleSubmit, isSubmitting} = useForm()

    const store = useStore()
    const router = useRouter()
    const loginError = ref(null);

    const {value: username, errorMessage: uError, handleBlur: uBlur} = useField(
        'username',
        yup
            .string() // Интересует тип данных "строка"
            .trim() // Чтобы не учитывались пробелы
            .required('Пожалуйста, введите имя пользователя') // Поле обязательное
            .matches(/^[a-zA-Z0-9_-]+$/, 'Имя пользователя может содержать только буквы, цифры, _ и -')
        )

    const PASSWORD_MIN_LENGTH = 6

    const {value: password, errorMessage: pError, handleBlur: pBlur} = useField(
        'password',
         yup
            .string() // Интересует тип данных "строка"
            .trim() // Чтобы не учитывались пробелы
            .required('Пожалуйста, введите пароль') // Поле обязательное
            .min(PASSWORD_MIN_LENGTH, `Пароль не может быть меньше ${PASSWORD_MIN_LENGTH} символов`) // Пароль дожен состоять минимум из 6 символов
    )

    // Обработка формы
    const onSubmit = handleSubmit(async values =>{
        try{
            console.log('Form:', values)
            await store.dispatch('auth/login', values) // Метод login находится в actions, поэтому вызываем dispatch
            router.push('/') // Чтобы после авторизации приложение пересылало на страницу какую либо (добавить какую!!! пока на главную пусть)
        } catch(e){
            loginError.value = 'Неверное имя пользователя или пароль'; // Чтобы не происходило редиректа (не изменялся url), если введен неверный пароль
        }
    })

    return{
        username,
        password,
        uError,
        pError,
        uBlur,
        pBlur,
        onSubmit,
        isSubmitting,
        loginError,
    }
}