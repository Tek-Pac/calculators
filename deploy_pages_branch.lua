-- first we read the script data from the files

local used_files = {
   'index.html',
   'main.css',
   'scripts/Main.js',
   'scripts/theme.js',
}

local is_dirty
do
   local p = io.popen'git status -s'
   local a = p:read'a'
   p:close()
   is_dirty = a:find'%S' and a or false
end

if is_dirty then
   print('Please commit your changes before deploying:')
   print()
   print(is_dirty)
   return
end

local current_branch
do
   local p = io.popen'git branch --show-current'
   current_branch = p:read()
   p:close()
end

local curr_id
do
   local p = io.popen('git show ' .. current_branch .. ' -s --pretty=format:%H')
   curr_id = p:read()
   p:close()
end

-- the workflow is:
-- 1. read data from the files
-- 2. replace javascript and css names with timestamped ones for caching (they can possibly be left if they are the same as previous)
-- 3. Replace references in index.html
-- 4. `git checkout pages`
-- 5. Replace the files there.
-- 6. commit and push and then checkout master again

local ts = os.time()

local datename = os.date('%Y-%m-%d %H:%M:%S', ts)

local file_to_contents = {}

for _, v in ipairs(used_files) do
   local f = io.open(v, 'r')
   file_to_contents[v] = f:read'a'
   f:close()
end

local file_to_newfn = {}

for k in pairs(file_to_contents) do
   local s, ext = k:match'^(.*)(%.%w+)$'
   if ext == '.js' or ext == '.css' then
      -- we need a timestamp
      local newfn = s .. '.' .. ts .. ext
      file_to_newfn[k] = newfn
   end
end

-- we now map the contents of any html files with references

local function toplainpattern(str)
   return str:gsub('%W', '%%%0')
end

for k, v in pairs(file_to_contents) do
   if k:match'%.html?$' then
      for inp, outp in pairs(file_to_newfn) do
         v = v:gsub(toplainpattern(inp), outp)
      end
      file_to_contents[k] = v
   end
end

-- we now do our git execution

os.execute'git checkout pages'

-- delete files apart from .git

for item in io.popen'dir /S /A-D /B':lines() do
   if item:match'%.git' then
      goto next
   end

   local ext = item:match'%.%w+$'

   if ext == '.js' or ext == '.css' or ext == '.html' then
      print('removing ' .. item)
      os.remove(item)
   end

   ::next::
end

-- add in our files

for k, v in pairs(file_to_contents) do
   k = file_to_newfn[k] or k

   print('writing ' .. k)
   local f = io.open(k, 'wb')
   f:write(v)
   f:close()
end

-- add them to git

os.execute'git add *'

-- commit

os.execute('git commit -m "Deploy ' .. datename .. '" -m "Based on commit ' .. curr_id .. '"')

os.execute('git push')

os.execute('git checkout ' .. current_branch)
