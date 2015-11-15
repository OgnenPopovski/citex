/*
 * Directive for generic combo (select)
 *
 */

Auction.directive('inputField', [
    'crudService',
    function(crudService) {
        return {
            restrict: 'E',
            templateUrl: 'directives/inputField.html',
            scope: {
                /**
                 * The label for translating entity name
                 */
                fLabel: '@',
                /**
                 * The name of the field
                 */
                ifName: '@',
                /**
                 * whether the field is required or not
                 */
                ifRequired: '=',
                /**
                 * the model of the field
                 */
                fModel: '='
                    /**
                     * The fields that start with <b>if-</b> will be copied to the input
                     * element, without the <b>if-</b> part
                     */
            },
            compile: function(tElem, attrs) {
                var attrPat = /^if[A-Z]/;
                var input = tElem.find('input');
                if (!attrs.ifType) {
                    attrs.ifType = 'text';
                }
                for (var a in attrs) {
                    if (attrPat.test(a) && a != 'ifRequired') {
                        input.attr(a.substring(2).replace(/\W+/g, '-').replace(
                            /([a-z\d])([A-Z])/g, '$1-$2'), attrs[a]);
                    }
                }
                if (attrs.convertLatin) {
                    input.attr('ng-change', 'latin()');
                }

                return function(scope, element, attrs, ctrl, transclude, formCtrl) {
                    var baseClass = scope.baseClass || "form-group";

                    var div = element.find("div");
                    div.addClass(baseClass);

                    scope.form = element.parent().controller('form');
                    scope.fName = attrs.ifName;
                    scope.message = attrs.message || 'generic.required';
                    scope.validationParams = attrs;
                };
            },
            controller: function($scope, $element) {
                $scope.latin = function() {
                    var toCyrillic = {
                        A: "А",
                        B: "Б",
                        C: "Ц",
                        Ch: "Ч",
                        D: "Д",
                        Dj: "Џ",
                        Dz: "Ѕ",
                        E: "Е",
                        F: "Ф",
                        G: "Г",
                        Gj: "Ѓ",
                        H: "Х",
                        I: "И",
                        J: "Ј",
                        K: "К",
                        Kj: "Ќ",
                        L: "Л",
                        Lj: "Љ",
                        M: "М",
                        N: "Н",
                        Nj: "Њ",
                        O: "О",
                        P: "П",
                        R: "Р",
                        S: "С",
                        Sh: "Ш",
                        T: "Т",
                        U: "У",
                        V: "В",
                        Z: "З",
                        Zh: "Ж",
                        a: "а",
                        b: "б",
                        c: "ц",
                        ch: "ч",
                        d: "д",
                        dj: "џ",
                        dz: "ѕ",
                        e: "е",
                        f: "ф",
                        g: "г",
                        gj: "ѓ",
                        h: "х",
                        i: "и",
                        j: "ј",
                        k: "к",
                        kj: "ќ",
                        l: "л",
                        lj: "љ",
                        m: "м",
                        n: "н",
                        nj: "њ",
                        o: "о",
                        p: "п",
                        r: "р",
                        s: "с",
                        sh: "ш",
                        t: "т",
                        u: "у",
                        v: "в",
                        z: "з",
                        zh: "ж"
                    };
                    var toLatin = {
                        'А': "A",
                        'Б': "B",
                        'В': "V",
                        'Г': "G",
                        'Д': "D",
                        'Е': "E",
                        'Ж': "Zh",
                        'З': "Z",
                        'И': "I",
                        'К': "K",
                        'Л': "L",
                        'М': "M",
                        'Н': "N",
                        'О': "O",
                        'П': "P",
                        'Р': "R",
                        'С': "S",
                        'Т': "T",
                        'У': "U",
                        'Ф': "F",
                        'Х': "H",
                        'Ц': "C",
                        'Ч': "Ch",
                        'Ш': "Sh",
                        'а': "a",
                        'б': "b",
                        'в': "v",
                        'г': "g",
                        'д': "d",
                        'е': "e",
                        'ж': "zh",
                        'з': "z",
                        'и': "i",
                        'к': "k",
                        'л': "l",
                        'м': "m",
                        'н': "n",
                        'о': "o",
                        'п': "p",
                        'р': "r",
                        'с': "s",
                        'т': "t",
                        'у': "u",
                        'ф': "f",
                        'х': "h",
                        'ц': "c",
                        'ч': "ch",
                        'ш': "sh",
                        'ѓ': "gj",
                        'ѕ': "dz",
                        'ј': "j",
                        'љ': "lj",
                        'њ': "nj",
                        'ќ': "kj",
                        'џ': "dj"
                    };
                    if (!$scope.fModel) return;
                    $scope.fModel = $scope.fModel.split('').map(function(char) {
                        return toLatin[char] || char;
                    }).join("");
                };
            }
        };
    }
]);
