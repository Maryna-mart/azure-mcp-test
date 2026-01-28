import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './App.css';
function App() {
    const [count, setCount] = useState(0);
    const [apiResponse, setApiResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const callAPI = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7071';
            const response = await fetch(`${apiUrl}/api/hello`);
            const data = await response.json();
            setApiResponse(JSON.stringify(data, null, 2));
        }
        catch (error) {
            setApiResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h1", { children: "\uD83D\uDE80 Azure MCP Test - Full Stack Demo" }), _jsxs("div", { className: "card", children: [_jsx("h2", { children: "Frontend Test" }), _jsx("p", { children: "This is your React frontend running on Azure Static Web App" }), _jsxs("button", { onClick: () => setCount(count + 1), children: ["Count: ", count] })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { children: "Backend API Test" }), _jsx("p", { children: "Call your Azure Function backend" }), _jsx("button", { onClick: callAPI, disabled: loading, children: loading ? 'Calling API...' : 'Call API' }), apiResponse && (_jsx("pre", { className: "response", children: apiResponse }))] }), _jsxs("div", { className: "card info", children: [_jsx("h3", { children: "\uD83D\uDCCB Project Status" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Frontend deployed" }), _jsx("li", { children: "\u23F3 Backend API (Phase 2)" }), _jsx("li", { children: "\u23F3 Storage (Phase 3)" })] })] })] }));
}
export default App;
