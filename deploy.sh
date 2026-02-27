#!/bin/bash
set -e

echo "Building the Astro site..."
npm run build

echo "Deploying to server via rsync..."
rsync -avz --delete dist/ pmeenan@plex:/var/www/blog.patrickmeenan.com/

echo "Deployment complete!"
