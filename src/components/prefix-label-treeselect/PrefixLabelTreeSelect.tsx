import { ElTreeSelect } from 'element-plus';
import { defineComponent, PropType, computed } from 'vue';
import './prefix-label-treeselect.css';

const PrefixLabelTreeSelect = defineComponent({
  props: {
    ...ElTreeSelect.props,
    treeData: {
      type: Array<any>,
      default: () => [{}],
    },
    prefixTitle: {
      type: String as PropType<string>,
      default: () => '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const computedModelValue = computed({
      get: () => props.value,
      set: (val) => emit('update:modelValue', val),
    });

    return () => (
      <div class="prefix-label-tree-select-container">
        {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}
        <ElTreeSelect
          class="prefix-label-tree-select"
          filterable
          v-model={computedModelValue.value}
          {...props}
          data={props.treeData}
        />
      </div>
    );
  },
});

export default PrefixLabelTreeSelect;
