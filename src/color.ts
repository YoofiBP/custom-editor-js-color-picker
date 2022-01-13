import {InlineToolConstructorOptions} from '@editorjs/editorjs';
import './color.css';

const dropperIcon = `<svg style="margin-bottom: 5px" id="Icons" stroke="none" width="18" height="18" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"
\t viewBox="0 0 32 32"  xml:space="preserve">
<path d="M27.7,3.3c-1.5-1.5-3.9-1.5-5.4,0L17,8.6l-1.3-1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1.3,1.3L5,20.6
\tc-0.6,0.6-1,1.4-1.1,2.3C3.3,23.4,3,24.2,3,25c0,1.7,1.3,3,3,3c0.8,0,1.6-0.3,2.2-0.9C9,27,9.8,26.6,10.4,26L21,15.4l1.3,1.3
\tc0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L22.4,14l5.3-5.3C29.2,7.2,29.2,4.8,27.7,3.3z M9,24.6
\tc-0.4,0.4-0.8,0.6-1.3,0.5c-0.4,0-0.7,0.2-0.9,0.5C6.7,25.8,6.3,26,6,26c-0.6,0-1-0.4-1-1c0-0.3,0.2-0.7,0.5-0.8
\tc0.3-0.2,0.5-0.5,0.5-0.9c0-0.5,0.2-1,0.5-1.3L17,11.4l2.6,2.6L9,24.6z"/>
</svg>`

export default class Color {
    private api: InlineToolConstructorOptions['api'];
    private config: InlineToolConstructorOptions['config'];
    private button: HTMLButtonElement | undefined;
    private isColored: boolean = false;
    private optionsWrapper: HTMLElement;
    private colorOptions: HTMLElement[];
    private customInput: HTMLInputElement;
    private fontSpan: HTMLElement;


    static get isInline() {
        return true;
    }

    static get CSS() {
        return {
            colorButton: 'color-fire-btn',
            fontSpan: 'font-span',
            colorOption: 'color-option',
            popOver: 'popover',
            inlineToolbar: 'ce-inline-toolbar',
            colorPicker: 'color-picker',
            pickerButton: 'picker-button',
        }
    }

    constructor({api, config}: InlineToolConstructorOptions) {
        this.api = api
        this.config = config;
    }

    createCustomColorButton(){
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline';
        this.customInput = document.createElement('input');
        this.customInput.type = 'color';
        this.customInput.classList.add(Color.CSS.colorPicker)
        const button = document.createElement('button');
        button.classList.add(Color.CSS.pickerButton)
        button.innerHTML = dropperIcon
        button.addEventListener('click', () => {
            this.customInput.click();
        })
        wrapper.appendChild(button)
        wrapper.appendChild(this.customInput)
        return wrapper;
    }

    createColorOptionsWrapper(options: HTMLElement[]) {
        this.optionsWrapper = document.createElement('div');
        options.forEach(option => this.optionsWrapper.appendChild(option));
        this.optionsWrapper.hidden = true;
        this.optionsWrapper.appendChild(this.createCustomColorButton())
        this.optionsWrapper.style.width = `${this.currentInlineToolbarPosition.width}px`
        return this.optionsWrapper;
    }

    createColorOption(color: string) {
        const button = document.createElement('button');
        button.classList.add(Color.CSS.colorOption);
        button.style.backgroundColor = color;
        button.style.marginLeft = '7px'
        button.style.marginBottom = '7px'
        button.style.marginRight = '7px'
        button.style.cursor = 'pointer';
        button.dataset.color = color;
        return button;
    }

    get currentInlineToolbarPosition(){
        const rect = document.getElementsByClassName(Color.CSS.inlineToolbar)[0].getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            height: rect.height,
            width: rect.width
        }
    }

    render() {
        const icon = `<div style="display:contents;width:100%"><p class=${Color.CSS.colorButton}>A</p><svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129">
  <g>
    <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"/>
  </g>
</svg></div>`
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = icon
        this.button.classList.add(Color.CSS.colorButton)
        this.button.classList.add(this.api.styles.inlineToolButton)
        return this.button;
    }

    createColorOptions(colors: string[]){
        this.colorOptions = colors.map(this.createColorOption)
    }

    surround(range: Range) {
        this.showActions(range)
    }

    renderActions(){
        this.createColorOptions(this.config.colors)
        return this.createColorOptionsWrapper(this.colorOptions)
    }

    addEventListenerToColorButtons(range: Range){
        this.colorOptions.forEach(button => {
            button.addEventListener('click', () => {
                if(this.isColored){
                    this.replaceWrappedColor(button.dataset.color);
                }else{
                    this.wrapWithColor(button.dataset.color, range);
                }
            })
        })
    }

    addEventListenerToColorInputPicker(range: Range){
        this.customInput.oninput = (event) => {
            const color = (event.target as HTMLInputElement).value
            if(this.isColored){
                this.replaceWrappedColor(color);
            }else{
                this.wrapWithColor(color, range);
            }
        }
    }

    showActions(range: Range){
        this.optionsWrapper.hidden = false;
        this.addEventListenerToColorButtons(range);
        this.addEventListenerToColorInputPicker(range);
    }

    clear(){
        this.colorOptions.forEach(button => {
            button.onclick = null;
        })
        this.customInput.onchange = null;
        this.optionsWrapper.hidden = true;
        this.fontSpan = null;
        this.isColored = false;
    }

    wrapWithColor(color: string, range: Range){
        const contents = range.extractContents();
        const span = document.createElement('SPAN');
        span.style.color = color
        span.classList.add(Color.CSS.fontSpan);
        span.appendChild(contents)
        range.insertNode(span)
        this.api.selection.expandToTag(span)
        this.fontSpan = span;
        this.isColored = true;
    }

    replaceWrappedColor(color:string){
        this.fontSpan.style.color = color
    }

    checkState(selection:Selection) {
        this.fontSpan = this.api.selection.findParentTag('SPAN', Color.CSS.fontSpan);
        this.isColored = Boolean(this.fontSpan);
    }
}