#!/bin/bash

echo "Delete unnecessary files for hosting 5etools..."

rm *.md *.json *.yml || true
rm .gitignore .gitmodules .eslintrc.js .stylelintrc.json .editorconfig || true
rm -r test/ || true
rm -r node/ || true
rm -r node_modules/ || true
rm -r build/ || true
rm -r .git || true
rm -r .github || true
