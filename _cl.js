;(function (w) {

    var cacher = (function () {
        var queries = {};

        var has = function (request) {
            return queries.hasOwnProperty(request);
        };
        var get = function (request) {
            return queries.hasOwnProperty(request) ? queries[request] : null;
        };

        var set = function (request, response) {
            queries[request] = response;
        };

        return {
            has: has,
            get: get,
            set: set
        }
    }());


    var walker = function (node) {
        if (!(this instanceof walker)) {
            throw new TypeError('wrong global object');
        }
        this.node = node;
        this.node.className = this.node.className.trim();
    };
    var toArray = function (list) {
        return Array.prototype.slice.call(list);
    };
    var re = function (name) {
        return new RegExp('\\b' + name + '\\b')
    };

    walker.prototype = {
        has: function (name) {
            return re(name).test(this.node.className);
        },
        replace: function (oldClass, newClass) {
            this.node.className = this.node.className.replace(re(oldClass), newClass);
            return this;
        },
        add: function () {
            var that = this;

            toArray(arguments).forEach(function (name) {
                !that.has(name) && (that.node.className += ' ' + name);
            });
            return this;
        },
        remove: function () {
            var that = this;

            toArray(arguments).forEach(function (name) {
                that.has(name) && that.replace(name, '');
            });

            return this;
        },
        list: function () {
            return this.node.className.replace(/\s{2,}/, ' ').split(' ');
        },
        toggle: function (name) {
            if (this.has(name))
                this.remove(name);
            else
                this.add(name);

            return this;
        },
        closest: function (name) {
            var method = 'closest';
            if (cacher.has(method + name)) {
                return cacher.get(method + name);
            }

            var find = null,
                oldNode = this.node;

            while (this.node) {
                if (this.has(name)) {
                    find = this.node;
                    this.node = oldNode;
                    break;
                }
                this.node = this.node.parentNode;
            }

            cacher.set(method + name, find);
            return find;
        },
        find: function (name) {
            var method = 'find';
            if (cacher.has(method + name)) {
                return cacher.get(method + name);
            }

            var node = this.node.getElementsByClassName(name)[0];
            cacher.set(method + name, node);

            return node;
        },
        findAll: function (name) {
            var method = 'findAll';
            if (cacher.has(method + name)) {
                return cacher.get(method + name);
            }

            var nodes = this.node.getElementsByClassName(name);
            cacher.set(method + name, nodes);

            return nodes;
        }

    };

    var _cl = function (node) {
        if (!(node instanceof HTMLElement)) {
            throw new TypeError('param has wrong type');
        }

        return new walker(node);
    };

    w._cl = _cl;

}(window));


var el = document.getElementById('el');
_cl(el).add('test-class');
//_cl(el).remove('test-class');