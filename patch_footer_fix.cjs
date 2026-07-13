const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace("export default function Footer() {\n  const currentYear = new Date().getFullYear();\n  const footerLinks = [", "export default function Footer() {\n  const [config, setConfig] = useState(getFooterConfig());\n\n  useEffect(() => {\n    setConfig(getFooterConfig());\n  }, []);\n\n  const currentYear = new Date().getFullYear();\n  const footerLinks = config?.links?.length > 0 ? config.links : [");

fs.writeFileSync('src/components/Footer.tsx', content);
