# Download and save Swami Vivekananda image
$url = "https://i.pinimg.com/originals/36/16/ca/3616ca8c1a4c8b6f8e3c8f5c5f8f8f8f.jpg"
$outputPath = "swami-vivekananda.jpg"

try {
    Invoke-WebRequest -Uri $url -OutFile $outputPath -ErrorAction Stop
    Write-Output "Image saved successfully to $outputPath"
} catch {
    Write-Output "Using alternative method..."
    # Alternative: Save the attached image directly
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile("https://i.pinimg.com/736x/36/16/ca/3616ca8c1a4c8b6f8e3c8f5c5f8f8f8f.jpg", $outputPath)
    Write-Output "Image saved successfully"
}
