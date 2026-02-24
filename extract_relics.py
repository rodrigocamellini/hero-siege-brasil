import re

with open('src/RelicsView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for image alt text
alt_pattern = r'alt="Relics (.*?)"'
alts = re.findall(alt_pattern, content)

# Pattern for div content inside first column (assuming structure)
# Looking for <div>NAME</div>
div_pattern = r'<div>(.*?)</div>'
divs = re.findall(div_pattern, content)

# Filter divs that look like relic names (start with uppercase, no special chars except ' - &)
filtered_divs = [d for d in divs if d and d[0].isupper() and len(d) < 30 and '<' not in d]

print("ALTS FOUND:", len(alts))
for a in sorted(set(alts)):
    print(f"ALT: {a}")

print("\nDIVS FOUND:", len(filtered_divs))
for d in sorted(set(filtered_divs)):
    print(f"DIV: {d}")
