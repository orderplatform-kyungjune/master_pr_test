import { resolve } from 'path';
import svgLoader from 'vite-svg-loader';
import Layouts from 'vite-plugin-vue-layouts';
import VueDevTools from 'vite-plugin-vue-devtools';
import { VitePluginRadar } from 'vite-plugin-radar';
import Pages from 'vite-plugin-pages';
import { defineConfig, UserConfig } from 'vite';
import VitePluginTurboConsole from 'unplugin-turbo-console/vite';
import vue from '@vitejs/plugin-vue';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    vue(),
    VueDevTools(),
    svgLoader(),
    Pages({
      extensions: ['vue'],
      exclude: ['**/Components/**/*', '**/Containers/**/*'],
      importMode: () => 'async',
    }),
    Layouts({
      layoutsDirs: 'src/layouts/',
      defaultLayout: 'default',
      importMode: () => 'async',
    }),
    VitePluginRadar({ gtm: [{ id: 'GTM-KHQHD4QG' }] }),
    VitePluginTurboConsole(),
    {
      name: 'add-onerror-to-scripts',
      transformIndexHtml: {
        enforce: 'post',
        transform(html) {
          return html.replace(/\.js"><\/script>/g, '.js" onerror="handleScriptError()"></script>');
        },
      },
    },
  ];

  if (mode === 'production') {
    plugins.push(
      sentryVitePlugin({
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        org: 'torder',
        project: 'torder-master-2',
        release: { name: process.env.VITE_SENTRY_RELEASE || 'local-dev' },
      }),
    );
  }

  return {
    build: { sourcemap: true },
    base: './',
    resolve: {
      alias: {
        '~/': resolve(__dirname, 'src'),
        '@router': resolve(__dirname, './src/router'),
        '@views': resolve(__dirname, './src/views'),
        '@utils': resolve(__dirname, './src/utils'),
        '@store': resolve(__dirname, './src/store'),
        '@composable': resolve(__dirname, './src/composable'),
        '@common': resolve(__dirname, './src/common'),
        '@assets': resolve(__dirname, './src/assets'),
        '@styles': resolve(__dirname, './src/styles'),
        '@apis': resolve(__dirname, './src/apis'),
        '@interfaces': resolve(__dirname, './src/interfaces'),
        '@pages': resolve(__dirname, './src/pages'),
        '@layouts': resolve(__dirname, './src/layouts'),
        '@i18n': resolve(__dirname, './src/i18n'),
      },
    },
    plugins,
  } as UserConfig;
});
