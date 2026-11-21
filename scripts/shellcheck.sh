#!/bin/sh
# Every file sw.js precaches must be committed before a push.
cd /home/user/words-and-improvising
miss=0
for f in $(grep -o "'[a-zA-Z0-9_./-]*'" sw.js | tr -d "'" | grep -E "^(src|brand|fonts|icons)/"); do
  git cat-file -e HEAD:$f 2>/dev/null || { echo "UNTRACKED IN SHELL: $f"; miss=1; }
done
[ $miss = 0 ] && echo "shell ok"
