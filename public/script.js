class AdazureGlobalActions {
    constructor(obj, types) {
        var self = this;

        var config = {
            each: function(arr, action) {
                for (var i = 0; i < arr.length; i++)
                    action(arr[i], i);
            },

            setClass: function(obj, value) {
                obj.classList.add(value);
            },

            remClass: function(obj, value) {
                obj.classList.remove(value);
            },

            setCSS: function(obj, key, value) {
                obj.style[key] = value;
            }
        }


        var _obj = types ? obj : [obj];
        self.setClass = function(...params) {
            config.each(_obj, function(val) {
                config.each(params, function(par) {
                    config.setClass(val.target || val, par);
                });
            });
        }

        this.remClass = function(...params) {
            config.each(_obj, function(val) {
                config.each(params, function(par) {
                    config.remClass(val.target || val, par);
                });
            });
        }
        this.setCSS = function(args) {

            var arr1 = arguments[0];
            var arr2 = arguments[1];

            if (typeof arr1 === 'string' && typeof arr2 === 'string') {
                config.each(_obj, function(val) {
                    config.setCSS(val.target || val, arr1, arr2);
                });
            } else if (typeof args === 'object')
                config.each(_obj, function(val) {
                    Object.keys(args).forEach(function(key) {
                        config.setCSS(val.target || val, key, args[key]);
                    });
                });
        }
        this.show = function() {
            config.each(_obj, function(val) {
                config.setCSS(obj.target || obj, 'display', 'block');
            });
        }
        this.hide = function() {
            config.each(_obj, function(val) {
                config.setCSS(obj.target || obj, 'display', 'none');
            });
        }

        this.remove = function() {
            config.each(_obj, function(val) {
                val.target.parentNode.removeChild(val.target);
            })
            if (types) {
                obj.del;
                console.log(obj);
            }
        }
    }


}

class AdazureElementActions extends AdazureGlobalActions {
    constructor(obj) {

        super(obj, false);

        var config = {
            style: {

            },
            attr: {

            }
        }

        this.hasClass = function() {}

        this.html = function() {
            if (arguments.length == 0)
                return obj.target.innerHTML;
            else
                obj.target.innerHTML = arguments[0];
        }

        this.text = function() {
            return obj.innerText;
        }
    }
}

class AdazureCollectionActions extends AdazureGlobalActions {
    constructor(list) {
        super(list, true);
        this.get = function(index) { return list[index]; }
        this.first = function() { return list[0]; }
        this.last = function() { return list[list.length - 1]; }
        this.each = function(action) { for (var i = 0; i < list.length; i++) action(list[i], i); }
        this.odd = function() {
            var result = new AdazureCollection([]);
            list.filter((e, i) => {
                if (Math.abs(i % 2) == 1)
                    result.value = e;
            });
            return result;
        }
        this.even = function() {
            var result = new AdazureCollection([]);
            list.filter((e, i) => {
                if (i % 2 == 0)
                    result.value = e;
            });
            return result;
        }
    }
}

class AdazureElement extends AdazureElementActions {

    constructor(el) {
        super(el);

        Object.defineProperty(this, 'target', {
            get: function() {
                return el;
            }
        });
    }

}

class AdazureCollection extends AdazureCollectionActions {
    constructor(list) {
        super(list);
        Object.defineProperty(this, 'length', {
            configurable: true,
            get: function() {
                return list.length;
            }
        });
        Object.defineProperty(this, 'value', {
            set: function(value) {
                list.push(value);
            }
        });
    }
}

class AdazureHelper {

    // Gelen metnin ilk harfini kucuk, diğerlerini büyük olarak yapar.
    textCapitalize(text) {

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




    getAllSubElements(args) {

        // Gelen args nesnesi içindeki tüm nesneleri bulur ve işler
        for (var i = 0, el = args.children; i < el.length; i++) {

            // ID değeri varsa
            var id = el[i].id;

            // Name değeri varsa
            var name = el[i].name;

            // Nesnenin tag name değerini al
            var tagName = el[i].tagName.toLowerCase();

            // Gelen elementi, bizim oluşturduğumuz özel elemente ata
            var element = new AdazureElement(el[i]);

            // Bulunan nesnenin tag name değerinde bir collection oluşturur
            if (!adazure[tagName]) {
                this.property(adazure, tagName, {
                    configurable: true,
                    value: new AdazureCollection([])
                });
                this.property(adazure[tagName], 'del', {
                    configurable: true,
                    get: function() {
                        delete adazure[tagName];
                    }
                });
                //adazure[tagName].value = element;
            }


            adazure[tagName].value = element;

            if (id) {
                adazure.id.value = element;
            }
            if (name) {
                adazure.name.value = element;
            }

            this.getAllSubElements(el[i]);
        }
    }

    property(obj, prop, setting) {
        Object.defineProperty(obj, prop, setting);
    }

}

class AdazureObject extends AdazureHelper {

    constructor() {
        super();

        var self = this;
        self.id = {};
        self.name = {};

        self.property(self.id, 'value', {
            set: function(element) {
                self.id[self.textCapitalize(element.target.id)] = new AdazureElement(element);
            }
        });

        self.property(self.name, 'value', {
            set: function(element) {
                self.name[self.textCapitalize(element.target.name)] = new AdazureElement(element);
            }
        });
    }

}

class Adazure extends AdazureObject {

    constructor() { super(); }

    init() {
        if (!adazure.__instance) {

            console.log(new Date().toUTCString());
            var body = document.querySelector('body');
            this.getAllSubElements(body);

            this.property(adazure, '__instance', {
                get: function() {
                    return "Adazure";
                }
            });


            console.log(new Date().toUTCString());
        }
    }

}

(window.adazure = new Adazure()).init();