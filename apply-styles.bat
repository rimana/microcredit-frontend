@echo off
echo ========================================
echo   HARMONISATION DES STYLES - MICROCREDIT
echo ========================================
echo.

echo Etape 1: Renommage des anciens fichiers...
echo.

cd src\pages\Auth
if exist Auth.css (
    rename Auth.css Auth_old.css
    echo ✓ Auth.css renomme en Auth_old.css
)
if exist Auth_new.css (
    rename Auth_new.css Auth.css
    echo ✓ Auth_new.css renomme en Auth.css
)

cd ..\..\..\
if exist src\App.css (
    rename src\App.css App_old.css
    echo ✓ App.css renomme en App_old.css
)
if exist src\App_new.css (
    rename src\App_new.css App.css
    echo ✓ App_new.css renomme en App.css
)

cd src\pages\Credits
if exist CreditForm.css (
    rename CreditForm.css CreditForm_old.css
    echo ✓ CreditForm.css renomme en CreditForm_old.css
)
if exist CreditForm_new.css (
    rename CreditForm_new.css CreditForm.css
    echo ✓ CreditForm_new.css renomme en CreditForm.css
)

cd ..\..\..\

echo.
echo ========================================
echo   Migration terminee avec succes ! ✓
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Ouvrez src\index.css
echo 2. Remplacez tout par: @import './styles/global.css';
echo 3. Rafraichissez votre navigateur (Ctrl + Shift + R)
echo 4. Consultez RESUME_FINAL.md pour plus d'infos
echo.
pause

