#!/bin/bash

# Rename matches inside file and directory names
rename_case_sensitive() {
  find . -depth | while IFS= read -r f; do
    base=$(basename "$f")
    dir=$(dirname "$f")

    new_base=$base

    # Replace terms with case preservation
    new_base=$(echo "$new_base" | sed -e 's/aera.ac/aera.ac/g' \
                                      -e 's/Aera.ac/Aera.ac/g' \
                                      -e 's/AERA.AC/AERA.AC/g')

    new_base=$(echo "$new_base" | sed -e 's/aera/aera/g' \
                                      -e 's/Aera/Aera/g' \
                                      -e 's/AERA/AERA/g')

    new_base=$(echo "$new_base" | sed -e 's/aera/aera/g' \
                                      -e 's/Aera/Aera/g' \
                                      -e 's/AERA/AERA/g')

    if [[ "$base" != "$new_base" ]]; then
      mv "$f" "$dir/$new_base"
    fi
  done
}

# Run the renaming function
rename_case_sensitive
