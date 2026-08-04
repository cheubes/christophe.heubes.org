#!/usr/bin/env ruby
# frozen_string_literal: true
#
# Regenerates the static technical-drawing detail pages (one per drawing per
# language) from _data/technical-drawing.yml.
#
# GitHub Pages builds this site with Jekyll's safe mode, which ignores
# _plugins/, so these pages can't be generated at deploy time. Run this
# script after editing _data/technical-drawing.yml, then commit the
# resulting content/technical-drawing/*.md files.
#
#   ruby scripts/generate_technical_drawing_pages.rb

require "yaml"

root = File.expand_path("..", __dir__)
drawings = YAML.load_file(File.join(root, "_data/technical-drawing.yml"))
output_dir = File.join(root, "content/technical-drawing")

locales = {
  "fr" => { "prefix" => "", "flag" => "🇫🇷", "suffix" => "" },
  "en" => { "prefix" => "/en", "flag" => "🇬🇧", "suffix" => "-en" }
}

count = 0

drawings.each do |item|
  id = item["id"]

  locales.each do |lang, locale|
    title = lang == "fr" ? item["fr-title"] : item["en-title"]

    front_matter = <<~MARKDOWN
      ---

      layout: technical-drawing-detail
      ref: technical-drawing-#{id}
      permalink: #{locale["prefix"]}/technical-drawing/#{id}/

      lang: #{lang}
      flag: #{locale["flag"]}

      title: #{title} - Christophe Heubès
      description: #{title}
      image: /content/technical-drawing/#{id}-2020.jpg

      drawing-id: #{id}
      drawing-title: #{title}

      ---
    MARKDOWN

    File.write(File.join(output_dir, "#{id}#{locale["suffix"]}.md"), front_matter)
    count += 1
  end
end

puts "Generated #{count} technical drawing detail pages in #{output_dir}"
