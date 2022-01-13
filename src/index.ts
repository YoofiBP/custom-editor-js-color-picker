import Editor from '@editorjs/editorjs';
import Color from "./color";
import $ from 'jquery';

const editor = new Editor({
        holder: 'editorjs',
    tools: {
            color: {
                class: Color,
                config: {
                    colors: [
                        '#4287f5',
                        '#FF1300',
                        '#EC7878',
                        '#9C27B0',
                        '#673AB7',
                        '#3F51B5',
                        '#0070FF',
                        '#03A9F4',
                        '#00BCD4',
                        '#4CAF50',
                        '#8BC34A',
                        '#CDDC39',
                        '#FFF',
                        '#000000',
                    ]
                }
            }
    },
    data: {
            blocks: [
                {
                    "id" : "sjzUuvzM4X",
                    "type" : "paragraph",
                    "data" : {
                        "text" : "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text."
                    }
                },
            ]
    }
    }
)
