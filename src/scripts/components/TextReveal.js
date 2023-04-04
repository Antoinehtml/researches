import gsap from 'gsap';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

class TextReveal {
    constructor(root) {
        if(!root) {
            return
        }

        this.root = root;
        this.text = this.root.querySelectorAll('[data-text-reveal--text]');

        this.splitInstance = null;
        this.lines = [];

        this.init()
        this.reveal()
    }

    bind() {
        this.onResize = debounce(this.onResize, 200, {
            leading: false,
        }).bind(this);
        window.addEventListener("resize", this.onResize);
    }

    unbind() {
        window.removeEventListener("resize", this.onResize);
    }

    onResize() {
        this.split();
    }

    init() {
        this.split();
    }

    reveal() {
        const tl = gsap.timeline({
            delay: 0.4,
            onComplete: () => {
                this.splitInstance.revert();
                this.unbind();
            },
            scrollTrigger: {
                trigger: this.root,
                start: "top 85%",
                markers: false,
            }
        })

        tl.fromTo(this.lines,
            {
                y: '110%',
                skewY: 10,
            },
            {
                y: '0%',
                skewY: 0,
                duration: 1.4,
                ease: 'power4.out',
                stagger: { each: 0.1 },
            }
        )
    }

    split() {
        this.splitInstance = new SplitType(this.text, {
            types: 'lines',
            lineClass: 'text_reveal__line',
        })

        this.splitInstance.lines.forEach((line) => {
            const div = document.createElement('div');

            div.classList.add('text_reveal__line-inner');
            div.innerHTML = line.innerHTML;

            line.innerHTML = '';
            line.appendChild(div);

            this.lines.push(div)
        })
    }

    destroy() {
        this.unbind();
    }
}

export default {
    when() {
        return document.querySelectorAll('[data-component="text-reveal"]').length > 0;
    },

    instances: [] ,

    mounted() {
        document
            .querySelectorAll('[data-component="text-reveal"]')
            .forEach(elem => {
            const instance = new TextReveal(elem);

            this.instances.push(instance);
        })
    },

    destroy() {
        this.instances.forEach(instance => {
            instance.destroy && instance.destroy()
        })
    },
}