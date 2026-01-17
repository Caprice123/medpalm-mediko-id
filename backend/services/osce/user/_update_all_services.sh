#!/bin/bash
# This script will be used to identify which files need updating
for file in *.js; do
  if head -1 "$file" | grep -q "const.*require"; then
    echo "$file needs updating"
  fi
done
