<template>
    <svg class="svg-icon">
        <use :xlink:href="'#icon-'+iconFileName"></use>
    </svg>
</template>

<script setup>
  import { defineProps } from 'vue';
  const props = defineProps({
    iconFileName:{
      type: String,
      require: true
    }
  })
</script>
<style lang="less" scoped>
.svg-icon{
  fill: currentColor;
}
</style>


