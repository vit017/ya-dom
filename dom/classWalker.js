function cl() {
    console.log.apply(console, arguments);
}

;(function () {
    function classWalker(node) {
        this.list = node.className.trim().length ? node.className.replace(/\s{2,}/, ' ').split(' ') : [];
        this.node = node;
    }

    classWalker.prototype = {
        has: function (nameClass) {
            return -1 !== this.list.indexOf(nameClass);
        },
        add: function (nameClass) {
            if (!this.has(nameClass)) {
                this.node.className += ' ' + nameClass;
            }
            return this;
        },
        remove: function (nameClass) {
            if (this.has(nameClass)) {
                this.list.splice(this.list.indexOf(nameClass), 1);
                this.node.className = this.list.join(' ');
            }
        },
        replace: function (nameClassOld, nameClassNew) {
            this.has(nameClassOld) && this.remove(nameClassOld);
            !this.has(nameClassNew) && this.add(nameClassNew);
        },
        closest: function (nameClass) {
            var oldNode = this.node, find = null;
            while (this.node) {
                if (this.has(nameClass)) {
                    find = this.node;
                    this.node = oldNode;
                    break;
                }
                classWalker.call(this, this.node.parentNode);
            }

            return find;
        },
        find: function (nameClass) {
            return this.node.getElementsByClassName(nameClass)[0];
        },
        findAll: function(nameClass) {
            return this.node.getElementsByClassName(nameClass);
        },
        toggle: function(nameClass) {
            if (this.has(nameClass)) this.remove(nameClass);
            else this.add(nameClass)
        }
    };


    if (!('classWalker' in Element.prototype)) {
        Object.defineProperty(Element.prototype, 'classWalker', {
            get: function () {
                return new classWalker(this);
            }
        });
    }

}());


var re = new RegExp('(^| )'+name+'( |$)');
cl(~(' some            class '.search('2class')));