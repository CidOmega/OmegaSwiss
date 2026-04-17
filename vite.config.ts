// noinspection JSUnusedGlobalSymbols

import {defineConfig} from 'vite'
import * as fs from "node:fs";

// https://vitejs.dev/config/
export default defineConfig(() => {
    let files = fs
        .readdirSync(__dirname)
        .filter(f => f.endsWith('.html'));

    return {
        base: './',
        build: {
            rollupOptions: {
                input: files,
            },
        },
    }
})
