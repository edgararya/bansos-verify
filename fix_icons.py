import os
import re

directory = r"d:\download\Matkul-Kuliah\Pemrograman-Web-Berbasis-Framework\tugas-02\bansos-verify\resources\js"

icon_mappings = {
    'imgLogo': 'shield-check',
    'imgTable': 'table',
    'imgCal': 'calendar',
    'imgUser': 'user',
    'imgLogout': 'log-out',
    'imgDash': 'layout-dashboard',
    'imgUpdate': 'refresh-cw',
    'imgReport': 'file-text',
    'imgSettings': 'settings',
    'imgCheck': 'check-circle',
    'imgReject': 'x-circle',
    'imgSearch': 'search',
    'imgView': 'eye',
    'imgDone': 'check-circle-2',
    'imgBroadcast': 'radio',
    'imgMsg': 'message-square',
    'imgFile': 'file',
    'imgClock': 'clock',
    'imgEmpty': 'inbox',
    'imgCamera': 'camera',
    'imgUpload': 'upload',
    'imgAlert': 'alert-triangle',
    'imgChart': 'bar-chart-2',
    'imgDownload': 'download',
    'imgApprove': 'check',
    'imgSuspend': 'slash',
    'imgShield': 'shield'
}

# Regex to find: const imgName = "https://www.figma.com/api/mcp/asset/..."
# We will match the variable name and replace the URL part.
pattern = re.compile(r'(const\s+(img[A-Za-z]+)\s*=\s*)"https://www\.figma\.com/api/mcp/asset/[A-Za-z0-9-]+"')

count = 0

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            def replace_match(match):
                global count
                var_name = match.group(2)
                icon_name = icon_mappings.get(var_name, 'info') # fallback to info
                count += 1
                return f'{match.group(1)}"https://api.iconify.design/lucide/{icon_name}.svg"'

            new_content = pattern.sub(replace_match, content)

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file}")

print(f"Total icons replaced: {count}")
