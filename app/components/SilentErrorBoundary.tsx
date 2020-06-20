import React from "react";

interface SilentErrorBoundaryProps {}

class SilentErrorBoundary extends React.Component<{}, SilentErrorBoundaryProps> {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {}

    render() {
        return this.props.children;
    }
}

export default SilentErrorBoundary;
