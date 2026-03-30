
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Add()
    $selection = $word.Selection

    $content = Get-Content -Path "C:\Users\Hager Magdy\.gemini\antigravity\brain\7090b6d4-0950-4c30-93ef-f352ee34282d\implementation_plan.md" -Raw

    foreach ($line in $content -split "`r`n") {
        if ($line.StartsWith("# ")) {
            $selection.Style = "Heading 1"
            $selection.TypeText($line.Substring(2))
            $selection.TypeParagraph()
        } elseif ($line.StartsWith("## ")) {
            $selection.Style = "Heading 2"
            $selection.TypeText($line.Substring(3))
            $selection.TypeParagraph()
        } elseif ($line.StartsWith("### ")) {
            $selection.Style = "Heading 3"
            $selection.TypeText($line.Substring(4))
            $selection.TypeParagraph()
        } else {
            $selection.Style = "Normal"
            $selection.TypeText($line)
            $selection.TypeParagraph()
        }
    }

    $outputPath = "c:\Users\Hager Magdy\Downloads\muhimma-app\Muhimma_App_Roadmap.docx"
    $doc.SaveAs([ref]$outputPath)
    $doc.Close()
    $word.Quit()
    Write-Output "Successfully created Word document at $outputPath"
} catch {
    Write-Error "Failed to create Word document: $($_.Exception.Message)"
    if ($word) { $word.Quit() }
}
