<template>
  <div class="results">
    <h3>Ваш индекс массы тела: {{ bmi }}
      <span :style="{ color: bmi < 18.5 ? 'orange' : bmi <= 24.9 ? 'green' : 'red' }">
          [{{ bmi < 18.5 ? 'Недостаток' : bmi <= 24.9 ? 'Норма' : 'Избыток' }}]
        </span>
    </h3>

    <h3>Ниже калькулятор рассчитал вашу норму калорий:</h3>
    <table>
      <tbody>
        <tr><td>Ваш базовый метаболизм (минимальная норма)</td><td>{{ calorieBase }}</td></tr>
        <tr><td>Норма калорий для поддержания веса</td><td>{{ calorieMaintain }}</td></tr>
        <tr><td>Дефицит калорий 20% (для похудения)</td><td>{{ calorieDeficit20 }}</td></tr>
        <tr><td>Дефицит калорий 15% (для похудения)</td><td>{{ calorieDeficit15 }}</td></tr>
      </tbody>
    </table>

    <h3>Теперь чтобы вы активно худели, вам необходимо питаться:</h3>
    <table>
      <tbody>
        <tr><td>От</td><td>{{ calorieDeficit20 }}</td></tr>
        <tr><td>До</td><td>{{ calorieDeficit15 }}</td></tr>
        <tr v-if="female"><td>В тяжёлые дни (ПМС, КД и т.д.)</td><td>{{ Math.round(calorieMaintain * 0.9) }}</td></tr>
      </tbody>
    </table>

    <h3>Ваши нормы белков, жиров и углеводов!</h3>
    <table>
      <tbody>
        <tr><td></td><td>От</td><td>До</td></tr>
        <tr><td>Ваша норма белков</td><td>{{ proteinRange[0] }}</td><td>{{ proteinRange[1] }}</td></tr>
        <tr><td>Ваша норма жиров</td><td>{{ fatRange[0] }}</td><td>{{ fatRange[1] }}</td></tr>
        <tr><td>Ваша норма углеводов</td><td>{{ carbRange[0] }}</td><td>{{ carbRange[1] }}</td></tr>
        <tr><td>Ваша норма сахара</td><td>{{ sugarRange[0] }}</td><td>{{ sugarRange[1] }}</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  bmi: Number,
  calorieBase: Number,
  calorieMaintain: Number,
  calorieDeficit15: Number,
  calorieDeficit20: Number,
  proteinRange: Array,
  fatRange: Array,
  carbRange: Array,
  sugarRange: Array,
  female: {
    type: Boolean,
    default: false
  }
})

</script>

<style scoped>
.results table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse; /* Объединяем границы */
}

.results td {
  padding: 6px 10px;
  opacity: 0.8;
  border: 1px solid #ccc;
}
</style>