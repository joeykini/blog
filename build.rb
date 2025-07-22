#!/usr/bin/env ruby

# 構建腳本
puts "🚀 開始構建部落格..."

# 檢查 Nanoc 是否安裝
begin
  require 'nanoc'
  puts "✅ Nanoc 已安裝"
rescue LoadError
  puts "❌ 請先安裝 Nanoc: bundle install"
  exit 1
end

# 構建網站
system("nanoc compile")
if $?.success?
  puts "✅ 構建完成！"
  puts "📁 輸出目錄: output/"
  puts "🌐 本地預覽: nanoc view"
else
  puts "❌ 構建失敗"
  exit 1
end 