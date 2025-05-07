<template>
  <div class="container">
    <div v-if="!showResults">
    <h2>Калькулятор КБЖУ</h2>
      <p class="subtitle">
        Рассчитайте сколько калорий, белков, жиров и углеводов вам нужно потреблять ежедневно для поддержания веса, похудения или набора массы.
      </p>
      <!-- Пол и параметры -->
      <section>
        <h3 class="section-title">Общая информация:</h3>
        <div class="gender-buttons">
          <app-button
              :class="gender === 'female' ? 'active' : 'inactive'"
              @click="gender = 'female'"
          >Женщина</app-button>
          <app-button
              :class="gender === 'male' ? 'active' : 'inactive'"
              @click="gender = 'male'"
          >Мужчина</app-button>
        </div>
        <div class="inputs">
          <app-input
              label="Возраст"
              iD="age"
              v-model="ageField"
              type="number"
              input-class="class-input"
              placeholder="Возраст, лет"
              :error="ageError"
              @blur="ageBlur"
              required/>
          <app-input
              label="Рост"
              iD="height"
              v-model="heightField"
              type="number"
              input-class="class-input"
              placeholder="Рост, см"
              :error="heightError"
              @blur="heightBlur"
              required/>
          <app-input
              label="Вес"
              iD="weight"
              v-model="weightField"
              type="number"
              input-class="class-input"
              placeholder="Вес, кг"
              :error="weightError"
              @blur="weightBlur"
              required/>
        </div>
      </section>

      <!-- Активность -->
      <section>
        <h3 class="section-title">Дневная активность:</h3>
        <input
            type="range"
            min="0" max="4"
            v-model.number="activityIndex"
            class="slider"
        />
        <p class="activity-label">{{ activityLevels[activityIndex].label }}</p>
        <p class="activity-desc">{{ activityLevels[activityIndex].description }}</p>
      </section>

      <!-- Цель -->
      <section>
        <h3 class="section-title">Ваша цель:</h3>
        <div class="goal-buttons">
          <app-button v-for="g in goals" :key="g.value"
                      :class=" goal === g.value ? 'active' : 'inactive' "
                      @click="goal = g.value">
            {{ g.label }}
          </app-button>
        </div>
      </section>

      <!-- Формула -->
      <section>
        <h3 class="section-title">Формула расчета:
          <app-button class="info-button" @click="showModal = true">
            <img :src="require('@/assets/icons/information.png')">
          </app-button>
        </h3>
        <div class="formula-buttons">
          <app-button v-for="f in formulas" :key="f.value"
                      :class=" formula === f.value ? 'active' : 'inactive'"
                      @click="formula = f.value">
            {{ f.label }}
          </app-button>
        </div>
      </section>

      <app-button
          @click="onCalculate">Рассчитать</app-button>

    <calories-modal
        v-if="showModal"
        @click.self="showModal = false"/>

    </div>
    <app-calories-results
        v-else
        :bmi="bmi"
        :calorie-base="calorieBase"
        :calorie-deficit15="calorieDeficit15"
        :calorie-deficit20="calorieDeficit20"
        :calorie-maintain="calorieMaintain"
        :protein-range="proteinRange"
        :carb-range="carbRange"
        :fat-range="fatRange"
        :sugar-range="sugarRange"
        :female="isFemale()"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";
import AppCaloriesResults from "@/components/AppCaloriesResults.vue";
import CaloriesModal from "@/modal/CaloriesModal.vue";
import { useCaloriesForm } from "@/use/calories-form";



const { ageField, ageError, ageBlur,
  heightField, heightError, heightBlur,
  weightField, weightError, weightBlur,
  handleSubmit } = useCaloriesForm();

const gender = ref('female')
const activityIndex = ref(2)
const goal = ref('lose')
const formula = ref('harris')
const result = ref(null)
const showModal = ref(false)
const showResults = ref(false)

// Результаты
const bmi = ref(0)
const calorieBase = ref(0)
const calorieMaintain = ref(0)
const calorieDeficit15 = ref(0)
const calorieDeficit20 = ref(0)

const proteinRange = ref([0, 0])
const fatRange = ref([0, 0])
const carbRange = ref([0, 0])
const sugarRange = ref([0, 0])

