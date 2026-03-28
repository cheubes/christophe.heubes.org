Jekyll::Hooks.register :site, :pre_render do |site|
  less_src = File.join(site.source, "assets/css/hbs.less")
  css_dest = File.join(site.source, "assets/dist/css/hbs.css")

  if !File.exist?(css_dest) || File.mtime(less_src) > File.mtime(css_dest)
    system("lessc --compress #{less_src} #{css_dest}")
  end
end
