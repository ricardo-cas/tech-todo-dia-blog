module.exports = function (eleventyConfig) {
    // Copia a pasta 'css' para o diretório de saída
    eleventyConfig.addPassthroughCopy("css");

    // Adiciona um filtro para formatar datas de forma legível (para a data do post)
    eleventyConfig.addFilter("readableDate", dateObj => {
        return new Date(dateObj).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    });

    // Adiciona um filtro 'date' para compatibilidade com a data do rodapé
    eleventyConfig.addFilter("date", (dateObj, format) => {
        const date = new Date(dateObj);
        if (format === "%Y") {
            return date.getFullYear();
        }
        return date.toLocaleDateString("pt-BR"); // Fallback padrão
    });

    // Adiciona uma coleção para os posts
    eleventyConfig.addCollection("posts", function (collection) {
        return collection.getFilteredByGlob("posts/*.md");
    });

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
