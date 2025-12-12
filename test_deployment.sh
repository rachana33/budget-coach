#!/bin/bash

# Test deployment configuration locally before pushing to Render

echo "🧪 Testing Budget Coach Deployment Configuration..."
echo ""

# Check if required files exist
echo "📋 Checking required files..."
files=("render.yaml" "requirements.txt" "frontend/package.json" ".gitignore" "DEPLOYMENT.md")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
        exit 1
    fi
done
echo ""

# Check Python dependencies
echo "🐍 Checking Python dependencies..."
if pip list | grep -q "fastapi"; then
    echo "  ✅ FastAPI installed"
else
    echo "  ❌ FastAPI not installed. Run: pip install -r requirements.txt"
    exit 1
fi

if pip list | grep -q "psycopg2"; then
    echo "  ✅ PostgreSQL driver installed"
else
    echo "  ❌ psycopg2-binary not installed. Run: pip install -r requirements.txt"
    exit 1
fi
echo ""

# Check Node dependencies
echo "📦 Checking Node dependencies..."
if [ -d "frontend/node_modules" ]; then
    echo "  ✅ Node modules installed"
else
    echo "  ⚠️  Node modules not installed. Run: cd frontend && npm install"
fi
echo ""

# Test backend build
echo "🔨 Testing backend..."
python -c "from backend.app.main import app; print('  ✅ Backend imports successfully')" || {
    echo "  ❌ Backend import failed"
    exit 1
}
echo ""

# Test frontend build
echo "🎨 Testing frontend build..."
cd frontend
if npm run build > /dev/null 2>&1; then
    echo "  ✅ Frontend builds successfully"
    rm -rf dist
else
    echo "  ❌ Frontend build failed"
    exit 1
fi
cd ..
echo ""

# Check environment variables
echo "🔐 Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "OPENAI_API_KEY" .env; then
        echo "  ✅ OPENAI_API_KEY found in .env"
    else
        echo "  ⚠️  OPENAI_API_KEY not found in .env"
    fi
else
    echo "  ⚠️  .env file not found (needed for local development)"
fi
echo ""

# Check git status
echo "📝 Git status..."
if [ -d ".git" ]; then
    echo "  ✅ Git repository initialized"
    
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "  ⚠️  You have uncommitted changes"
        echo ""
        echo "  To commit and push:"
        echo "    git add ."
        echo "    git commit -m 'Prepare for deployment'"
        echo "    git push"
    else
        echo "  ✅ No uncommitted changes"
    fi
else
    echo "  ⚠️  Not a git repository. Initialize with:"
    echo "    git init"
    echo "    git add ."
    echo "    git commit -m 'Initial commit'"
fi
echo ""

echo "✅ All checks passed! Ready for deployment."
echo ""
echo "📚 Next steps:"
echo "  1. Push code to GitHub"
echo "  2. Connect repository to Render"
echo "  3. Deploy using render.yaml blueprint"
echo "  4. Add OPENAI_API_KEY environment variable in Render"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
