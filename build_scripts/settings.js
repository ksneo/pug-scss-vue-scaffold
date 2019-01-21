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
        pugSrc: [
            `${sourceGlob}/html/**/*.pug`,
            `${sourceGlob}/components/**/*.pug`
        ],
        htmlSrc: [
            `${sourceGlob}/html/**/*.html`,
            `${sourceGlob}/components/**/*.html`
        ],
        pug: [`${sourceGlob}/html/**/*.pug`],
        html: [`${sourceGlob}/html/**/*.html`], // только то, что надо собрать
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
        css: []
    }
};

export const buildSettings = {
    // prettier: 'prettier', 'prettydiff', 'beautifier'
    prettier: 'beautifier',
    browserSync: {
        // if true use browserSync dev server else use proxy
        // path to files from paths.dist.root settings;
        server: true,
        proxy: '127.0.0.1:8000'
    }
};

export const production = () => process.env.NODE_ENV === 'production';
