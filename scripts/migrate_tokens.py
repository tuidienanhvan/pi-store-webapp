import os
import re

TARGET_DIR = r"c:\Users\Administrator\Local Sites\saigonhouse\app\public\wp-content\pi-store-webapp\src"

MAPPINGS = {
    # Text
    r'\btext-text-1\b': 'text-base-content',
    r'\btext-text-2\b': 'text-base-content/80',
    r'\btext-text-3\b': 'text-base-content/60',
    
    # Backgrounds
    r'\bbg-surface\b': 'bg-base-200',
    r'\bbg-surface-sunken\b': 'bg-base-300',
    r'\bbg-surface-raised\b': 'bg-base-400',
    r'\bbg-surface-overlay\b': 'bg-base-400',
    
    # Brand
    r'\bbg-brand\b': 'bg-primary',
    r'\bbg-brand-hover\b': 'bg-primary-hover',
    r'\btext-brand\b': 'text-primary',
    r'\bborder-brand\b': 'border-primary',
    
    # Borders
    r'\bborder-border\b': 'border-base-border',
    r'\bborder-border-subtle\b': 'border-base-border-subtle',
    r'\bborder-border-strong\b': 'border-base-border-strong',
}

files_changed = 0

for root, _, files in os.walk(TARGET_DIR):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.css'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            for old, new in MAPPINGS.items():
                content = re.sub(old, new, content)
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_changed += 1
                print(f"Updated: {os.path.relpath(path, TARGET_DIR)}")

print(f"\nMigration complete. Total files updated: {files_changed}")
