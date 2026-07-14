# POS Frontend Structure Setup Script
Write-Host "Setting up POS frontend structure..." -ForegroundColor Green

# Define folders to create
$folders = @(
    "src/components",
    "src/pages", 
    "src/components/layout",
    "src/components/pos",
    "src/components/dashboard",
    "src/components/common"
)

# Define files to create
$files = @(
    "src/components/layout/Layout.jsx",
    "src/components/layout/Header.jsx", 
    "src/components/layout/Sidebar.jsx",
    "src/components/pos/ProductGrid.jsx",
    "src/components/pos/Cart.jsx",
    "src/components/pos/CategoryFilter.jsx",
    "src/components/pos/QuickActions.jsx",
    "src/pages/POS.jsx",
    "src/pages/Dashboard.jsx",
    "src/pages/Products.jsx",
    "src/pages/Customers.jsx"
)

# Create folders
Write-Host "Creating folders..." -ForegroundColor Yellow
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "  ✓ Created: $folder" -ForegroundColor Green
    } else {
        Write-Host "  ⓘ Already exists: $folder" -ForegroundColor Blue
    }
}

# Create files
Write-Host "Creating files..." -ForegroundColor Yellow
foreach ($file in $files) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file -Force | Out-Null
        Write-Host "  ✓ Created: $file" -ForegroundColor Green
    } else {
        Write-Host "  ⓘ Already exists: $file" -ForegroundColor Blue
    }
}

Write-Host "`nFolder structure created successfully!" -ForegroundColor Green
Write-Host "Now you need to add the component code to each file." -ForegroundColor Yellow