import './button-render.css';
import { defineComponent, PropType } from 'vue';
import { Button, ButtonRenderProps } from './index';
import { ElButtonGroup, ElButton, ElTooltip } from 'element-plus';

export default defineComponent({
  name: 'ButtonRender',

  props: {
    buttons: {
      type: Array as PropType<Array<Button>>,
      require: true,
      default: () => [],
    },
    buttonClick: {
      type: Function as PropType<(btn: Button) => void>,
      default: () => (item: any) => {
        console.log(item);
      },
    },
  },
  setup(props: ButtonRenderProps) {
    const globalClick = (item: any) => {
      if (props.buttonClick) {
        props.buttonClick(item);
      }
    };

    return () => (
      <div class="button-render">
        {props.buttons.map((item, index) => {
          if (item.type === 'group' && item.group) {
            return (
              <ElButtonGroup key={index}>
                {item.group.map((iten) => {
                  if (!iten.children) {
                    if (!iten.icon) {
                      return (
                        <ElButton
                          key={iten.label}
                          size="default"
                          type="primary"
                          {...{
                            onClick: (): void => (iten.action ? iten.action() : globalClick(iten)),
                          }}
                        >
                          {iten.label}
                        </ElButton>
                      );
                    } else {
                      return (
                        <ElTooltip effect="light" content={iten.label}>
                          <ElButton
                            key={iten.label}
                            size="default"
                            icon={iten.icon}
                            {...{
                              onClick: (): void =>
                                iten.action ? iten.action() : globalClick(iten),
                            }}
                          ></ElButton>
                        </ElTooltip>
                      );
                    }
                  } else {
                    return (
                      <ElTooltip
                        effect="light"
                        trigger="click"
                        v-slots={{
                          content: () => (
                            <div class="button-tooltip">
                              {iten.children &&
                                iten.children.map((child) => {
                                  return (
                                    <ElButton
                                      class="button"
                                      key={child.label}
                                      size="default"
                                      type="primary"
                                      {...{
                                        onClick: (): void =>
                                          child.action ? child.action() : globalClick(child),
                                      }}
                                    >
                                      {child.label}
                                    </ElButton>
                                  );
                                })}
                            </div>
                          ),
                        }}
                      >
                        <ElButton key={iten.label} size="default" type="primary">
                          {iten.label}
                        </ElButton>
                      </ElTooltip>
                    );
                  }
                })}
              </ElButtonGroup>
            );
          }
        })}
      </div>
    );
  },
});
