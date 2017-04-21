import Toggleable from '../../mixins/toggleable'

export default {
  name: 'dialog',

  mixins: [Toggleable],

  props: {
    persistent: Boolean,
    fullscreen: Boolean,
    overlay: {
      type: Boolean,
      default: true
    },
    removeTransition: Boolean,
    origin: {
      type: String,
      default: 'center center'
    },
    transition: {
      type: String,
      default: 'v-modal-transition'
    }
  },

  computed: {
    classes () {
      return {
        'dialog': true,
        'dialog--active': this.isActive,
        'dialog--persistent': this.persistent,
        'dialog--fullscreen': this.fullscreen,
        'dialog--stacked-actions': this.stackedActions && !this.fullscreen,
      }
    },
    computedTransition () {
      return this.removeTransition
        ? 'transition'
        : this.transition
    }
  },

  methods: {
    closeConditional (e) {
      // close dialog if !persistent and clicked outside
      return this.persistent ? false : true
    }
  },

  render (h) {
    const children = []
    const data = {
      'class': this.classes,
      ref: 'dialog',
      directives: [
        { name: 'click-outside', value: this.closeConditional },
        { name: 'show', value: this.isActive }
      ]
    }

    const card = h('v-card', [
      this.$slots.default,
    ])

    if (this.$slots.activator) {
      children.push(h('div', {
        'class': 'dialog__activator',
        on: {
          click: e => {
            e.stopPropagation()
            this.isActive = !this.isActive
          }
        }
      }, [this.$slots.activator]))
    }

    let dialog = h(this.computedTransition, {
      props: { origin: this.origin }
    }, [h('div', data, [card])])

    if (this.overlay) {
      dialog = h('v-overlay', {
        props: { value: this.isActive }
      }, [dialog])
    }

    children.push(dialog)

    return h('div', {
      'class': 'dialog__container'
    }, children)
  }
}