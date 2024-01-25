import { createApp } from 'vue';
import App from './App';
import './index.css';
import ElementPlus from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/dist/index.css';
import './iconfont.js';
import { renderWithQiankun, qiankunWindow, QiankunProps } from 'vite-plugin-qiankun/dist/helper';
import { BpmnStore } from './bpmn/store';
import { organizationList, roleList } from '@/qiankun';

const render = (props: QiankunProps = {}) => {
  const { container } = props;
  // 如果是在主应用的环境下就挂载主应用的节点，否则挂载到本地
  const appDom = container ? container : '#app';
  const app = createApp(App);
  app.use(ElementPlus);
  app.mount(appDom);
};

const initQianKun = () => {
  renderWithQiankun({
    bootstrap() {
      console.log('微应用：bootstrap');
    },
    mount(props) {
      // 获取主应用传入数据
      console.log('微应用：mount', props);
      props.onGlobalStateChange(async (state: any) => {
        const organization = state.organizationList;
        const role = state.roleList;
        const modelXML = state.modelXML;

        if (organization.length) {
          organizationList.value = organization;
        }
        if (role.length) {
          roleList.value = role;
        }

        if (modelXML) {
          BpmnStore.importXML(modelXML);
        }

        if (state.getXmlAndSvg) {
          const xml = await BpmnStore.getXML();
          const svg = await BpmnStore.getSVG();
          props.setGlobalState({ xml: xml.xml, svg: svg.svg, getXmlAndSvg: false });
        }
      });
      render(props);
      props.setGlobalState({ bpmnContext: BpmnStore });
    },
    unmount(props) {
      // console.log('微应用：unmount', props);
    },
    update(props) {
      // console.log('微应用：update', props);
    },
  });
};

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render(); // 判断是否使用 qiankun ，保证项目可以独立运行
