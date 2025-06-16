---
layout: base.njk
title: Bem-vindo ao Meu Blog Obsidian
author: Ricardo "Ricas" 
date: 2025-06-16
---

<div class="posts-list">
{% for post in collections.posts | reverse %}
    <div class="post-card">
        <div class="post-content">
            <h3><a href="{{ post.url }}">{{ post.data.title }}</a></h3>
            <p class="post-excerpt">{{ post.templateContent | striptags | truncate(150) }}</p>
            <div class="post-meta">
                <span>🗓️ {{ post.date | readableDate }}</span>
                <span>✍️ {{ post.data.author }}</span>
                {# Você pode adicionar ícones para visualizações ou comentários aqui se tiver dados para isso #}
            </div>
        </div>
        {# Se você quiser adicionar imagens de destaque para os posts, precisará adicionar um campo no front matter do post (ex: featuredImage: /caminho/para/imagem.jpg) e depois exibir aqui: #}
        {# <div class="post-image">
            <img src="{{ post.data.featuredImage }}" alt="{{ post.data.title }}">
        </div> #}
    </div>
{% endfor %}
</div>
