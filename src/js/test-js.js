import Vue from 'vue';
import { b } from './test-typescript.ts';
import VueComponent from '../components/vue-component/component.vue';
import MultiFileComponent from '../components/vue-multifile-component';

// this construction for cheat eslint
(() =>
    new Vue({
        el: '#app',
        components: {
            VueComponent,
            MultiFileComponent
        },
        data() {
            return {
                prop: b
            };
        },
        template: '<div><VueComponent /><MultiFileComponent /></div>'
    }))();
