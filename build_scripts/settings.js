import path from 'path';

const projectDir = path.dirname(__dirname);
const sourceGlob = 'src';
const distGlob = 'client/static';
export const root = {
    src: path.join(projectDir, sourceGlob),
    dist: path.join(projectDir, distGlob),
    tmp: path.join(projectDir, 'tmp')
};

export const paths = {
    src: {
        root: root.src,
        html: path.join(root.src, 'html'),
        js: path.join(root.src, 'js'),
        css: path.join(root.src, 'css'),
        static: path.join(root.src, 'static'),
        components: path.join(root.src, 'components'),
        data: path.join(root.src, 'data')
    },
    dist: {
        root: root.dist,
        js: path.join(root.dist, 'js'),
        css: path.join(root.dist, 'css'),
        font: path.join(root.dist, 'fonts')
    },
    node: {
        modules: `${projectDir}/node_modules`
    }
};
// globs for watch
export const resource = {
    src: {
        pug: [
            `${sourceGlob}/html/**/*.pug`,
            `${sourceGlob}/components/**/*.pug`
        ],
        html: `${sourceGlob}/html/**/*.pug`, // только то, что надо собрать
        webpack: {
            babel: [
                `${sourceGlob}/js/**/*.js`,
                `${sourceGlob}/js/**/*.ts`,
                `!${sourceGlob}/js/vendors/*.js`
            ]
        },
        sass: `${sourceGlob}/**/*.s+(a|c)ss`,
        static: `${sourceGlob}/static/**/*.*`,
        components: `${sourceGlob}/components`
    },
    dist: {
        html: `${distGlob}/**/*.html`
    },
    vendor: {
        js: {
            jquery: `${paths.node.modules}/jquery/dist/jquery.js`,
            bootstrap: `${paths.node.modules}/bootstrap/dist/js/bootstrap.js`
        },
        css: [],
        fontawesome: `${paths.node.modules}/font-awesome/fonts/**/*`
    }
};
export const production = () => process.env.NODE_ENV === 'production';
