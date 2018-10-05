<template>
  <nav class="nav">
    <h1 v-if="$device.phone" class="nav__title" style="height: 4.5rem;">
      <router-link to="/" style="text-decoration: none; !important; color: #333333">
        {{ content.title }}
        <p style="font-size: 1.5rem; font-weight: 400; margin-top: .5rem; margin-bottom: .5rem">
          MLZJ CLUB ASSOCIATION
        </p>
      </router-link>
    </h1>
    <h1 v-if="!$device.phone" class="nav__title" style="height: 4.5rem;">
    <img style="position: absolute; width: 4.5rem; height: 4.5rem;" src="../../static/icons/garlands.svg"/>
    <router-link to="/" style="margin-left: 5.5rem; text-decoration: none; !important; color: #333333">
      {{ content.title }}
      <p style="margin-left: 5.5rem; font-size: 1.5rem; font-weight: 400; margin-top: .5rem; margin-bottom: .5rem">
        MLZJ CLUB ASSOCIATION
      </p>
    </router-link>
  </h1>

    <transition-group tag="menu" name="nav__item" class="nav__menu">
      <li v-for="label in labels" class="nav__item" :key="label" @click="navBack">
        <i class="nav__item--icon"></i>
        <span class="nav__item--label">{{ label }}</span>
      </li>
    </transition-group>
  </nav>
</template>

<script>
export default {
  name: 'club-nav',
  props: {
    navs: Number,
    content: Object,
    filters: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    labels() {
      return Object.keys(this.filters)
        .map(filter => this.content.labels[filter])
    }
  },

  methods: {
    navBack() {
      if (this.navs && !this.filters.author) this.$router.go(-1)
      else this.$router.push('/')
    }
  }
}
</script>
