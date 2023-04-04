import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

class HorizontalScroll {
    constructor(root) {
        if(!root) {
            return
        }

        this.root = root;
        this.container = this.root.parentElement;
        this.element = this.root.querySelector('[data-vertical-scroll--list]');
        this.elements = [];

        this.elementSize = this.element.getBoundingClientRect();
        this.containerSize = this.elementSize.width * 4;

        this.tween;
        
        this.dx = 0;
        this.accelerationMapped = .1;
        this.numberDuplicate = 4;
        this.direction = this.root.getAttribute('data-vertical-scroll--direction')
        this.duration = 20;
        this.scrub = 2;
        this.acceleration = 0;
        this.deceleration = 0;

        this.bind()
        this.init()
        this.translate()
    }

   bind() {
        this.onRaf = this.onRaf.bind(this);

        this.onRaf();
   }

   onRaf() {
        this.translate()

        window.requestAnimationFrame(this.onRaf);
   }

    init() {
        this.duplicate();
        this.checkScroll();
    }

    duplicate() {
        for(let i = 0; i <= this.numberDuplicate; i++) {
            const duplicate = this.duplicateElement(this.element)

            this.element.before(duplicate);

            this.elements.push(duplicate);
        }
    }

    duplicateElement(element) {
        const duplicate = element.cloneNode(true);

        return duplicate;
    }

    translate() {
        const offset = 0.1;

        this.dx += this.direction === 'left' ? 0.1 + this.deceleration : -0.1 - this.deceleration;

        const xPercent = this.dx % 100;

        gsap.set(this.elements, {
            xPercent,
        });
    }

    checkScroll() {
        const imagesScrollerTrigger = ScrollTrigger.create({
            trigger: "body",
            start: "top -20%",
            end: "bottom -20%",
            onUpdate: (self) => {
                const acceleration = self.getVelocity();
                const accelerationClamped = Math.min(20000, Math.max(-20000, acceleration))
                const accelerationMapped = this.map(accelerationClamped, -20000, 20000, -2, 2)

                this.accelerationMapped = accelerationMapped;

                // this.smoothingScroll(this.accelerationMapped, 1000, this.duration);
            }
        })
    }

    smoothingScroll(scrollValue, timeInterval, duration) {
        const intervalTime = 100;
        const decrement = scrollValue / duration;
        let currentVal = scrollValue;

        const interval = setInterval(() => {
            currentVal -= decrement;
            if (currentVal <= 0) {
                clearInterval(interval);
                currentVal = 0;
            }
            // Do something with the current scrollValue
            this.deceleration = currentVal;

            console.log(this.deceleration)
        }, intervalTime);
    }

    map (value, start1, stop1, start2, stop2) {
        return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
    }

    destroy() {
        this.tl && this.tl.kill()
    }
}

export default {
    when() {
        return document.querySelectorAll('[data-component="vertical-scroll"]').length > 0;
    },

    instances : [],

    mounted() {
        document
            .querySelectorAll('[data-component="vertical-scroll"]')
            .forEach(elem => {
            const instance = new HorizontalScroll(elem)

            this.instances.push(instance)
        })
    },

    destroy() {
        this.instances.forEach(instance => {
            instance.destroy && instance.destroy()
        })
    },
};
