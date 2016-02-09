import $ = require('jquery');

module TextArea {
    export function clearText() {
        $('#canvasGameText').html('');
    }

    export function addText(str: string) {
        const newRow = '<div>' + str + '</div>';
        $('#canvasGameText').html(newRow + $('#canvasGameText').html());
    }
}
export = TextArea;