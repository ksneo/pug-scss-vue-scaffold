import './_style.scss';

export default {
    name: 'vue-multifile',
    data() {
        return {
            hiMultifile: 'Hello multifile'
        };
    },
    template: require('./template.html')
};
