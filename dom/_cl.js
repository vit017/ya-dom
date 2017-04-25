var d = document;
function cl() {
    console.log.apply(console, arguments);
}

;(function (w) {


    var cacher = (function () {
        var stack = {};

        var has = function (request) {
            return stack.hasOwnProperty(request);
        };
        var get = function (request) {
            return stack.hasOwnProperty(request) ? stack[request] : null;
        };

        var set = function (request, response) {
            stack[request] = response;
        };

        return {
            has: has,
            get: get,
            set: set
        }
    }());


    var walker = function (node) {
        if (!(this instanceof walker)) {
            throw new Error('wrong global object');
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

            return find;
        },
        find: function (name) {
            return this.node.getElementsByClassName(name)[0];
        },
        findAll: function (name) {
            return this.node.getElementsByClassName(name);
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