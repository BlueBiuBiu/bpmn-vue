import { defineComponent, reactive, watch, isRef } from 'vue';
import { BpmnStore } from '@/bpmn/store';
import DynamicBinder from '../../components/dynamic-binder';
import { ElCollapse, ElCollapseItem, ElTooltip } from 'element-plus';
import { GroupProperties } from '@/bpmn/config';
import './panel.css';
import { Fold, Expand } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'Panel',
  setup() {
    const bpmnContext = BpmnStore;
    const contextState = bpmnContext.getState();

    //动态数据绑定器的字段变化后更新到xml，视图刷新
    //需要注意，如果字段定义里边属性定义了`setValue`方法，则不会进这里了
    function onFieldChange(key: string, value: unknown): void {
      const shape = bpmnContext.getShape();
      if (!shape) {
        return;
      }
      bpmnContext.updateProperties(shape, { [key]: isRef(value) ? value.value : value });
    }

    const panelState = reactive({
      //活动的数据配置组
      elCollapses: Object.assign([]),
      //panel面板的开关
      shrinkageOff: true,
    });

    //打开所有抽屉
    watch(
      () => contextState.activeBindDefine,
      () => {
        console.log('contextState.activeBindDefine', contextState.activeBindDefine);

        if (contextState.activeBindDefine) {
          panelState.shrinkageOff = false;
          panelState.elCollapses = contextState.activeBindDefine.map((groupItem) => groupItem.name);
        } else {
          panelState.shrinkageOff = true;
        }
      },
    );

    // 监听面板变化改变BPMN.IO图标位置
    watch(
      () => panelState.shrinkageOff,
      () => {
        if (panelState.shrinkageOff) {
          (document.querySelector('.bjs-powered-by') as HTMLElement).style.right = '15px';
        } else {
          (document.querySelector('.bjs-powered-by') as HTMLElement).style.right =
            'calc(25% + 15px)';
        }
      },
    );

    /**
     * 获取字段配置组的插槽
     * @param groupItem 组对象项
     */
    function getSlotObject(groupItem: GroupProperties) {
      return {
        title: () => (
          <div class="group-title-block">
            {groupItem.icon && <i class={groupItem.icon} />}
            {groupItem.name}
          </div>
        ),
        default: () => (
          <DynamicBinder
            {...{ onFieldChange: onFieldChange }}
            fieldDefineProps={groupItem.properties}
            v-model={contextState.businessObject}
          />
        ),
      };
    }

    return () => (
      <>
        {contextState.businessObject && contextState.activeBindDefine && (
          <>
            <div
              class="bpmn-panel-shrinkage"
              onClick={() => (panelState.shrinkageOff = !panelState.shrinkageOff)}
            >
              {panelState.shrinkageOff ? (
                <ElTooltip effect="light" content="展开属性面板">
                  <Fold />
                </ElTooltip>
              ) : (
                <ElTooltip effect="light" content="收起属性面板">
                  <Expand />
                </ElTooltip>
              )}
            </div>
            <div class="bpmn-panel" v-show={!panelState.shrinkageOff}>
              <div class="title">{bpmnContext.getActiveElementName()}</div>
              <ElCollapse class="bpmn-panel-collapse" v-model={panelState.elCollapses}>
                {contextState.activeBindDefine.map((groupItem) => {
                  return (
                    <ElCollapseItem name={groupItem.name} v-slots={getSlotObject(groupItem)} />
                  );
                })}
              </ElCollapse>
            </div>
          </>
        )}
      </>
    );
  },
});
