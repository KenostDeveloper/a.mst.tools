<template>
  <li class="tree-node">
      <div class="tree-node__label">
          <Checkbox 
            :inputId="'checkbox-' + node.key"
            :modelValue="selectedKeys.includes(node.key)"
            :binary="true"
            :value="node.key"
            :disabled="node.disabled || disabledKeys.includes(node.key)"
            @update:modelValue="toggleSelection"
          />
          <button 
              v-if="node.children && node.children.length" 
              @click.stop="toggleExpand"
          >
              <i :class="expanded ? 'pi pi-angle-up' : 'pi pi-angle-down'"></i>
          </button>
          <span :class="{ 'disabled-text': node.disabled || disabledKeys.includes(node.key) }">
              {{ node.label }}
              <span v-if="inactiveChildrenCount > 0" class="inactive-count">
                  (Занято: {{ inactiveChildrenCount }})
              </span>
          </span>
      </div>

      <ul v-if="expanded && node.children && node.children.length" class="tree-node__children">
          <TreeNode 
              v-for="child in node.children" 
              :key="child.key" 
              :node="child" 
              v-model="selectedKeys"
              :disabledKeys="disabledKeys"
          />
      </ul>
  </li>
</template>

<script>
import Checkbox from 'primevue/checkbox';

export default {
  name: "TreeNode",
  components: { Checkbox },
  props: {
      node: Object,
      modelValue: Array,
      disabledKeys: Array
  },
  data() {
      return {
          expanded: false
      };
  },
  computed: {
      selectedKeys: {
          get() {
              return this.modelValue;
          },
          set(value) {
              this.$emit("update:modelValue", value);
          }
      },
      isChecked() {
          return this.selectedKeys.includes(this.node.key);
      },
      inactiveChildrenCount() {
          if (!this.node.children || this.node.children.length === 0) return 0;

          return this.node.children.filter(child => 
              child.disabled || this.disabledKeys.includes(child.key)
          ).length;
      }
  },
  methods: {
      toggleExpand() {
          this.expanded = !this.expanded;
      },
      toggleSelection() {
          if (this.node.disabled || this.disabledKeys.includes(this.node.key)) return;

          let newSelectedKeys = [...this.selectedKeys];

          const selectAllChildren = (node) => {
              if (!node.disabled && !this.disabledKeys.includes(node.key)) {
                  newSelectedKeys.push(node.key);
              }
              if (node.children) {
                  node.children.forEach(selectAllChildren);
              }
          };

          const deselectAllChildren = (node) => {
              newSelectedKeys = newSelectedKeys.filter(key => key !== node.key);
              if (node.children) {
                  node.children.forEach(deselectAllChildren);
              }
          };

          if (!this.isChecked) {
              selectAllChildren(this.node);
          } else {
              deselectAllChildren(this.node);
          }

          this.selectedKeys = [...new Set(newSelectedKeys)];
      }
  }
};
</script>

  
  <style scoped>
  .tree-node {
    list-style: none;
    padding-left: 0;
  }
  
  .tree-node__label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
  
  .tree-node__label:hover {
    background-color: var(--surface-hover);
  }
  
  .tree-node__label input[type="checkbox"] {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid var(--primary-color);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  
  .tree-node__label input[type="checkbox"]:checked {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    position: relative;
  }
  
  .tree-node__label input[type="checkbox"]:checked::after {
    content: "✔";
    font-size: 12px;
    color: white;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .tree-node__label input[type="checkbox"]:disabled {
    background-color: var(--surface-disabled);
    border-color: var(--surface-border);
    cursor: not-allowed;
  }
  
  .tree-node__label span {
    font-size: 14px;
    color: var(--text-color);
    user-select: none;
  }
  
  .tree-node__label button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: var(--primary-color);
    transition: color 0.2s ease-in-out;
  }
  
  .tree-node__label button:hover {
    color: var(--primary-dark);
  }
  
  .tree-node__children {
    margin-left: 16px;
    border-left: 2px solid var(--surface-border);
    padding-left: 8px;
  }
  
  .disabled-text {
    color: var(--text-color-secondary);
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .inactive-count {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-left: 5px;
  }
  </style>
  