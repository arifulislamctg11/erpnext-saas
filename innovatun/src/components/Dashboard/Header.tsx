import { FileText, Github } from "lucide-react";
import { Button } from "../../components/ui/button";
export default function Header() {
  return (
    <div>
      <header className="h-16 border-b  header-shadow border-border flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <FileText className="h-5 w-5" />
          <span className="font-medium">Documents</span>
        </div>
        <Button variant="ghost" size="sm">
          <Github className="h-4 w-4 mr-2" />
          Github
        </Button>
      </header>
    </div>
  );
}
