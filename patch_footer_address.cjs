const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace(/LONDON COSMETIC CLINIC KNIGHTSBRIDGE,<br \/>\s*2ND FLOOR, 4 HARLEY STREET, LONDON, W1G 9PB/g, "{config.address}");

fs.writeFileSync('src/components/Footer.tsx', content);
