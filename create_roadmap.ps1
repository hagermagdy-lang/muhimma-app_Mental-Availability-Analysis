
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Add()
    $selection = $word.Selection

    # --- Helper Functions ---
    function Write-Heading($sel, $text, $level) {
        $sel.Style = "Heading $level"
        $sel.Font.Color = 15 # wdColorAutomatic
        $sel.TypeText($text)
        $sel.TypeParagraph()
    }

    function Write-Normal($sel, $text) {
        $sel.Style = "Normal"
        $sel.Font.Size = 11
        $sel.Font.Name = "Calibri"
        $sel.Font.Color = 0
        $sel.Font.Bold = $false
        $sel.TypeText($text)
        $sel.TypeParagraph()
    }

    function Write-Bold($sel, $text) {
        $sel.Style = "Normal"
        $sel.Font.Size = 11
        $sel.Font.Name = "Calibri"
        $sel.Font.Bold = $true
        $sel.TypeText($text)
        $sel.Font.Bold = $false
        $sel.TypeParagraph()
    }

    function Write-BulletBold($sel, $boldPart, $normalPart) {
        $sel.Range.ListFormat.ApplyBulletDefault()
        $sel.Font.Bold = $true
        $sel.Font.Size = 11
        $sel.TypeText($boldPart)
        $sel.Font.Bold = $false
        $sel.TypeText($normalPart)
        $sel.TypeParagraph()
        $sel.Range.ListFormat.RemoveNumbers()
    }

    function Write-Bullet($sel, $text) {
        $sel.Range.ListFormat.ApplyBulletDefault()
        $sel.Font.Bold = $false
        $sel.Font.Size = 11
        $sel.TypeText($text)
        $sel.TypeParagraph()
        $sel.Range.ListFormat.RemoveNumbers()
    }

    function Write-Spacer($sel) {
        $sel.Style = "Normal"
        $sel.Font.Size = 6
        $sel.TypeText(" ")
        $sel.TypeParagraph()
    }

    # =============================================
    # DOCUMENT CONTENT
    # =============================================

    # --- Title ---
    Write-Heading $selection "Muhimma - Mental Availability Dashboard" 1

    Write-Normal $selection "Product Roadmap & Feature Review"
    Write-Normal $selection "Prepared: March 29, 2026"
    Write-Normal $selection "Document Owner: Product Management"
    Write-Spacer $selection

    # --- Section 1: Product Overview ---
    Write-Heading $selection "1. Product Overview" 2

    Write-Normal $selection "Muhimma is a web-based Mental Availability analytics dashboard built on the Ehrenberg-Bass Institute framework. It enables brand researchers and marketers to upload raw survey data (Wide Text CSV format) and instantly visualize key brand health metrics."
    Write-Spacer $selection

    Write-Bold $selection "Current Tech Stack:"
    Write-Bullet $selection "Frontend: React 19 + Vite 8 + TailwindCSS 3.4"
    Write-Bullet $selection "Routing: React Router v7 (Layout with Outlet context)"
    Write-Bullet $selection "Data: PapaParse for CSV parsing, custom dataProcessor.js engine"
    Write-Bullet $selection "Charts: Recharts 3.8 (installed but underutilized)"
    Write-Spacer $selection

    Write-Bold $selection "Current Pages (4 screens):"
    Write-Bullet $selection "Data Import - CSV upload with drag-and-drop"
    Write-Bullet $selection "Executive Summary - KPI cards + brand performance table"
    Write-Bullet $selection "Brand Analysis - Deep dive per-brand with CEP breakdown"
    Write-Bullet $selection "CEP Grid - Heatmap matrix of Brand x CEP associations"
    Write-Spacer $selection

    # --- Section 2: Current State Audit ---
    Write-Heading $selection "2. Current State Audit - Issues & Gaps" 2

    Write-Heading $selection "2.1 Critical Bugs" 3
    Write-BulletBold $selection "Data loss on page refresh: " "processedData lives only in React state (useState). Any browser refresh wipes all imported data. Users must re-upload their CSV every time."
    Write-BulletBold $selection "Preview route is orphaned: " "The /preview route uses a DataPreview component but is disconnected from the main navigation bar. Users cannot navigate back to it."
    Write-BulletBold $selection "JSX typo in ExecutiveSummary: " "Line 61 uses 'class' instead of 'className' for the Average Network Size card, which will silently fail in React."
    Write-Spacer $selection

    Write-Heading $selection "2.2 UX Gaps" 3
    Write-BulletBold $selection "No loading/empty states on navigation: " "If a user navigates directly to /brand-analysis without uploading data, they see a basic 'No Data' message with no visual guidance."
    Write-BulletBold $selection "Brand Analysis placeholder: " "The 'Internal Penetration Trend' chart area shows 'Placeholder for Historical Data' but Recharts is already installed and unused."
    Write-BulletBold $selection "CEP Grid heatmap percentages are misleading: " "Percentages are calculated as (brand CEP count / brand total associations), not (brand CEP count / total respondents). This shows distribution within a brand, not actual penetration per CEP."
    Write-BulletBold $selection "No brand normalization: " "Verbatim entries like 'Pepsi', 'pepsi', 'PEPSI' are treated as three separate brands."
    Write-Spacer $selection

    Write-Heading $selection "2.3 Technical Debt" 3
    Write-BulletBold $selection "Unused components: " "BrandStrengthMap.jsx, old CEPGrid.jsx, old DataImport.jsx, and KPICards.jsx in /components are not referenced by any page."
    Write-BulletBold $selection "No test coverage: " "test-parser.js and test-browser.js exist but are not integrated into a test runner."
    Write-BulletBold $selection "Typo in data model: " "'repondentsWithAtLeastOne' (missing 's') is used throughout dataProcessor.js and metrics.js."
    Write-Spacer $selection

    # --- Section 3: Roadmap ---
    Write-Heading $selection "3. Product Roadmap" 2

    # --- Phase 1 ---
    Write-Heading $selection "Phase 1: Stability & Data Integrity (Week 1-2)" 3
    Write-Normal $selection "Goal: Make the current app production-ready by fixing all critical bugs."
    Write-Spacer $selection

    Write-Bold $selection "P1-01: Persist imported data across sessions"
    Write-Bullet $selection "Store processedData in sessionStorage after parsing"
    Write-Bullet $selection "On app mount, hydrate state from sessionStorage if available"
    Write-Bullet $selection "Priority: CRITICAL | Effort: Small"
    Write-Spacer $selection

    Write-Bold $selection "P1-02: Fix JSX class/className typo"
    Write-Bullet $selection "ExecutiveSummary.jsx line 61: change 'class' to 'className'"
    Write-Bullet $selection "Priority: HIGH | Effort: Trivial"
    Write-Spacer $selection

    Write-Bold $selection "P1-03: Brand name normalization"
    Write-Bullet $selection "Auto-lowercase and trim all brand names during parsing"
    Write-Bullet $selection "Add a post-import 'Review Brands' step where users can merge duplicates"
    Write-Bullet $selection "Priority: HIGH | Effort: Medium"
    Write-Spacer $selection

    Write-Bold $selection "P1-04: Fix CEP Grid percentage formula"
    Write-Bullet $selection "Change from (count / brand total) to (count / total respondents) for true Mental Penetration per CEP"
    Write-Bullet $selection "Priority: HIGH | Effort: Small"
    Write-Spacer $selection

    Write-Bold $selection "P1-05: Clean up unused components"
    Write-Bullet $selection "Remove or archive: BrandStrengthMap.jsx, old CEPGrid.jsx, old DataImport.jsx, KPICards.jsx"
    Write-Bullet $selection "Priority: LOW | Effort: Trivial"
    Write-Spacer $selection

    # --- Phase 2 ---
    Write-Heading $selection "Phase 2: Visualization & Insights (Week 3-5)" 3
    Write-Normal $selection "Goal: Transform raw numbers into actionable visual insights using Recharts."
    Write-Spacer $selection

    Write-Bold $selection "P2-01: Executive Summary - KPI Trend Sparklines"
    Write-Bullet $selection "Add mini bar charts showing brand ranking by MMS, MPen, and NS"
    Write-Bullet $selection "Use Recharts BarChart with custom tooltips"
    Write-Bullet $selection "Priority: HIGH | Effort: Medium"
    Write-Spacer $selection

    Write-Bold $selection "P2-02: Brand Analysis - Radar Chart"
    Write-Bullet $selection "Replace the 'Placeholder for Historical Data' section"
    Write-Bullet $selection "Show a radar/spider chart of CEP strengths per selected brand"
    Write-Bullet $selection "Allow overlay comparison of 2 brands simultaneously"
    Write-Bullet $selection "Priority: HIGH | Effort: Medium"
    Write-Spacer $selection

    Write-Bold $selection "P2-03: CEP Grid - True Heatmap with Color Legend"
    Write-Bullet $selection "Add a gradient color legend (0% to max%)"
    Write-Bullet $selection "Add row/column sorting (by brand strength or CEP popularity)"
    Write-Bullet $selection "Highlight cells on hover with tooltip showing exact count"
    Write-Bullet $selection "Priority: MEDIUM | Effort: Medium"
    Write-Spacer $selection

    Write-Bold $selection "P2-04: Brand Comparison View (NEW PAGE)"
    Write-Bullet $selection "Side-by-side comparison of 2-3 selected brands"
    Write-Bullet $selection "Overlay radar charts, bar charts for MPen/NS/MMS"
    Write-Bullet $selection "Priority: MEDIUM | Effort: Large"
    Write-Spacer $selection

    # --- Phase 3 ---
    Write-Heading $selection "Phase 3: Export & Collaboration (Week 6-7)" 3
    Write-Normal $selection "Goal: Enable sharing results with stakeholders who don't use the app."
    Write-Spacer $selection

    Write-Bold $selection "P3-01: Export to Excel"
    Write-Bullet $selection "Export the full Brand Performance Index table as .xlsx"
    Write-Bullet $selection "Include separate sheets: Summary, CEP Grid raw data, Brand details"
    Write-Bullet $selection "Priority: HIGH | Effort: Medium"
    Write-Spacer $selection

    Write-Bold $selection "P3-02: Export to PDF Report"
    Write-Bullet $selection "Generate a branded PDF with all dashboard visuals"
    Write-Bullet $selection "Include company logo placeholder, date, and auto-generated insights"
    Write-Bullet $selection "Priority: MEDIUM | Effort: Large"
    Write-Spacer $selection

    Write-Bold $selection "P3-03: Shareable Dashboard Link"
    Write-Bullet $selection "Encode processedData into a compressed URL parameter or short-lived server link"
    Write-Bullet $selection "Allow read-only viewing without re-uploading"
    Write-Bullet $selection "Priority: LOW | Effort: Large"
    Write-Spacer $selection

    # --- Phase 4 ---
    Write-Heading $selection "Phase 4: Advanced Analytics (Week 8-12)" 3
    Write-Normal $selection "Goal: Elevate the tool from a dashboard to a strategic decision-making platform."
    Write-Spacer $selection

    Write-Bold $selection "P4-01: Mental Advantage Gap Analysis"
    Write-Bullet $selection "Allow users to input actual market share data alongside survey results"
    Write-Bullet $selection "Calculate Mental Advantage = Mental Market Share - Actual Market Share"
    Write-Bullet $selection "Visualize with a quadrant chart: Over-performing / Under-performing brands"
    Write-Bullet $selection "Priority: HIGH | Effort: Large"
    Write-Spacer $selection

    Write-Bold $selection "P4-02: Historical Tracking & Wave Comparison"
    Write-Bullet $selection "Support uploading multiple survey waves (e.g., Q1 vs Q3)"
    Write-Bullet $selection "Show trend lines for MPen, NS, and MMS over time"
    Write-Bullet $selection "Priority: MEDIUM | Effort: Large"
    Write-Spacer $selection

    Write-Bold $selection "P4-03: Multi-Format Data Support"
    Write-Bullet $selection "Support Long-Format CSV (each row = one respondent x one CEP x one brand)"
    Write-Bullet $selection "Auto-detect format on upload"
    Write-Bullet $selection "Priority: LOW | Effort: Medium"
    Write-Spacer $selection

    Write-Bold $selection "P4-04: AI-Powered Insights"
    Write-Bullet $selection "Auto-generate executive summary text from the data"
    Write-Bullet $selection "Identify statistical anomalies (e.g., brand with unusually high NS but low MPen)"
    Write-Bullet $selection "Priority: LOW | Effort: Large"
    Write-Spacer $selection

    # --- Section 4: Summary Table ---
    Write-Heading $selection "4. Priority Summary" 2

    $table = $doc.Tables.Add($selection.Range, 17, 4)
    $table.Borders.Enable = $true
    $table.Style = "Grid Table 4 - Accent 1"

    # Headers
    $table.Cell(1,1).Range.Text = "ID"
    $table.Cell(1,2).Range.Text = "Feature"
    $table.Cell(1,3).Range.Text = "Priority"
    $table.Cell(1,4).Range.Text = "Effort"

    # Row data
    $rows = @(
        @("P1-01", "Session-based data persistence", "CRITICAL", "Small"),
        @("P1-02", "Fix class/className typo", "HIGH", "Trivial"),
        @("P1-03", "Brand name normalization", "HIGH", "Medium"),
        @("P1-04", "Fix CEP Grid percentage formula", "HIGH", "Small"),
        @("P1-05", "Clean up unused components", "LOW", "Trivial"),
        @("P2-01", "Executive Summary sparklines", "HIGH", "Medium"),
        @("P2-02", "Brand Analysis radar chart", "HIGH", "Medium"),
        @("P2-03", "CEP Grid heatmap improvements", "MEDIUM", "Medium"),
        @("P2-04", "Brand Comparison page", "MEDIUM", "Large"),
        @("P3-01", "Export to Excel", "HIGH", "Medium"),
        @("P3-02", "Export to PDF", "MEDIUM", "Large"),
        @("P3-03", "Shareable dashboard link", "LOW", "Large"),
        @("P4-01", "Mental Advantage Gap", "HIGH", "Large"),
        @("P4-02", "Historical wave tracking", "MEDIUM", "Large"),
        @("P4-03", "Multi-format data support", "LOW", "Medium"),
        @("P4-04", "AI-powered insights", "LOW", "Large")
    )

    for ($i = 0; $i -lt $rows.Length; $i++) {
        $table.Cell($i+2, 1).Range.Text = $rows[$i][0]
        $table.Cell($i+2, 2).Range.Text = $rows[$i][1]
        $table.Cell($i+2, 3).Range.Text = $rows[$i][2]
        $table.Cell($i+2, 4).Range.Text = $rows[$i][3]
    }

    # Move cursor after table
    $selection.EndOf(6) | Out-Null  # wdStory
    $selection.TypeParagraph()
    $selection.TypeParagraph()

    # --- Section 5: Open Questions ---
    Write-Heading $selection "5. Open Questions for Stakeholders" 2

    Write-Bold $selection "1. Target Audience"
    Write-Normal $selection "Is the primary user a professional researcher who needs raw data tables, or a Brand Manager who needs high-level executive visuals? This impacts whether we prioritize data export (Phase 3) or visualization polish (Phase 2)."
    Write-Spacer $selection

    Write-Bold $selection "2. Brand Normalization Approach"
    Write-Normal $selection "Should we implement automatic fuzzy matching (e.g., 'Pepsy' auto-corrects to 'Pepsi') or provide a manual merge UI where the user decides? Automatic matching risks false merges."
    Write-Spacer $selection

    Write-Bold $selection "3. Data Format Support"
    Write-Normal $selection "Should we enforce the 'Wide Text' CSV format exclusively, or invest in supporting SPSS, Long-Format CSV, and other survey platform exports?"
    Write-Spacer $selection

    Write-Bold $selection "4. Deployment Target"
    Write-Normal $selection "Is this a client-side-only tool (no backend) or should we plan for a backend to enable features like shareable links, saved projects, and user accounts?"
    Write-Spacer $selection

    # --- Footer ---
    Write-Heading $selection "Document History" 2
    Write-Normal $selection "v1.0 - March 29, 2026 - Initial product review and roadmap"
    Write-Normal $selection "Prepared by: Product Management via Muhimma App Review"

    # Save
    $outputPath = "c:\Users\Hager Magdy\Downloads\muhimma-app\docs\Muhimma_App_Roadmap.docx"
    $doc.SaveAs([ref]$outputPath)
    $doc.Close()
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    Write-Output "SUCCESS: Word document saved to $outputPath"
} catch {
    Write-Error "FAILED: $($_.Exception.Message)"
    if ($doc) { try { $doc.Close([ref]$false) } catch {} }
    if ($word) { try { $word.Quit() } catch {} }
}
