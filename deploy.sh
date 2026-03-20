#!/bin/bash
set -e

echo "Deploying to server via rsync..."
rsync -avz --delete dist/ pmeenan@plex:/var/www/blog.patrickmeenan.com/

echo "Deployment complete!"
