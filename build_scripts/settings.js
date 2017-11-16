import path from 'path';

const project_dir = path.dirname(__dirname);

export const root = {
    src: `${project_dir}/src`,
    dist: `${project_dir}/dist`,
    tmp: `${project_dir}/tmp`
}

export const paths = {
    src: {
        root: `${root.src}`,
        html: `${root.src}/html`,
        js: `${root.src}/js`,
        css: `${root.src}/css`,
        static: `${root.src}/static`,
        components: `${root.src}/components`
    },
    dist: {
        root: `${root.dist}`,
        js: `${root.dist}/js`,
        css: `${root.dist}/css`,
        font: `${root.dist}/fonts`
    },
    node: {
        modules: `${project_dir}/node_modules`
    }
}
export const resource = {
    src: {
        pug: `${paths.src.html}/**/*.pug`,
        webpack: {
            babel: `${paths.src.js}/entry/**/*.js`
        },
        sass: `${paths.src.css}/**/*.s+(a|c)ss`,
        static: `${paths.src.static}/**/*`,
        components: `${paths.src.components}`
    },
    vendor: {
        js: {
            jquery: `${paths.node.modules}/jquery/dist/jquery.js`,
            lodash: `${paths.node.modules}/lodash/lodash.js`,
            moment: `${paths.node.modules}/moment/moment.js`,
            flatpickr: `${paths.node.modules}/flatpickr/dist/flatpickr.js`,
            vue: `${paths.node.modules}/vue/dist/vue.js`,
            bootstrap: `${paths.node.modules}/bootstrap-sass/assets/javascripts/bootstrap.js`
        },
        css: [`${paths.node.modules}/flatpickr/dist/flatpickr.min.css`],
        fontawesome: `${paths.node.modules}/font-awesome/fonts/**/*`
    }
}
