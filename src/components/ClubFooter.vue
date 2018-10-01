<template>
  <transition appear name="v--mask">
    <footer v-once class="club__footer">
      <a class="signature" href="https://vuejs.org" target="_blank">
        <img src="../assets/vue-snip.svg"/>
      </a>
    </footer>
  </transition>
</template>

<script>
export default { name: 'club-footer' }
</script>
