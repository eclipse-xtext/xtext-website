---
title: Release Notes
---
<div id="page">  
	<div class="inner">
		<div class="container">
			<br/>
				<div> 
					<h3>Table of Contents</h3>
					<ul>
						{{ range first 10 .Site.RegularPages }}
							{{ if eq .Section "releasenotes" }}
							<li><p><a href="#{{ .File.ContentBaseName }}">{{ .Title }} &mdash; {{ .Date.Format "Jan 2, 2006" }}</a></p>
							{{ end }}
						{{ end }}
					</ul>
				</div>
				{{ range first 10 .Site.RegularPages }}
				  {{ if eq .Section "releasenotes" }}
				  <hr/>
				  <section id="{{ .File.ContentBaseName }}">
				  	<h1>{{ .Title }}<small>&nbsp;&nbsp;{{ .Date.Format "Jan 2, 2006" }}</small></h1>
				    <br/>
				    {{ .Content }}
				  </section>
				  {{ end }}
				{{ end }}
			
		</div>
  	</div>
</div>
