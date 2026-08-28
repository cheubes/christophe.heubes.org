#!/usr/bin/env ruby
# frozen_string_literal: true
#
# Generates a resized "-thumb" copy of each gallery photo, used by the grid
# view instead of the full-resolution original (the lightbox and page
# previews keep using the original).
#
# Uses sips, bundled with macOS, so no new dependency is needed. Mirrors the
# less_compiler.rb approach for hbs.css: generated locally, committed to the
# repo, nothing added to the Jekyll build.
#
# Run after adding photos to _data/*.yml, then commit the resulting
# content/<gallery>/*-thumb.jpg files.
#
#   ruby scripts/generate_gallery_thumbnails.rb

require "yaml"

GALLERIES = %w[deambulations street-art under-water].freeze
MAX_DIMENSION = 800
QUALITY = 75

root = File.expand_path("..", __dir__)
count = 0

GALLERIES.each do |gallery|
  photos = YAML.load_file(File.join(root, "_data", "#{gallery}.yml"))

  photos.each do |photo|
    ext = File.extname(photo["file"])
    slug = File.basename(photo["file"], ext)
    src = File.join(root, "content", gallery, photo["file"])
    thumb = File.join(root, "content", gallery, "#{slug}-thumb#{ext}")

    next if File.exist?(thumb) && File.mtime(thumb) >= File.mtime(src)

    system("sips", "-Z", MAX_DIMENSION.to_s, "-s", "formatOptions", QUALITY.to_s, src, "--out", thumb, out: File::NULL)
    puts "Generated #{gallery}/#{File.basename(thumb)}"
    count += 1
  end
end

puts "Done (#{count} thumbnail#{'s' unless count == 1} generated)."
