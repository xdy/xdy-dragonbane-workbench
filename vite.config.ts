import {viteStaticCopy} from "vite-plugin-static-copy";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";
import moduleJSON from './static/module.json' with {type: 'json'};

const s_XDY_DB_WB_ID = `modules/${moduleJSON.id}`;

// const s_SVELTE_HASH_ID = 'xdbwb';

const s_COMPRESS = false;  // Set to true to compress the module bundle.
const s_SOURCEMAPS = true; // Generate sourcemaps for the bundle (recommended).

export default defineConfig(({mode}) => {
    // Provides a custom hash adding the string defined in `s_SVELTE_HASH_ID` to scoped Svelte styles;
    // This is reasonable to do as the framework styles in TRL compiled across `n` different packages will
    // be the same. Slightly modifying the hash ensures that your package has uniquely scoped styles for all
    // TRL components and makes it easier to review styles in the browser debugger.
    // const compilerOptions = mode === 'production' ? {
    //   cssHash: ({hash, css}: { hash: Function, css: string }) => `svelte-${s_SVELTE_HASH_ID}-${hash(css)}`
    // } : {};

    return {
        root: 'src/',                  // Source location / esbuild root.
        base: `/${s_XDY_DB_WB_ID}/dist`, // Base module path that 30001 / served dev directory.
        publicDir: "static",              // No public resources to copy.
        cacheDir: '../.vite-cache',    // Relative from root directory.

        resolve: {
            conditions: ['browser', 'import']
        },

        esbuild: {
            target: ['es2022']
        },

        css: {
            // // Creates a standard configuration for PostCSS with autoprefixer & postcss-preset-env.
            // postcss: postcssConfig({compress: s_COMPRESS, sourceMap: s_SOURCEMAPS})
        },

        // About server options:
        // - Set to `open` to boolean `false` to not open a browser window automatically. This is useful if you set up a
        // debugger instance in your IDE and launch it with the URL: 'http://localhost:30001/game'.
        //
        // - The top proxy entry redirects requests under the module path for `style.css` and following standard static
        // directories: `assets`, `lang`, and `packs` and will pull those resources from the main Foundry / 30000 server.
        // This is necessary to reference the dev resources as the root is `/src` and there is no public / static
        // resources served with this particular Vite configuration. Modify the proxy rule as necessary for your
        // static resources / project.
        server: {
            port: 30001,
            open: '/game',
            proxy: {
                // Serves static files from main Foundry server.
                [`^(/${s_XDY_DB_WB_ID}/(assets|lang|packs|dist/${moduleJSON.id}.css))`]: 'http://localhost:30000',

                // All other paths besides package ID path are served from main Foundry server.
                [`^(?!/${s_XDY_DB_WB_ID}/)`]: 'http://localhost:30000',

                // Rewrite incoming `module-id.js` request from Foundry to the dev server `index.ts`.
                [`/${s_XDY_DB_WB_ID}/dist/${moduleJSON.id}.js`]: {
                    target: `http://localhost:30001/${s_XDY_DB_WB_ID}/dist`,
                    rewrite: () => '/xdy-dragonbane-workbench.ts',
                },

                // Enable socket.io from main Foundry server.
                '/socket.io': {target: 'ws://localhost:30000', ws: true}
            }
        },
        build: {
            outDir: '../dist',
            emptyOutDir: true,
            sourcemap: s_SOURCEMAPS,
            brotliSize: true,
            minify: s_COMPRESS ? 'terser' : false,
            target: ['es2022'],
            // terserOptions: s_COMPRESS ? {...terserConfig(), ecma: 2022} : void 0,
            lib: {
                entry: './xdy-dragonbane-workbench.ts',
                formats: ['es'],
                fileName: moduleJSON.id
            },
            rollupOptions: {
                output: {
                    // Rewrite the default style.css to a more recognizable file name.
                    assetFileNames: (assetInfo) =>
                        assetInfo.name === 'style.css' ? `${moduleJSON.id}.css` : assetInfo.name as string,
                },
                watch: {
                    exclude: 'node_modules/**'
                }
            },
        },

        // Necessary when using the dev server for top-level await usage inside TRL.
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2022'
            }
        },

        plugins: [
            // svelte({
            //   compilerOptions,
            //   preprocess: sveltePreprocess()
            // }),
            checker({typescript: true}),
            tsconfigPaths(),
            ...viteStaticCopy({
                targets: [
                    {src: "../CHANGELOG.md", dest: "."},
                    {src: "../README.md", dest: "."},
                    {src: "../CONTRIBUTING.md", dest: "."},
                    {src: "../static/*", dest: "."},
                ],
                watch: {
                    reloadPageOnChange: true
                }
            }),
        ]
    };
});
