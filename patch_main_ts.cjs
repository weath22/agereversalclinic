const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

const errBoundary = `
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError && this.state.error) {
      return <div style={{padding: 20, color: 'red', zIndex: 9999, position: 'relative', background: 'white'}}><h1>Something went wrong.</h1><pre>{this.state.error.toString()}\n{this.state.error.stack}</pre></div>;
    }
    return this.props.children;
  }
}
`;

content = content.replace(/class ErrorBoundary extends React\.Component \{[\s\S]*?\}\n/, errBoundary);
fs.writeFileSync('src/main.tsx', content);
