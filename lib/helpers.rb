include Nanoc::Helpers::Blogging
include Nanoc::Helpers::Tagging
include Nanoc::Helpers::Rendering
include Nanoc::Helpers::LinkTo

def sorted_articles
  @items.select { |item| item[:kind] == 'article' || item.identifier.to_s.start_with?('/posts/') }
        .reject { |item| item[:draft] }
        .sort_by { |item| item[:date] || Date.new(1970, 1, 1) }
        .reverse
end

def format_date(date)
  return '' unless date
  Date.parse(date.to_s).strftime("%Y年%m月%d日")
end

def excerpt_for(item, length = 150)
  return item[:excerpt] if item[:excerpt]
  
  content = item.compiled_content(snapshot: :pre)
  return '' unless content
  
  # Remove HTML tags and get plain text
  text = content.gsub(/<[^>]*>/, '').strip
  
  if text.length > length
    text[0...length] + '...'
  else
    text
  end
end 