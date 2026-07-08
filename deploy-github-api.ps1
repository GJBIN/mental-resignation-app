param(
    [Parameter(Mandatory = $true)]
    [string]$Owner,

    [Parameter(Mandatory = $true)]
    [string]$Repo,

    [Parameter(Mandatory = $true)]
    [string]$Token
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$headers = @{
    Authorization = "Bearer $Token"
    Accept = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
    'User-Agent' = 'mental-resignation-app-deployer'
}

function Invoke-GitHubJson {
    param(
        [Parameter(Mandatory = $true)] [string]$Method,
        [Parameter(Mandatory = $true)] [string]$Uri,
        [object]$Body = $null
    )

    $parameters = @{
        Method = $Method
        Uri = $Uri
        Headers = $headers
    }

    if ($null -ne $Body) {
        $parameters.ContentType = 'application/json; charset=utf-8'
        $parameters.Body = ($Body | ConvertTo-Json -Depth 20)
    }

    Invoke-RestMethod @parameters
}

$files = @(
    'index.html',
    'styles.css',
    'app.js',
    'README.md',
    '.nojekyll'
)

$repoInfo = Invoke-GitHubJson -Method Get -Uri "https://api.github.com/repos/$Owner/$Repo"
$branch = if ($repoInfo.default_branch) { $repoInfo.default_branch } else { 'main' }

foreach ($file in $files) {
    $path = Join-Path $root $file
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing file: $file"
    }

    $bytes = [System.IO.File]::ReadAllBytes($path)
    $content = [Convert]::ToBase64String($bytes)
    $fileUri = "https://api.github.com/repos/$Owner/$Repo/contents/$file"
    $sha = $null

    try {
        $existing = Invoke-GitHubJson -Method Get -Uri "$fileUri?ref=$branch"
        $sha = $existing.sha
    } catch {
        $sha = $null
    }

    $body = @{
        message = "Deploy $file"
        content = $content
        branch = $branch
    }

    if ($sha) {
        $body.sha = $sha
    }

    Invoke-GitHubJson -Method Put -Uri $fileUri -Body $body | Out-Null
    Write-Host "Uploaded $file"
}

try {
    Invoke-GitHubJson -Method Post -Uri "https://api.github.com/repos/$Owner/$Repo/pages" -Body @{
        source = @{
            branch = $branch
            path = '/'
        }
    } | Out-Null
    Write-Host "GitHub Pages enabled"
} catch {
    $message = $_.Exception.Message
    if ($message -match 'already exists|409') {
        Write-Host "GitHub Pages already enabled"
    } else {
        throw
    }
}

try {
    $pages = Invoke-GitHubJson -Method Get -Uri "https://api.github.com/repos/$Owner/$Repo/pages"
    Write-Host "Pages URL: $($pages.html_url)"
} catch {
    Write-Host "Pages URL: https://$Owner.github.io/$Repo/"
}
