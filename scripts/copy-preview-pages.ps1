$dir = Join-Path $PSScriptRoot "..\public\images\pdf-preview"
$assets = "C:\Users\37062\.cursor\projects\e-pdf-ai\assets"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

Copy-Item (Join-Path $assets "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_92839be257fefca7b34f814be38adfe0_images_image-716b1cb3-5cac-43a5-b82e-34d285b04eef.png") (Join-Path $dir "page-intro.png") -Force
Copy-Item (Join-Path $assets "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_92839be257fefca7b34f814be38adfe0_images_image-d760ecd7-c004-4dec-a4b7-06f4e2cd0816.png") (Join-Path $dir "page-result.png") -Force
Copy-Item (Join-Path $assets "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_92839be257fefca7b34f814be38adfe0_images_image-51b0aec9-334c-4177-9998-7a4b3481b7d7.png") (Join-Path $dir "page-security.png") -Force

Get-ChildItem $dir | Format-Table Name, Length
