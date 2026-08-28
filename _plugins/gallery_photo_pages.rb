module GalleryPhotoPages
  GALLERIES = %w[deambulations street-art under-water].freeze

  class Generator < Jekyll::Generator
    safe true

    def generate(site)
      GALLERIES.each { |gallery_name| generate_gallery(site, gallery_name) }
    end

    private

    def generate_gallery(site, gallery_name)
      photos = site.data[gallery_name]
      return unless photos

      base_pages = site.pages.select { |page| page.data["gallery"] == gallery_name }
      base_pages.each do |base_page|
        base_page.data["gallery_url"] = base_page.url
        photos.each { |photo| site.pages << photo_page(site, base_page, gallery_name, photo) }
      end
    end

    def photo_page(site, base_page, gallery_name, photo)
      slug = File.basename(photo["file"], File.extname(photo["file"]))
      lang = base_page.data["lang"]
      caption = photo["title-#{lang}"]

      page = Jekyll::PageWithoutAFile.new(site, site.source, File.join(base_page.url, slug), "index.html")
      page.content = base_page.content
      page.data.merge!(base_page.data)
      page.data["permalink"] = File.join(base_page.url, slug) + "/"
      page.data["ref"] = "#{gallery_name}-#{slug}"
      page.data["photo_slug"] = slug
      page.data["photo_caption"] = caption
      page.data["title"] = "Christophe Heubès - #{caption}"
      page.data["description"] = page.data["title"]
      page.data["image"] = "/content/#{gallery_name}/#{photo["file"]}"
      page
    end
  end
end
