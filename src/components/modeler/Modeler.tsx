import './modeler.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import { defineComponent, onMounted } from 'vue';
import TokenSimulationModule from 'bpmn-js-token-simulation'; // 流程模拟
import minimapModule from 'diagram-js-minimap'; // 小地图
import createDefaultBpmnXml from '../../bpmn/defaultBpmnXml';
import activitiModel from '../../bpmn/resources/activiti-model.json';
import translate from '../../bpmn/i18n';
import customControlsModule from '../../bpmn/customControls';
import { BpmnStore } from '@/bpmn/store';

export default defineComponent({
  name: 'Modeler',
  setup() {
    const bpmnContext = BpmnStore;
    onMounted(() => {
      bpmnContext.initModeler({
        container: '#modeler-container',
        additionalModules: [
          //添加翻译
          { translate: ['value', translate('zh')] },
          customControlsModule,
          TokenSimulationModule,
          minimapModule,
        ],
        moddleExtensions: {
          activiti: activitiModel,
        },
        // minimap: {
        //   open: true,
        // },
      });
      const defaultProcessIdAndName = '1';
      bpmnContext
        .importXML(createDefaultBpmnXml(defaultProcessIdAndName, defaultProcessIdAndName))
        .then((result: Array<string>) => {
          if (result.length) {
            // console.warn('importSuccess warnings', result);
          }
        })
        .catch((err: any) => {
          // console.warn('importFail errors ', err);
        });
    });

    return () => <div id="modeler-container" />;
  },
});
