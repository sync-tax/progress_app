<script setup>
import ModuleTitle from '../components/ModuleTitle.vue'

let timeNeeded = 0
let expNeeded = 0
//exp progression shananigans
const test = () => {
  for (let i = 1; i <= 80; i++) {
    let temp = Math.floor(60 * 1.1 ** i)
    expNeeded += temp
    console.log(temp)
  }
  timeNeeded =  Math.floor(expNeeded / 180)
}
test()

console.log('expNeeded', expNeeded)
console.log('timeNeeded', timeNeeded)

timeNeeded = 0
expNeeded = 0

</script>

<template>
  <ModuleTitle title="Timer" />
  <div>
    <p>Time needed: {{ timeNeeded }}h</p>
    <p>EXP needed: {{ expNeeded }}xp</p>
  </div>
</template>