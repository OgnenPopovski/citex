Auction.factory('MarkdownEditorButtons', [
    "$filter",
    function($filter) {
        return {
            cmdBind: function(callback) {
                return {
                    name: 'cmdBind',
                    title: 'Insert binded value',
                    icon: 'fa fa-share-alt',
                    callback: function(e) {
                        // Replace selection with table
                        var chunk, cursor, selected = e.getSelection(),
                            content = e
                            .getContent(),
                            index = Math
                            .floor((Math.random() * 10) + 1)

                        // Give random drink
                        chunk = "{{bind. }}";

                        // transform selection and set the
                        // cursor into chunked text
                        e.replaceSelection(chunk);
                        cursor = selected.start + 7;

                        // Set the cursor
                        e.setSelection(cursor, cursor + 1);
                        if (typeof callback === 'function') {
                            callback(e.getContent());
                        }
                    }
                };
            },
            cmdRepeat: function(callback) {
                return {
                    name: 'cmdRepeat',
                    title: 'Insert binded repeat',
                    icon: 'fa fa-repeat',
                    callback: function(e) {
                        // Replace selection with table
                        var chunk, cursor, selected = e.getSelection(),
                            content = e
                            .getContent(),
                            index = Math
                            .floor((Math.random() * 10) + 1)

                        // Give random drink
                        chunk = "<div ng-repeat='v in bind.x'>\n" + "{{v.a}} {{v.b}}\n</div>\n";

                        // transform selection and set the
                        // cursor into chunked text
                        e.replaceSelection(chunk);
                        cursor = selected.start;

                        // Set the cursor
                        e.setSelection(cursor, cursor + chunk.length);
                        if (typeof callback === 'function') {
                            callback(e.getContent());
                        }
                    }
                };
            },
            cmdTable: function(callback) {
                return {
                    name: 'cmdTable',
                    title: 'Insert Table',
                    icon: 'fa fa-table',
                    callback: function(e) {
                        // Replace selection with table
                        var chunk, cursor, selected = e.getSelection(),
                            content = e
                            .getContent(),
                            index = Math
                            .floor((Math.random() * 10) + 1)

                        // Give random drink
                        chunk = "| Tables        | Are           | Cool  |\n" + "| ------------- |:-------------:| -----:|\n" + "| col 3 is      | right-aligned | $1600 |\n" + "| col 2 is      | centered      |   $12 |\n" + "| zebra stripes | are neat      |    $1 |\n";

                        // transform selection and set the
                        // cursor into chunked text
                        e.replaceSelection(chunk);
                        cursor = selected.start;

                        // Set the cursor
                        e.setSelection(cursor, cursor + chunk.length);
                        if (typeof callback === 'function') {
                            callback(e.getContent());
                        }
                    }
                };
            }
        };
    }
]);

Auction.factory('MarkedConfig', ["$filter", function($filter) {
    return {
        cfg: function() {
            var renderer = new marked.Renderer();

            renderer.paragraph = function(text) {
                var align = 'tjustify';
                var l = text[0] === '[';
                var r = text[text.length - 1] === ']';

                if (r && l) {
                    align = 'tcenter';
                    text = text.substring(1, text.length - 1);
                } else if (r) {
                    align = 'tright';
                    text = text.substring(0, text.length - 1);
                } else if (l) {
                    align = 'tleft';
                    text = text.substring(1);
                }
                return '<p class="' + align + '">' + text + '</p>\n';
            };

            marked.setOptions({
                highlight: function(code) {
                    return hljs.highlightAuto(code).value;
                },
                renderer: renderer,
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: false
            });
        }
    };
}]);
