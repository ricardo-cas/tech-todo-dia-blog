---
layout: base.njk
title: Bem-vindo ao Meu Blog Obsidian
author: Ricardo "Ricas" 
---

# Últimos Posts

<ul>
{% for post in collections.posts | reverse %}
    <li>
        <a href="{{ post.url }}">{{ post.data.title }}</a>
        <br>
        <small>Publicado em: {{ post.date | readableDate }}</small>
        <br>
        <small>Por: {{ post.data.author }}</small>
    </li>
{% endfor %}
</ul>
