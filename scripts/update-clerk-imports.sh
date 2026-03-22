#!/bin/bash

# Update all @clerk/clerk-react imports to @clerk/nextjs
find /vercel/share/v0-project/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/@clerk\/clerk-react/@clerk\/nextjs/g' {} +

echo "Updated all @clerk/clerk-react imports to @clerk/nextjs"
