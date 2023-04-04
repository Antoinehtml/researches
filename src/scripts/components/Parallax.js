
//import FromContactTransition from '@scripts/transitions/FromContactTransition';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

class ParallaxItem {
    constructor(container, element) {
       this.container = container;
       this.element = element;

       this.containerSize = this.container.getBoundingClientRect();
       this.elementSize = this.element.getBoundingClientRect();

       this.coef = 10000;
       this.scrub = 2;

       this.init()
    }

    init() {
        const timeline = gsap.timeline();

        timeline.fromTo(
            this.element,
            {
                y: 0,
            },
            {
                y: this.calculateY(),
                ease: "power4.out",
                scrollTrigger: {
                    trigger: this.container,
                    start: 'top 25%',
                    scrub: this.scrub,
                    markers: false,
                }
            },
        );
    }

    calculateY() {
        return (1 / (this.elementSize.height * 0.5)) * this.coef;
    }
}

class Parallax {
    constructor(element) {
        if(!element) {
            return
        }

        this.element = element
        this.children = this.element.querySelectorAll('[data-parallax--child]')

        this.init()
    }

    init() {
        this.children.forEach((child) => {
            new ParallaxItem(this.element, child);
        })
    }

    destroy() {
        this.tl && this.tl.kill()
    }
}

export default {
    when() {
        return document.querySelectorAll('[data-component="parallax"]').length > 0;
    },

    instances: [],

    mounted() {
        document
            .querySelectorAll('[data-component="parallax"]')
            .forEach(elem => {
                const instance = new Parallax(elem)

                this.instances.push(instance)
            })
    },

    destroy() {
        this.instances.forEach(instance => {
            instance.destroy && instance.destroy()
        })
    },
};
