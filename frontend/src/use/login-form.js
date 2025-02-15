import {useField, useForm} from 'vee-validate'; // Библиотека для валидации форм
import * as yup from 'yup'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export function UseLoginForm(){
    const{handleSubmit, isSubmitting} = useForm()

    const store = useStore()
    const router = useRouter()

   

    const {value: email, errorMessage: eError, handleBlur: eBlur} = useField(
        'mail',
        yup
            .string() // Интересует тип данных "строка"
            .trim() // Чтобы не учитывались пробелы
            .required('Пожалуйста, введите e-mail') // Поле обязательное
            .email('Необходимо ввести корректный e-mail') // Является почтой
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
            // Чтобы не происходило редиректа (не изменялся url), если введен неверный пароль
        }
    })

    return{
        email,
        password,
        eError,
        pError,
        eBlur,
        pBlur,
        onSubmit,
        isSubmitting
    }
}