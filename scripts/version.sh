echo "Enter the new version:"
read version

# Update package.json
sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$version\"/" package.json

# Update index.html
sed -i '' "s/<!-- Version start -->.*<!-- Version end -->/<!-- Version start -->$version<!-- Version end -->/" src/static/pages/index.html

echo "Updated version to $version"