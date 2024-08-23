<template>
  <vue-final-modal
  v-slot="{ params, close }"
  v-bind="$attrs"
  classes="modal-container"
  content-class="modal-content"
  @closed="closed"
  >
    <span class="modal__title">
      <slot name="title"></slot>
    </span>
    <div class="modal__content">
      <slot :params="params"></slot>
    </div>
    <button class="modal__close" @click="close">
      <mdicon name="close" />
    </button>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

export default {
  name: 'CustomModal',
  inheritAttrs: false,
  emits: ['confirm', 'cancel', 'close'],
  components: {
    VueFinalModal
  },
  methods: {
    closed () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 700px;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px 0;
}
.modal__action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
  .dart-btn{
    & + .dart-btn{
      margin-left: 5px;
    }
  }
}
.modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
}
.dark-mode div ::v-deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
