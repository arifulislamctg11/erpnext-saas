import "./App.css";
import { FrappeProvider } from "frappe-react-sdk";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
function App() {
  return (
    <div className="App">
      <FrappeProvider>
        <div>
          <Button>Hello</Button>
          <Input placeholder="Enter your name" />
        </div>
      </FrappeProvider>
    </div>
  );
}

export default App;
