import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import qiankun from 'vite-plugin-qiankun';
import html from '@rollup/plugin-html';

//直接获取文件的text
function rawTransform(fileRegex: Array<RegExp>): {
  name: string;
  transform: (src: string, id: string) => string | void;
} {
  return {
    name: 'get-file-raw',
    transform(src, id): string | void {
      if (fileRegex.filter((re) => re.test(id)).length > 0) {
        return `export default ${JSON.stringify(src)}`;
      }
    },
  };
}

export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? '/' : 'http://192.168.2.246:10019/',
  server: {
    host: '0.0.0.0',
    port: 10019,
    headers: {
      'Access-Control-Allow-Origin': '*', // 主应用获取子应用时跨域响应头
    },
  },
  optimizeDeps: {
    //声明深度路径模块
    include: [
      'bpmn-js/lib/Modeler',
      'highlight.js',
      'codemirror',
      'codemirror/mode/xml/xml.js',
      'codemirror/addon/hint/xml-hint.js',
      'bpmn-js/lib/features/label-editing/LabelUtil.js',
    ],
  },
  plugins: [
    vue(),
    rawTransform([/\.bpmn$/]),
    vueJsx(),
    qiankun('bpmnjs', {
      useDevMode: true,
    }),
    html({
      // copy 自 https://github.com/rollup/plugins/blob/db4a3f2e8ebd3328b5d43bcb272589866dfd5729/packages/html/src/index.ts#L34
      template: ({ attributes, files, meta, publicPath }) => {
        const makeHtmlAttributes = (attributes) => {
          if (!attributes) {
            return '';
          }
          const keys = Object.keys(attributes);
          return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '');
        };
        const scripts = (files.js || [])
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.script);
            return `
            <script>
              if (!('process' in window)) {
                window.process = {
                    env: {
                        DEBUG: undefined
                    }
                }
              }
            </script>
            <script src="${publicPath}${fileName}"${attrs}></script>`;
          })
          .join('\n');

        const links = (files.css || [])
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.link);
            return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
          })
          .join('\n');

        const metas = meta
          .map((input) => {
            const attrs = makeHtmlAttributes(input);
            return `<meta${attrs}>`;
          })
          .join('\n');

        return `
        <!doctype html>
        <html${makeHtmlAttributes(attributes.html)}>
          <head>
            ${metas}
            <title>bpmnjs</title>
            ${links}
            <link href="./style.css" rel="stylesheet"></link>
          </head>
          <body>
            <div id="app"></div>
            ${scripts}
          </body>
        </html>`;
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
  build: {
    target: 'esnext',
    lib: {
      name: 'bpmnjs',
      fileName: 'bpmnjs',
      entry: 'src/main.ts',
      formats: ['umd'],
    },
  },
});
