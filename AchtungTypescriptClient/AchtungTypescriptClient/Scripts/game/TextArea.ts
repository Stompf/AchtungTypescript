import $ = require('jquery');

module TextArea {

    const $element = $('#canvasGameText');

    export function clearText() {
        $element.html('');
    }

    export function addText(str: string) {
        const newRow = '<div>' + str + '</div>';
        $element.html(newRow + $element.html());
    }
}
export = TextArea;