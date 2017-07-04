class Helper {
    constructor() {

    }
    static textCapitalize(text) {

        if (!text) return null;
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



    //.....................................................................




    static on(obj, name, action) {
        if (obj.addEventListener)
            obj.addEventListener(name, action, false);
        else
            obj.attachEvent('on' + name, action);
    }



    //.....................................................................





    static off(obj, name, action) {
        if (obj.removeEventListener)
            obj.removeEventListener(name, action, false);
        else
            obj.detachEvent('on' + name);
    }



    //.....................................................................





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




    //.....................................................................




    static deep(el, view) {
        Helper.each(el.children, function(e) {
            if (!view[e.tagName]) {
                view[e.tagName] = new AdazureElementCollection();
            }
            view[e.tagName].___item___ = e.___cache___.target;
            Helper.deep(e, view);
        });
    }



    //.....................................................................





    static copy(args) {
        var view = {};
        Object.keys(args).forEach(function(key) {
            view[key] = args[key];
        });
        return view;
    }



    //.....................................................................





    static applyOn(name, data, action) {

        function _const(obj, name, action) {

            var func = function(e) {
                action(Object.freeze({
                    x: e.pageX,
                    y: e.pageY,
                    leftButton: e.button == 0,
                    rightButton: e.button == 1,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    width: e.target.offsetWidth,
                    height: e.target.offsetHeight,
                    target: e.target.___cache___.target
                }))
            };

            obj.___cache___.events[name] = func;
            Helper.on(obj, name, func);

        }

        if (data.length && typeof data === 'object') {
            for (var i = 0, dt = data; i < dt.length; i++) {
                _const(dt[i].target, name, action);
            }
        } else {
            _const(data, name, action);
        }
    }



    //.....................................................................





    static applyOff(name, data) {

        function remove(obj) {
            Helper.off(obj, name, obj.___cache___.events[name]);
            delete obj.___cache___.events[name];
        }

        if (data.length && typeof data === 'object')
            for (var i = 0, dt = data; i < dt.length; i++) {
                remove(dt[i].target);
            }
        else {
            remove(data);
        }

    }



    //.....................................................................





    static apply(arr, data, action) {
        for (var i = 0; i < data.length; i++) {
            for (var n = 0; n < arr.length; n++)
                data[i][action](arr[n]);
            if (data[i].target.___cache___.class.length == 0)
                data[i].remAttr('class');
        }
    }



    //.....................................................................





    static prefix(count) {
        var t = 'ABCDEFGHJKLMNOPRSTUVYZXQ0123456780';
        var result = ['X'];
        for (var i = 0; i < count; i++)
            result.push(t.charAt(Math.round(Math.random() * t.length)));
        return result.join('');
    }



    //.....................................................................





    static findChildren(el) {
        var z = el.___maincache___;
        var n = new AdazureElementCollection();
        Object.keys(z).forEach(function(key) {
            if (z[key].root == el.___cache___.currentID)
                n.___item___ = z[key].target;
        });

        return n;
    }



    //.....................................................................




}


class AdazureElementCollection {
    constructor() {

        var self = this;
        var data = [];




        //.....................................................................





        Object.defineProperties(this, {
            '___value___': {
                set: function(val) {
                    data = val;
                }
            },
            '___item___': {
                set: function(val) {
                    data.push(val);
                }
            },
            'length': {
                get: function() {
                    return data.length;
                }
            }
        });



        //.....................................................................





        self.each = function(action) {
            for (var i = 0; i < data.length; i++)
                action(data[i], i);
        }



        //.....................................................................





        self.on = function(name, action) {
            Helper.applyOn(name, data, action);
        }



        //.....................................................................





        self.off = function(name) {
            Helper.applyOff(name, data);
        }



        //.....................................................................





        self.slice = function(startIndex, count) {
            return data.slice(startIndex, count);
        }



        //.....................................................................





        self.hide = function() {
            Helper.each(data, function(e) {
                e.hide();
            });
        }



        //.....................................................................





        self.show = function() {
            Helper.each(data, function(e) {
                e.show();
            });
        }



        //.....................................................................





        self.remove = function() {
            Helper.each(data, function(e) {
                e.remove();
            });
        }



        //.....................................................................





        self.attr = function() {
            var arr = Array.prototype.slice.apply(arguments);
            Helper.apply(arr, data, 'attr');
        }



        //.....................................................................





        self.odd = function() {
            var result = new AdazureElementCollection();
            var n = [];
            data.filter((e, i) => {
                if (Math.abs(i % 2) == 1)
                    n.push(e);
            });
            result.___value___ = n;
            return result;
        }



        //.....................................................................





        self.even = function() {
            var result = new AdazureElementCollection();
            var n = [];
            data.filter((e, i) => {
                if (i % 2 == 0)
                    n.push(e);
            });
            result.___value___ = n;
            return result;
        }



        //.....................................................................





        self.setClass = function(params) {
            var arr = Array.prototype.slice.apply(arguments);
            Helper.apply(arr, data, 'setClass');
        }



        //.....................................................................





        self.remClass = function(params) {
            var arr = Array.prototype.slice.apply(arguments);
            Helper.apply(arr, data, 'remClass');
        }

    }
}










class AdazureElement {

    constructor(el) {

        var self = this;
        var target = el;




        //.....................................................................




        self.setClass = function() {
            var result = false;
            var arg = arguments.length == 1 && typeof arguments[0] === 'object' ? arguments[0] : Array.prototype.slice.apply(arguments);
            for (var i = 0; i < arg.length; i++) {
                if (el.___cache___.class.indexOf(arg[i]) == -1) {
                    result = true;
                    el.___cache___.class.push(arg[i]);
                }
            }
            if (result)
                target.setAttribute('class', target.___cache___.class.join(' '));
            return self;
        }



        //.....................................................................





        self.remClass = function() {
            var result = true;
            var arg = arguments.length == 1 && typeof arguments[0] === 'object' ? arguments[0] : Array.prototype.slice.apply(arguments);
            var cls = el.___cache___.class;
            for (var i = 0; i < arg.length; i++) {
                var point = cls.indexOf(arg[i]);
                if (point != -1) {
                    result = true;
                    cls.splice(point, 1);
                }
            }
            if (result)
                target.setAttribute('class', cls.join(' '));
            return self;
        }



        //.....................................................................





        self.attr = function() {
            var arr = arguments[0];
            if (typeof arr === 'object') {
                Object.keys(arr).forEach(function(key) {
                    target.setAttribute(key, arr[key]);
                });
            } else {
                var arr = Array.prototype.slice.apply(arguments);
                if (arr.length == 2) {
                    target.setAttribute(arr[0], arr[1]);
                } else if (arr.length == 1)
                    target.getAttribute(arr[0]);
            }
        }



        //.....................................................................





        self.remAttr = function() {
            if (typeof arguments[0] === 'object') {
                Object.keys(arguments[0]).forEach(function(key) {
                    target.removeAttribute(key, arguments[0][key]);
                });
            } else {
                var arr = Array.prototype.slice.apply(arguments);
                if (arr.length == 2) {
                    target.removeAttribute(arr[0], arr[1]);
                } else if (arr.length == 1)
                    target.removeAttribute(arr[0]);
            }
        }



        //.....................................................................





        self.on = function(name, action) {
            Helper.applyOn(name, target, action);
        }



        //.....................................................................





        self.off = function(name, action) {
            Helper.applyOff(name, target, action);
        }



        //.....................................................................





        self.html = function() {
            if (arguments.length == 1)
                target.innerHTML = arguments[0];
            else
                return target.innerHTML;
        }



        //.....................................................................





        self.insert = function() {
            var arr = arguments[0];

            if (!arr) {
                target.___temp___.appendChild(target);
                Adazure._addData(target, target.___cache___.currentID, target.___temp___.___cache___.currentID);
                delete target.___temp___;
            } else {
                Adazure._addData(target, target.___cache___.currentID, arr.target.___cache___.currentID);
                arr.target.appendChild(target);
            }

            Adazure._find(target, target.___cache___.currentID);

        }



        //.....................................................................





        self.clone = function(args) {
            var t = target.cloneNode();
            t.___temp___ = target.parentNode;
            t.___cache___ = Helper.copy(target.___cache___);
            t.___cache___.currentID = Helper.prefix(20);
            t.___cache___.target = new AdazureElement(t);
            if (args) {
                Object.keys(args).forEach(function(key) {
                    eval(t.___cache___.target[key])(args[key]);
                });
            }
            t.___cache___.id = t.id;

            return t.___cache___.target;
        }



        //.....................................................................





        Object.defineProperties(self, {
            'children': {
                get: function() {
                    return Helper.findChildren(target);
                }
            },
            'deep': {
                get: function() {
                    var view = {};
                    Helper.deep(el, view);
                    return view;
                }
            },
            'target': {
                get: function() {
                    return el;
                }
            }
        })


    }
}


class AdazureModule {

    constructor() {

        var self = this;
        var config = {};
        config.data = { XBODY: {} };



        //.....................................................................





        config._addData = function(el, prefix, root) {

            var nel = new AdazureElement(el);

            config.data[prefix] = {
                currentID: prefix,
                target: nel,
                tag: el.tagName,
                id: el.id,
                class: el.getAttribute('class') ? el.getAttribute('class').split(' ') : [],
                value: el.value,
                events: {}
            };

            Object.defineProperty(config.data[prefix], 'idPrefix', {
                get: function() {
                    return Helper.textCapitalize(config.data[prefix].id)
                }
            });

            Object.defineProperty(el, '___cache___', {
                get: function() {
                    return config.data[prefix];
                }
            });

            Object.defineProperty(el, '___maincache___', {
                get: function() {
                    return config.data;
                }
            });

            Object.defineProperties(config.data[prefix], {
                'root': {
                    get: function() {
                        try {
                            return config.data[el.parentNode.___cache___.currentID]
                        } catch (z) {
                            return null;
                        }
                    }
                }
            });

            for (var i = 0, lst = []; i < el.children.length; i++)
                lst.push(new AdazureElement(el.children[i]));


            Object.freeze(config.data[prefix]);

            return nel;
        }



        //.....................................................................





        config._find = function(el, root) {
            Helper.each(el.children, function(e) {
                var tag = e.tagName;
                var prefixID = Helper.prefix(20);
                config._addData(e, prefixID, root);
                config._find(e, prefixID);
            });
        }



        //.....................................................................





        self._init = function() {
            config._find(document.body, 'XBODY');


            var nel = config._addData(document.body, Helper.prefix(20), null);

            Object.defineProperty(window, 'Adazure', {
                value: nel
            });



            Object.defineProperty(Adazure, 'id', {
                get: function() {
                    var view = {};
                    var keys = Object.keys(config.data);
                    keys.forEach(function(e) {
                        var x = config.data[e];
                        if (x.idPrefix)
                            view[x.idPrefix] = x.target;
                    });
                    return view;
                }
            });

            Adazure._addData = config._addData;
            Adazure._find = config._find;

        }


    }



}


(window.Adazure = new AdazureModule())._init();