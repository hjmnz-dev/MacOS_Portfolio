import { Component } from "react";

// Sin esto, un error al renderizar una parte desmonta toda la aplicación
class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default ErrorBoundary;
