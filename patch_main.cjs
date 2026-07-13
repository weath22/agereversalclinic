const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

const errBoundary = `
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{padding: 20, color: 'red', zIndex: 9999, position: 'relative', background: 'white'}}><h1>Something went wrong.</h1><pre>{this.state.error.toString()}\n{this.state.error.stack}</pre></div>;
    }
    return this.props.children;
  }
}
`;

if(!content.includes('ErrorBoundary')) {
    content = content.replace("import App from './App.tsx';", "import App from './App.tsx';\nimport React from 'react';\n" + errBoundary);
    content = content.replace("<App />", "<ErrorBoundary><App /></ErrorBoundary>");
    fs.writeFileSync('src/main.tsx', content);
}
