import Controller from "./helpers/Controller";

import Parallax from "./components/Parallax";
import TextReveal from "./components/TextReveal";
import HorizontalScroll from "./components/HorizontalScroll";

// import resolveConfig from 'tailwindcss/resolveConfig.js'
// import tailwindConfig from './../../tailwind.config.cjs'
// const fullConfig = resolveConfig(tailwindConfig)


const modules = [
    // components
    Parallax,
    TextReveal,
    HorizontalScroll,

    // controllers
];

const controller = new Controller(modules);

/**
 * Application entrypoint
 */
controller.ready();


/**
 * @see {@link https://webpack.js.org/api/hot-module-replacement/}
 */
import.meta.webpackHot?.accept(console.error);
