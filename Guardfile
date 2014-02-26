require "active_support/core_ext" #To prevent some weird to_json method error

guard 'uglify', :input => 'js/robin-jsp.js', :output => "js/robin-jsp.min.js" do
  watch 'js/robin-jsp.js'
end

guard :copy, :from => 'js', :to => 'examples/js' do
	watch('js/robin-jsp.min.js')
end

guard :copy, :from => 'js', :to => '/Volumes/Extra HDD/Dropboxes/Bram/Dropbox/projects/js/jsdelivr/files/robinjsp', :absolute => true do
	watch('js/robin-jsp.min.js')
end