const activityLevels = [
  { label: 'Минимальная', ratio: 1.2, description: 'Нет или минимальная активность' },
  { label: 'Низкая', ratio: 1.375, description: 'Легкие тренировки 1-3 раза в неделю' },
  { label: 'Умеренная', ratio: 1.55, description: 'Тренировки 3–5 раз в неделю' },
  { label: 'Высокая', ratio: 1.725, description: 'Спорт 6–7 раз в неделю' },
  { label: 'Очень высокая', ratio: 1.9, description: 'Тренировки 2 раза в день или физическая работа' }
]

const goals = [
  { value: 'lose', label: 'Сбросить вес' },
  { value: 'maintain', label: 'Поддерживать вес' },
  { value: 'gain', label: 'Набрать вес' },
]

const formulas = [
  { value: 'harris', label: 'Харриса-Бенедикта' },
  { value: 'mifflin', label: 'Миффлина-Сан Жеора' },
]

const isFemale = () => {
  return gender.value === 'female';
}


const calculate = (values) => {
  let bmr = 0
  if (formula.value === 'harris') {
    bmr = gender.value === 'female'
        ? 447.593 + (9.247 * weightField.value) + (3.098 * heightField.value) - (4.33 * ageField.value)
        : 88.362 + (13.397 * weightField.value) + (4.799 * heightField.value) - (5.677 * ageField.value)
  } else {
    bmr = gender.value === 'female'
        ? 10 * weightField.value + 6.25 * heightField.value - 5 * ageField.value - 161
        : 10 * weightField.value + 6.25 * heightField.value - 5 * ageField.value + 5
  }

  let calories = bmr * activityLevels[activityIndex.value].ratio

  if (goal.value === 'lose') calories *= 0.85
  else if (goal.value === 'gain') calories *= 1.15

  result.value = Math.round(calories)

  const h = heightField.value / 100;
  bmi.value = parseFloat((weightField.value / (h * h)).toFixed(1))


  calorieBase.value = Math.round(10 * weightField.value + 6.25 * heightField.value - 5 * ageField.value + 5)
  calorieMaintain.value = Math.round(calorieBase.value * 1.25)
  calorieDeficit20.value = Math.round(calorieMaintain.value * 0.8)
  calorieDeficit15.value = Math.round(calorieMaintain.value * 0.85)

  proteinRange.value = [Math.round(weightField.value * 1.6), Math.round(weightField.value * 2.2)]
  fatRange.value = [Math.round(weightField.value * 0.9), Math.round(weightField.value * 1.2)]
  carbRange.value = [Math.round(weightField.value * 2.2), Math.round(weightField.value * 2.9)]
  sugarRange.value = [Math.round(weightField.value * 0.4), Math.round(weightField.value * 0.6)]

  showResults.value = true

}
const onCalculate = handleSubmit(calculate)
</script>

<style scoped>
.container{
  margin-top: 110px;
}
.subtitle {
  color: #555;
  margin-bottom: 24px;
}
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.gender-buttons, .goal-buttons, .formula-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}
.inputs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}
.active {
  padding: 8px 16px;
  border-radius: 9px;
  background: #E2396F;
  font-weight: bold;
  height: 40px;
  width: 190px;
  cursor: pointer;
}
.inactive{
  padding: 8px 16px;
  border-radius: 9px;
  background: #F18EAD;
  height: 40px;
  width: 190px;
  cursor: pointer;
}
.calculate-btn {
  background: #28a745;
  color: white;
  font-weight: bold;
  margin-top: 16px;
}

.activity-label {
  font-weight: 500;
  margin-top: 6px;
}
.activity-desc {
  font-size: 13px;
  color: #777;
}
.info-button {
  background: white;
  padding: 0px 0 0 0;
  border-radius: 50%;
  margin-left: 6px;
  box-shadow: 0 0 0 ;
}

.info-button img {
  height: 30px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 8px;
  background: linear-gradient(to right, #ff4e42 0%, #ffa600 25%, #f7e400 50%, #63d457 75%, #1aab8b 100%);
  outline: none;
  transition: background 0.3s;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background: white;
  border: 2px solid #ccc;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  margin-top: -3px; /* Центрирование относительно трека */
}

.slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  border: 2px solid #ccc;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>