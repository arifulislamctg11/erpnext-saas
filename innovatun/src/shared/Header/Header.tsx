import { Button } from "../../components/ui/button";
import Logo from "../../assets/images/innovatun_logo_bg_less.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/use-auth";
export default function Header() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signout();
      navigate("/home");
    } catch (error) {
      // optionally handle error
      console.error(error);
    }
  };
  return (
    <div className="container">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-16 h-12  rounded-lg flex items-center justify-center">
              {/* <span className="text-white font-bold text-sm"></span> */}
              <img src={Logo} alt="Innovatun" className=""></img>
            </div>
            {/* <span className="text-xl font-bold">Innovatun</span> */}
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to={"/home"}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to={"/about"}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Recent Work
            </Link>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Benefits
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              FAQs
            </a>
            {user && (
             <Link to={"/dashboard"}>
               <Button className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-white">
                 Dashboard
               </Button>
             </Link>
           )} 
          </nav>

         <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="inline-flex items-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || user.email || "User"}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold">
                    {(user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </div>
                )}
              </Link>
              <Button onClick={handleLogout} className="cursor-pointer bg-gray-300 hover:bg-red-700 text-black ">
                Logout
              </Button>
            </>
          ) : (
            <Link to="/register">
              <Button className="bg-black hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          )}
         </div>
          
        </div>
      </header>
    </div>
  );
}
