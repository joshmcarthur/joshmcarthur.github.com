require "rubygems"
require 'rake'
require 'yaml'
require 'time'
require 'open-uri'
require 'json'

SOURCE = "."
CONFIG = {
  'posts' => File.join(SOURCE, "_posts"),
  'post_ext' => "md",
}


desc "compile and run the site"
task :default do
  pids = [
    spawn("jekyll serve --watch"), # put `auto: true` in your _config.yml
    spawn("scss --watch assets:stylesheets"),
  ]

  trap "INT" do
    Process.kill "INT", *pids
    exit 1
  end

  loop do
    sleep 1
  end
end

# Usage: rake post title="A Title" [date="2012-02-09"]
desc "Begin a new post in #{CONFIG['posts']}"
task :post do
  abort("rake aborted: '#{CONFIG['posts']}' directory not found.") unless FileTest.directory?(CONFIG['posts'])
  title = ENV["title"] || "new-post"
  begin
    date = (ENV['date'] ? Time.parse(ENV['date']) : Time.now).strftime('%Y-%m-%d')
  rescue Exception => e
    puts "Error - date format must be YYYY-MM-DD, please check you typed it correctly!"
    exit -1
  end

  create_post(date,title)
end # task :post

desc "Create a post stub from a Gist"
task :post_from_gist do
  username = ENV['username'] || 'joshmcarthur'
  gist_id = ENV['gist']
  abort('Gist not provided') unless gist_id

  gist_id = gist_id.match(/\/([0-9]{1,30})\Z/).captures.first if gist_id.start_with?("htt")

  puts "Fetching Gist ##{gist_id}"
  gist = JSON.parse(open("https://api.github.com/gists/#{gist_id}").read)

  title = ENV["title"] || "Code snippet: #{Date.parse(gist['created_at']).strftime('%-d %b %Y')}"

  begin
    date = (ENV['date'] ? Time.parse(ENV['date']) : Time.now).strftime('%Y-%m-%d')
  rescue Exception => e
    puts "Error - date format must be YYYY-MM-DD, please check you typed it correctly!"
    exit -1
  end

  content = ""
  content << gist['description'] + "\n"
  content << "{% gist #{gist['id']} %}"

  create_post(date, title, content)
end


private

def create_post(date, title, content = nil)
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  filename = File.join(CONFIG['posts'], "#{date}-#{slug}.#{CONFIG['post_ext']}")
  if File.exist?(filename)
    abort("#{filename} already exists.")
  end

  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/-/,' ')}\""
    post.puts 'description: ""'
    post.puts "category: "
    post.puts "tags: []"
    post.puts "---"
    post.puts content if content
  end
end

