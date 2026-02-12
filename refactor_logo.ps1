$files = @(
    "src/features/provider/components/ui/check-email.tsx",
    "src/features/provider/components/ui/new-password.tsx",
    "src/features/provider/components/ui/verify-password-reset.tsx",
    "src/features/provider/components/ui/sign-up.tsx",
    "src/features/provider/components/ui/signin.tsx",
    "src/components/modals/pending-verification.tsx",
    "src/components/modals/lineup.tsx",
    "src/app/provider/verify-password-reset/page.tsx",
    "src/app/provider/signup/[email]/password/page.tsx",
    "src/app/provider/signup/[email]/page.tsx",
    "src/app/provider/signin/page.tsx",
    "src/app/not-found.tsx",
    "src/app/curator/provider/[email]/page.tsx",
    "src/app/patient/lock-in/page.tsx",
    "src/app/patient/verify-password-reset/page.tsx",
    "src/app/patient/lock-in/[schoolId]/page.tsx",
    "src/app/patient/waiting-room/page.tsx",
    "src/app/patient/signup/page.tsx",
    "src/app/patient/signup/[email]/page.tsx",
    "src/app/patient/new-password/page.tsx",
    "src/app/patient/signin/page.tsx",
    "src/app/patient/check-email/page.tsx",
    "src/app/curator/(account)/schools/[schoolId]/page.tsx",
    "src/app/curator/(account)/pages/page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $newContent = $content -replace 'import JustGoHealth from "@/components/logo-purple";', 'import { Logo } from "@/components/shared/Logo";'
        $newContent = $newContent -replace 'import JustGoHealth from "../logo-purple";', 'import { Logo } from "@/components/shared/Logo";'
        $newContent = $newContent -replace '<JustGoHealth', '<Logo'
        Set-Content $file $newContent
        Write-Host "Updated $file"
    } else {
        Write-Host "File not found: $file"
    }
}
