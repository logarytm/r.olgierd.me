const Dom = {
    el(tagName, attributes = {}, children = [], callback = Function.prototype) {
        if (Array.isArray(attributes)) {
            // el('div', [...]) -> el('div', {}, [...])
            children = attributes;
            attributes = {};
        }

        if (typeof attributes === 'function') {
            // el('div', element => ...) -> el('div', {}, element => ...)
            callback = attributes;
            attributes = {};
        }

        if (typeof children === 'function') {
            // el('div', {}, element => ...) -> el('div', {}, [], element => ...)
            callback = children;
            children = [];
        }

        if (
            (typeof attributes !== 'object' || attributes === null)
            || !Array.isArray(children)
            || typeof callback !== 'function'
        ) {
            console.error('Invalid call to el(). The signature is el(tagName: string, [attributes: Object], [children: Array], [callback: Function]).');
            return;
        }

        if (Object.prototype.toString.call(attributes) !== '[object Object]') {
            let message = 'Dubious call to el(): attributes is not a plain Object.';
            if (attributes instanceof Node) {
                message += '\nNotice: Child DOM nodes should be passed in an array, not directly as arguments to el().';
            }
            console.warn(message);
            return;
        }

        if (Array.isArray(attributes.className)) {
            attributes.className = attributes.className
                .filter(x => x != null)
                .join(' ');
        }

        if (tagName.includes('.')) {
            let classNamesFromTagName;
            [tagName, ...classNamesFromTagName] = tagName.split('.');

            attributes.className = (attributes.className != null ? attributes.className + ' ' : '')
                + classNamesFromTagName.join(' ');
        }

        var $element = document.createElement(tagName);

        for (const attribute in attributes) {
            if (attribute.startsWith('data-')) {
                $element.setAttribute(attribute, attributes[attribute]);
                delete attributes[attribute];
            }
        }

        Object.assign($element, attributes);

        for (const child of children) {
            switch (typeof child) {
                case 'undefined':
                    break;

                case 'bigint':
                case 'number':
                case 'string':
                case 'boolean':
                case 'symbol':
                    $element.appendChild(document.createTextNode(String(child)));
                    break;

                case 'function':
                    throw new TypeError('el(): cannot add function as a child');

                case 'object':
                    if (child === null) {
                        break;
                    }

                    if (!child instanceof Node) {
                        throw new TypeError('el(): child object must be instance of Node');
                    }

                    $element.appendChild(child);
                    break;
            }
        }

        if (typeof callback === 'function') {
            callback($element);
        }

        return $element;
    },
};

export default Dom;
