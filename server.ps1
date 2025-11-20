$port = 3000
$root = "$PSScriptRoot"

# Create a TcpListener that listens on 0.0.0.0 (Any)
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()

Write-Host "Server running at http://0.0.0.0:$port/"
Write-Host "You can access this from other devices using your LAN IP."
Write-Host "Press Ctrl+C to stop."

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
}

try {
    while ($true) {
        if ($listener.Pending()) {
            $client = $listener.AcceptTcpClient()
            $stream = $client.GetStream()
            $buffer = New-Object byte[] 4096
            $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
            $requestString = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $bytesRead)
            
            # Parse Request Line (GET /path HTTP/1.1)
            $requestLines = $requestString -split "\r\n"
            $requestLine = $requestLines[0]
            $parts = $requestLine -split " "
            
            if ($parts.Length -ge 2) {
                $method = $parts[0]
                $url = $parts[1]
                
                if ($method -eq "GET") {
                    if ($url -eq "/") { $url = "/index.html" }
                    
                    # Remove query strings
                    if ($url.Contains("?")) { $url = $url.Split("?")[0] }
                    
                    $localPath = Join-Path $root $url.TrimStart('/')
                    
                    if (Test-Path $localPath -PathType Leaf) {
                        $extension = [System.IO.Path]::GetExtension($localPath)
                        $contentType = $mimeTypes[$extension]
                        if (-not $contentType) { $contentType = "application/octet-stream" }
                        
                        $content = [System.IO.File]::ReadAllBytes($localPath)
                        $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($content.Length)`r`nConnection: close`r`n`r`n"
                        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                        
                        $stream.Write($headerBytes, 0, $headerBytes.Length)
                        $stream.Write($content, 0, $content.Length)
                    }
                    else {
                        $header = "HTTP/1.1 404 Not Found`r`nConnection: close`r`n`r`n"
                        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                        $stream.Write($headerBytes, 0, $headerBytes.Length)
                    }
                }
            }
            $client.Close()
        }
        Start-Sleep -Milliseconds 10
    }
}
finally {
    $listener.Stop()
}
