echo "Current version:" $(grep -o '"version": "[0-9]*\.[0-9]*\.[0-9]*' package.json | grep -o '[0-9]*\.[0-9]*\.[0-9]*')
echo "Enter the new version:"
read version

# Update package.json
sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$version\"/" package.json

# Update index.html
sed -i '' "s/<!-- Version start -->.*<!-- Version end -->/<!-- Version start -->$version<!-- Version end -->/" src/static/pages/index.html

# Update swagger config
sed -i '' "s/version: \"[0-9]*\.[0-9]*\.[0-9]*\"/version: \"$version\"/" src/config/swagger.ts

echo "Updated version to $version"