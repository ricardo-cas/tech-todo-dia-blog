const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

const postsDir = path.join(__dirname, "posts");
const outputDir = path.join(__dirname, "public");
const imagesDir = path.join(__dirname, "images"); // <--- Adicione esta linha

// Garante que a pasta de saída exista
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

if (fs.existsSync(imagesDir)) { // <--- Adicione este bloco
    const outputImagesDir = path.join(outputDir, "images");
    if (!fs.existsSync(outputImagesDir)) {
        fs.mkdirSync(outputImagesDir);
    }
    fs.readdirSync(imagesDir).forEach(file => {
        fs.copyFileSync(path.join(imagesDir, file), path.join(outputImagesDir, file));
    });
}

// Função para ler o Front Matter e o conteúdo do Markdown
function parseMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const parts = content.split("---\n");
    if (parts.length < 3) {
        return { meta: {}, content: content };
    }

    const metaRaw = parts[1];
    const markdownContent = parts.slice(2).join("---\n");

    const meta = {};
    metaRaw.split("\n").forEach(line => {
        const [key, ...valueParts] = line.split(":");
        if (key && valueParts.length > 0) {
            meta[key.trim()] = valueParts.join(":").trim();
        }
    });
    return { meta, content: markdownContent };
}

// Processa os posts
const posts = [];
fs.readdirSync(postsDir).forEach(file => {
    if (path.extname(file) === ".md") {
        const filePath = path.join(postsDir, file);
        const { meta, content } = parseMarkdownFile(filePath);
        const htmlContent = md.render(content);

        // Adiciona a data como objeto Date para ordenação
        if (meta.date) {
            meta.dateObj = new Date(meta.date);
        }

        posts.push({ meta, htmlContent, slug: path.basename(file, ".md") });

        // Cria o arquivo HTML para o post individual
        const postHtml = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title}</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <header>
        <div class="container header-content">
            <h1><a href="/">Tech Todo Dia</a></h1>
            <nav>
                <a href="/">Início</a>
            </nav>
        </div>
    </header>
    <div class="wrapper">
        <main class="main-content">
            <article>
                <h2>${meta.title}</h2>
                <p><em>Publicado em: ${new Date(meta.date).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}</em></p>
                <p><em>Por: ${meta.author}</em></p>
                ${htmlContent}
            </article>
        </main>
        <aside class="sidebar">
            <div class="author-card">
                <img src="https://placehold.co/100x100" alt="Foto do Autor" class="author-avatar">
                <h3>Ricardo "Ricas" Costa Alves</h3>
                <p>Pai, tech freak e Neurodivergente</p>
            </div>
        </aside>
    </div>
    <footer>
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} Tech Todo Dia. Todos os direitos reservados.</p>
        </div>
    </footer>
</body>
</html>
    `;
        const postOutputDir = path.join(outputDir, "posts");
        if (!fs.existsSync(postOutputDir)) {
            fs.mkdirSync(postOutputDir);
        }
        fs.writeFileSync(path.join(postOutputDir, `${posts[posts.length - 1].slug}.html`), postHtml);
    }
});

// Ordena os posts por data (mais recente primeiro)
posts.sort((a, b) => b.meta.dateObj - a.meta.dateObj);

// Gera a página inicial (index.html)
const indexHtml = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Tech Todo Dia</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <header>
        <div class="container header-content">
            <h1><a href="/">Tech Todo Dia</a></h1>
            <nav>
                <a href="/">Início</a>
            </nav>
        </div>
    </header>
    <div class="wrapper">
        <main class="main-content">
            <h2>Últimos Posts</h2>
            <div class="posts-list">
                ${posts.map(post => `
                    <div class="post-card">
                        <div class="post-content">
                            <h3><a href="/posts/${post.slug}.html">${post.meta.title}</a></h3>
                            <p class="post-excerpt">${md.render(post.meta.excerpt || "").replace(/<[^>]*>/g, "").substring(0, 150)}...</p>
                            <div class="post-meta">
                                <span>🗓️ ${new Date(post.meta.date).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}</span>
                                <span>✍️ ${post.meta.author}</span>
                            </div>
                        </div>
                        ${post.meta.thumbnail ? `
                        <div class="post-image">
                            <img src="${post.meta.thumbnail}" alt="${post.meta.title}">
                        </div>
                        ` : ''}
                    </div>
                `).join("")}
            </div>
        </main>
        <aside class="sidebar">
            <div class="author-card">
                <img src="https://placehold.co/100x100" alt="Foto do Autor" class="author-avatar">
                <h3>Ricardo "Ricas" Costa Alves</h3>
                <p>Pai, tech freak e Neurodivergente</p>
            </div>
        </aside>
    </div>
    <footer>
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} Tech Todo Dia. Todos os direitos reservados.</p>
        </div>
    </footer>
</body>
</html>
`;

fs.writeFileSync(path.join(outputDir, "index.html"), indexHtml);

console.log("Blog gerado com sucesso na pasta public/!");

