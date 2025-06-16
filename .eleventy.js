module.exports = function (eleventyConfig) {
    // Copia a pasta 'css' para o diretório de saída
    eleventyConfig.addPassthroughCopy("css");

    // Define a pasta de entrada e saída
    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes",
            layouts: "_includes"
        }
    };
};
