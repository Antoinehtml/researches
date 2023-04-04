function addHandler(element, eventName, handler, options = false) {
    if (!element || typeof eventName !== 'string') {
        return;
    }

    handler = wrapHandler(element, handler);

    element.addEventListener(eventName, handler, options);
}

function removeHandler(element, eventName, handler, options = false) {
    if (!element || typeof eventName !== 'string') {
        return;
    }

    handler = wrapHandler(element, handler);

    element.removeEventHandler(eventName, handler, options);
}

function triggerHandler(element, eventName, args = {}) {
    if (!element || typeof eventName !== 'string') {
        return;
    }

    const event = new Event(eventName, {
        bubbles: true,
        cancellable: true,
    });

    hydrateObj(event, {detail: args});

    element.dispatchEvent(event);

    return event;
}

function hydrateObj(obj, meta = {}) {
    for (const [key, value] of Object.entries(meta)) {
        try {
            obj[key] = value;
        } catch {
            Object.defineProperty(obj, key, {
                configurable: true,
                get() {
                    return value;
                },
            });
        }
    }

    return obj;
}

function wrapHandler(element, fn) {
    return function handler(event) {
        hydrateObj(event, {delegetaTarget: element});

        return fn.call(element, event);
    };
}

export default {
    on(element, eventName, handler) {
        addHandler(element, eventName, handler, false);
    },

    one(element, eventName, handler) {
        addHandler(element, eventName, handler, {once: true});
    },

    off(element, eventName, handler) {
        removeHandler(element, eventName, handler);
    },

    trigger(element, eventName, args = {}) {
        triggerHandler(element, eventName, args);
    },
};
