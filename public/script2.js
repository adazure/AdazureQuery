class Helper {
    constructor() {}

    static define(root, name, setting) {
        Object.defineProperty(root, name, setting);
    }

    static defines(root, setting) {
        Object.keys(setting).forEach(function(key) {
            Object.defineProperty(root, key, setting[key]);
        });
    }

    static root(child, tagname, data) {
        if (!data[tagname]) {
            Helper.define(data, tagname, {
                value: new AdazureCollection([])
            });
        }
        data[tagname].__setvalue__ = Helper.parseElement(child);
    }

    static parseElement(el) {
        var t = new AdazureElement(el);
        for (var i = 0, q = el.children; i < q.length; i++) {
            Helper.root(q[i], q[i].tagName, t);
        }
        return t;
    }

    static each(param, action) {
        if (param.length)
            for (var i = 0; i < param.length; i++)
                action(param[i], i)
        else {
            var i = 0;
            Object.keys(param).forEach(function(key) {
                action(param[key], key, ++i);
            });
        }

    }

    static getType(el) {
        var e = typeof el;
        return e === 'object' ? el.tagName : e;
    }

    static textCapitalize(text) {

        // Geri döndürülecek metin nesnesi
        var name = [];

        // Metni - işaretlerinden parçalıyoruz
        var names = text.split('-');

        // Parça sayısı kadar döndürüyoruz
        for (var i = 0; i < names.length; i++) {

            // İlk gelen metni küçük yapar
            if (i == 0)
                name.push(names[0].toLowerCase());

            // Sonra gelecek olan tüm metinlerin ilk harfini büyük yapar
            else {
                name.push(names[i].charAt(0).toUpperCase() + names[i].substring(1).toLowerCase());
            }
        }

        return name.join('');
    }

}

class AdazureGlobalActions {

    constructor(el) {

        var self = this;

    }

}

class AdazureElementActions extends AdazureGlobalActions {
    constructor(element) {
        super(element);
        var self = this;
        var target = element;


        self.setClass = function(...params) {
            Helper.each(params, function(e) {
                element.classList.add(e);
            });
        }

        self.hide = function() {
            element.style.display = 'none';
        }

        self.show = function() {
            element.style.display = 'block';
        }

        self.remove = function() {
            element.parentNode.removeChild(element);
        }

        Helper.defines(self, {
            target: { get: function() { return target; } },
            children: {
                get: function() {
                    var view = new AdazureCollection([]);
                    // ELEMENT, 'DIV', 0
                    for (var i = 0; i < element.children.length; i++) {
                        var child = element.children[i];
                        var tagname = child.tagName;
                        var v = Helper.parseElement(child);
                        view.__setvalue__ = v;
                    }

                    return view;
                }
            }
        });
    }
}

class AdazureElement extends AdazureElementActions {
    constructor(element) {
        super(element);
        this.type = Helper.getType(element);
    }
}

class AdazureCollectionActions {
    constructor(list) {

        var self = this;
        self.each = function(action) {
            for (var i = 0; i < list.length; i++) {
                action(list[i], i);
            }
        }
        self.first = function() {
            return list[0];
        }

        self.last = function() {
            return list[list.length - 1];
        }

        self.get = function(index) {
            return list[index];
        }

        self.slice = function(startIndex, count) {
            return list.slice(startIndex, count);
        }

        self.setClass = function(...params) {
            Helper.each(list, function(e) {
                Helper.each(params, function(n) {
                    e.setClass(n);
                });
            });
        }

        self.hide = function() {
            Helper.each(list, function(e) {
                e.hide();
            });
        }

        self.show = function() {
            Helper.each(list, function(e) {
                e.show();
            });
        }

        self.remove = function() {
            Helper.each(list, function(e) {
                e.remove();
            });
        }

        self.odd = function() {
            var result = new AdazureCollection([]);
            list.filter((e, i) => {
                if (Math.abs(i % 2) == 1)
                    result.value = e;
            });
            return result;
        }

        self.even = function() {
            var result = new AdazureCollection([]);
            list.filter((e, i) => {
                if (i % 2 == 0)
                    result.value = e;
            });
            return result;
        }
    }
}

class AdazureCollection extends AdazureCollectionActions {
    constructor(list) {
        super(list);
        var self = this;
        Helper.defines(self, {
            '__setvalue__': {
                set: function(value) {
                    list.push(value);
                }
            },
            'length': {
                get: function() {
                    return list.length;
                }
            }
        })

    }
}

Helper.define(window, 'Adazure', {
    get: function() {
        var view = Helper.parseElement(document.body);

        Helper.defines(view, {

            'id': {
                get: function() {
                    var data = {};
                    var all = document.querySelectorAll('[id]');
                    Helper.each(all, function(e) {
                        var id = Helper.textCapitalize(e.id);
                        data[id] = Helper.parseElement(e);
                    });
                    return data;
                }
            }
        })
        return view;
    }
});