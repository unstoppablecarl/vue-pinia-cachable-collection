import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import dts from 'vite-plugin-dts';
import {BootstrapVueNextResolver} from 'bootstrap-vue-next'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
    base: '/vue-pinia-cachable-collection/',
    plugins: [
        vue(),
        vueDevTools(),
        Components({
            resolvers: [BootstrapVueNextResolver()],
        }),
        dts({
            include: ['src/**/*.ts', 'src/**/*.tsx'], // Include paths for declaration files
        }),
    ],
})