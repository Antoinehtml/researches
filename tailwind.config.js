module.exports = {
    mode: "jit",
    content: ["./src/**/*.{html,js}"],
    purge: ["./src/index.html"],
    darkMode: false, // or 'media' or 'class'
    theme: {
      colors: {
        white: '#fff',
        darkBlue: '#172554',
        // add more colors here
      },
      fontFamily: {
        'custom' : ['Montserrat', 'sans-serif'],
      },
    },
    variants: {},
    plugins: [],
  };