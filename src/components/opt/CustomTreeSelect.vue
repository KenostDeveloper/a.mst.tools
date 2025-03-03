<template>
    <div class="tree-select" ref="treeSelectContainer">
      <div class="tree-select__input" @click="toggleDropdown">
        <span v-if="selectedLabels.length">{{ selectedLabels.join(', ') }}</span>
        <span v-else class="placeholder">{{ placeholder }}</span>
        <i class="icon-chevron-down"></i>
      </div>
  
      <div v-if="dropdownVisible" class="tree-select__dropdown">
        <input v-model="filter" class="tree-select__search" placeholder="Поиск..." />
  
        <ul class="tree-select__list">
          <TreeNode 
            v-for="node in filteredTreeData" 
            :key="node.key" 
            :node="node" 
            v-model="selectedKeys"
            :disabledKeys="disabledKeys"
          />
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import TreeNode from './TreeNode.vue';
  
  export default {
    name: "CustomTreeSelect",
    components: { TreeNode },
    props: {
      modelValue: {
        type: Array,
        default: () => [],
      },
      options: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        default: "Выберите элементы"
      },
      allSelectedKeys: { // Передаём ВСЕ выбранные ключи
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        dropdownVisible: false,
        filter: "",
        selectedKeys: Array.isArray(this.modelValue) ? [...this.modelValue] : []
      };
    },
    computed: {
      filteredTreeData() {
        if (!this.filter) return this.options;
        return this.filterTree(this.options, this.filter.toLowerCase());
      },
      selectedLabels() {
        return this.selectedKeys.map(key => this.findNodeLabel(this.options, key)).filter(Boolean);
      },
      disabledKeys() {
        // Запрещаем выбирать те ключи, которые есть в `allSelectedKeys`, но не принадлежат текущему `selectedKeys`
        return this.allSelectedKeys.filter(key => !this.selectedKeys.includes(key));
      }
    },
    watch: {
      selectedKeys(newVal) {
        this.$emit('update:modelValue', newVal);
      }
    },
    methods: {
      toggleDropdown() {
        this.dropdownVisible = !this.dropdownVisible;
      },
      filterTree(nodes, filter) {
        return nodes
          .map(node => {
            if (node.label.toLowerCase().includes(filter)) return node;
            if (node.children) {
              const filteredChildren = this.filterTree(node.children, filter);
              if (filteredChildren.length) return { ...node, children: filteredChildren };
            }
            return null;
          })
          .filter(Boolean);
      },
      findNodeLabel(nodes, key) {
        for (let node of nodes) {
          if (node.key === key) return node.label;
          if (node.children) {
            const found = this.findNodeLabel(node.children, key);
            if (found) return found;
          }
        }
        return null;
      },
      // Закрыть dropdown, если клик был вне компонента
      closeDropdown(event) {
        if (!this.$refs.treeSelectContainer.contains(event.target)) {
          this.dropdownVisible = false;
        }
      }
    },
    mounted() {
      // Добавляем обработчик клика на весь документ
      document.addEventListener('click', this.closeDropdown);
    },
    beforeDestroy() {
      // Убираем обработчик клика на документ перед уничтожением компонента
      document.removeEventListener('click', this.closeDropdown);
    }
  };
  </script>

  
  <style scoped>
  /* Корневой контейнер */
  .tree-select {
    position: relative;
    width: 100%;
  }
  
  /* Поле ввода */
  .tree-select__input {
    padding: 10px 12px;
    border: 1px solid var(--surface-border);
    border-radius: 4px;
    background: var(--surface-ground);
    color: var(--text-color);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  }
  
  .tree-select__input:hover {
    border-color: var(--primary-color);
    background-color: var(--surface-hover);
  }
  
  /* Стрелка вниз */
  .tree-select__input i {
    font-size: 14px;
    color: var(--text-color-secondary);
    transition: transform 0.2s ease-in-out;
  }
  
  .tree-select__input.open i {
    transform: rotate(180deg);
  }
  
  /* Выпадающий список */
  .tree-select__dropdown {
    position: absolute;
    width: 100%;
    background: var(--surface-overlay);
    border: 1px solid var(--surface-border);
    border-radius: 4px;
    margin-top: 5px;
    box-shadow: var(--shadow-2);
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
    animation: fadeIn 0.2s ease-in-out;
  }
  
  /* Анимация появления */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Поле поиска */
  .tree-select__search {
    width: 100%;
    padding: 12px;
    border: none;
    border-bottom: 1px solid var(--surface-border);
    font-size: 14px;
    color: var(--text-color);
    outline: none;
    transition: background-color 0.2s ease-in-out;
  }
  
  .tree-select__search:focus {
    background-color: var(--surface-hover);
  }
  
  /* Список элементов */
  .tree-select__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  /* Плейсхолдер */
  .placeholder {
    color: var(--text-color-secondary);
    font-size: 14px;
  }
  </style>
  
  