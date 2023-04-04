import EventHandler from "./EventHandler";

const storedModules = [];
const defaultModule = {
    beforeCreate(args) {},
    created(args) {},

    beforeMount(args) {},
    mounted(args) {},

    beforeDestroy(args) {},
    destroyed(args) {},

    when: true,
};

/**
 * @example
 * const controller = new Controller();
 *
 * controller.register({
 *     mounted() { // do something... },
 *     when: 'home',
 * });
 *
 * controller.ready();
 */
export default class Controller {
    /**
     * @param {array} modules
     * @param {{}} options
     * @return {Controller}
     */
    constructor(modules = [], options = {}) {
        this.options = {
            rootElement: document.body,
            ...options,
        };

        this.rootElement = this.options.rootElement;

        if (typeof modules === 'object' && modules.constructor === Object) {
            modules = Object.entries(modules).reduce((acc, [className, mounted]) => {
                acc.push({
                    mounted,
                    when: () => this.rootElement.classList.contains(className),
                });

                return acc;
            }, []);
        }

        modules.forEach((module) => this.register(module));
    }

    /**
     * Fire given hook on registered modules.
     * @param {string} hookName
     * @param {boolean} force (default: false)
     * @return {Controller}
     */
    fire(hookName, force = false) {
        storedModules.forEach((module) => {
            const args = {
                modules: storedModules,
                rootElement: this.rootElement,
            };
            if (force || module.when(args)) {
                this.trigger(`${hookName}:before`, args);
                module[hookName].call(module, args);
                this.trigger(hookName, args);
                this.trigger(`${hookName}:after`, args);
            }
        });

        return this;
    }

    /**
     * Remove an event handler on rootElement.
     * @param {string} eventName
     * @param {function} callback
     * @return {Controller}
     */
    off(eventName, callback) {
        EventHandler.off(this.rootElement, eventName, callback);
        return this;
    }

    /**
     * Add an event handler on rootElement.
     * @param {string} eventName
     * @param {function} callback
     * @return {Controller}
     */
    on(eventName, callback) {
        EventListener.on(this.rootElement, eventName, callback);
        return this;
    }

    /**
     * Fire the chain of events.
     * @param {boolean} force (default: false)
     * @return {Controller}
     */
    ready(force = false) {
        if (force || document.readyState === 'complete') {
            this.fire('beforeCreate');
            this.fire('created');
            this.fire('beforeMount');
            return this.fire('mounted');
        }

        // @see https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event
        EventHandler.on(document, 'readystatechange', () => {
            if (document.readyState === 'complete') {
                this.fire('beforeMount');
            } else {
                this.fire('beforeCreate');
            }
        });
        EventHandler.on(document, 'DOMContentLoaded', () => this.fire('created'));
        EventHandler.on(window, 'load', () => this.fire('mounted'));
        EventHandler.on(window, 'beforeunload', () => this.fire('beforeDestroy'));
        EventHandler.on(window, 'unload', () => this.fire('destroyed'));
        return this;
    }

    /**
     * Register a controller module.
     * @param {{}} module
     * @return {Controller}
     */
    register(module) {
        if (typeof module === 'function') {
            module = {mounted: module};
        }

        module = {
            ...defaultModule,
            ...module,
        };

        if (typeof module.when === 'boolean') {
            const result = module.when;
            module.when = () => result;
        } else if (typeof module.when === 'string') {
            const classNames = module.when.split(',').map((s) => s.trim());
            module.when = () => Array.from(this.rootElement.classList).some((className) => classNames.includes(className));
        }

        storedModules.push(module);

        return this;
    }

    /**
     * Trigger an event on rootElement.
     * @param {string} eventName
     * @param args
     * @return {Controller}
     */
    trigger(eventName, args = null) {
        EventHandler.trigger(this.rootElement, eventName, args);
        return this;
    }
}
