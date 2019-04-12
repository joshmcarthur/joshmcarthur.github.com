---
permalink: /uses/
layout: post
---

<dl>
{% for tool in site.data.uses %}
  <dt><a href="{{tool.url}}">{{tool.name}}</a></dt>
  <dd>{{tool.description | markdownify }}</dd>
{% endfor %}
</dl>

