class AdazureGlobalActions {
    constructor(obj, types) {
        var self = this;
        self.setClass = function(...params) {
            if (obj.length) {
                for (var i = 0; i < obj.length; i++) {
                    for (var s = 0; s < params.length; s++) {
                        self.addClass(obj[i].__target, params[s]);
                    }
                }
            } else {
                for (var s = 0; s < params.length; s++) {
                    self.addClass(obj, params[s]);
                }
            }
        }
        this.remClass = function() {}
        this.setCSS = function() {}
    }

    addClass(obj, value) {
        obj.classList.add(value);
    }
}

class AdazureElementActions extends AdazureGlobalActions {
    constructor(obj) {
        super(obj, false);
        this.hasClass = function() {}
    }
}

class AdazureCollectionActions extends AdazureGlobalActions {
    constructor(list) {
        super(list, true);
        this.get = function(index) { return list[index]; }
        this.first = function() { return list[0]; }
        this.last = function() { return list[list.length - 1]; }
        this.odd = function() { return list.filter((e, i) => Math.abs(i % 2) == 1); }
        this.even = function() { return list.filter((e, i) => i % 2 == 0); }
    }
}

class AdazureElement extends AdazureElementActions {

    constructor(el) {
        super(el);
        Object.defineProperty(this, '__target', {
            get: function() {
                return el;
            }
        });
    }

}

class AdazureCollection extends AdazureCollectionActions {
    constructor(list) {
        super(list);
        Object.defineProperty(this, '__value', {
            set: function(value) {
                list.push(value);
            }
        });
    }
}

class Adazure {

    constructor() {}

    setNames(value) {
        var name = [];
        var st = value.split('-');
        for (var i = 0; i < st.length; i++) {

            if (i == 0)
                name.push(st[0].toLowerCase());
            else {
                var first = st[i].charAt(0).toUpperCase();
                var second = st[i].substring(1).toLowerCase();
                var result = first + second;
                name.push(result);
            }
        }
        return name.join('');
    }

    find(args) {
        for (var i = 0, el = args.children; i < el.length; i++) {
            var id = el[i].id;
            var name = el[i].name;
            var tagName = el[i].tagName.toLowerCase();
            var element = new AdazureElement(el[i]);

            if (!adazure[tagName]) {
                adazure[tagName] = new AdazureCollection([]);
                adazure[tagName].__value = element;
            } else {
                adazure[tagName].__value = element;
            }

            if (id) {
                adazure.id[this.setNames(id)] = element;
            }
            if (name) {
                adazure.name[this.setNames(name)] = element;
            }

            this.find(el[i]);
        }
    }

    init() {
        if (!adazure.__instance) {

            adazure.id = {};
            adazure.name = {};

            var body = document.querySelector('body');
            this.find(body);

            Object.defineProperty(adazure, '__instance', {
                get: function() {
                    return "Adazure";
                }
            });
        }
    }

}

(window.adazure = new Adazure()).init();