import ko = require('knockout');

module KnockoutBindings {

    ko.bindingHandlers.bindIframe = {
        init: function (element: HTMLElement, valueAccessor: any) {
            function bindIframe() {
                try {
                    var iframedoc =
                        $(element).contents().find('body')[0];
                } catch (e) {
                    // ignored
                }
                if (iframedoc)
                    ko.applyBindings(valueAccessor(), iframedoc);
            };
            bindIframe();
            console.log(element);
            ko.utils.registerEventHandler(element, 'load', bindIframe);
        }
    };

}
export = KnockoutBindings;