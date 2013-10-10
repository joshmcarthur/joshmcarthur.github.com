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


# Usage: rake post title="A Title" [date="2012-02-09"]
desc "Begin a new post in #{CONFIG['posts']}"
task :post do
  abort("rake aborted: '#{CONFIG['posts']}' directory not found.") unless FileTest.directory?(CONFIG['posts'])
  title = ENV["title"] || "new-post"
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  begin
    date = (ENV['date'] ? Time.parse(ENV['date']) : Time.now).strftime('%Y-%m-%d')
  rescue Exception => e
    puts "Error - date format must be YYYY-MM-DD, please check you typed it correctly!"
    exit -1
  end
  filename = File.join(CONFIG['posts'], "#{date}-#{slug}.#{CONFIG['post_ext']}")
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
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
  end
end # task :post

desc "Sync Gists from github account into posts"
task :sync_gists do
  username = ENV['username'] || 'joshmcarthur'

  puts "Getting Gists"
  gists = JSON.parse(open("https://api.github.com/users/#{username}/gists").read)
  puts "Found #{gists.size} gists"

  gists.each do |gist|
    puts "Matching gist to known filename"
    filename = "#{Date.parse(gist['created_at']).strftime('%Y-%m-%d')}-gist-#{gist['id']}.markdown"
    if File.exists?(File.join(CONFIG['posts'], filename))
      puts "Gist #{gist['id']} already has a post"
      next
    end

    puts "Creating post for gist #{gist['id']}"
    open(File.join(CONFIG['posts'], filename), 'w') do |post|
      post.puts "---"
      post.puts "layout: gist"
      post.puts "title: \"#{gist['description']}\""
      post.puts 'description: ""'
      post.puts "category: gist"
      post.puts "tags: []"
      post.puts "---"

      gist['files'].values.each do |file_info|
        post.puts "<section role=\"snippet\">"
        post.puts "<h1>#{file_info['filename']}</h1>"
        post.puts "{% highlight #{file_info['type'].gsub('application/', '')} linenos%}"
        post.puts open(file_info['raw_url']).read
        post.puts "{% endhighlight %}"
        post.puts "</section>"
      end
    end
  end
end

