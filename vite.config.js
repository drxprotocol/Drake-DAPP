import { defineConfig } from 'vite';
import { join } from 'path';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import { visualizer } from 'rollup-plugin-visualizer';
import eslint from 'vite-plugin-eslint';
import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        viteCommonjs({
            skipPreBuild: true,
        }),
        visualizer({
            emitFile: true,
            filename: 'status.html',
            open: true,
        }),
        eslint(),
    ],
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_debugger: true,
                drop_console: true,
            },
        },
        outDir: 'build',
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                }),
                esbuildCommonjs(['tiny-slider', 'tiny-slider-react'])
            ],
        },
    },
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
            '@assets': join(__dirname, 'src/assets'),
            '@components': join(__dirname, 'src/components'),
            contract: join(__dirname, 'src/contract'),
            components: join(__dirname, 'src/components'),
            '@modules': join(__dirname, 'src/modules'),
            '@layouts': join(__dirname, 'src/layouts'),
            layouts: join(__dirname, 'src/layouts'),
            '@pages': join(__dirname, 'src/pages'),
            pages: join(__dirname, 'src/pages'),
            '@utils': join(__dirname, 'src/utils'),
            utils: join(__dirname, 'src/utils'),
            '@stores': join(__dirname, 'src/stores'),
            '@hooks': join(__dirname, 'src/hooks'),
            hooks: join(__dirname, 'src/hooks'),
        },
    },
    server: {
        proxy: {

        },
        port: 9026,
        host: '0.0.0.0',
    },
    define: {
        'process.env': {},
    },
});
