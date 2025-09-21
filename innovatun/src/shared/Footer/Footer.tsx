import { ChevronDown, Linkedin, Facebook, Instagram } from "lucide-react";
import { Button } from "../../components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Company info - Left side */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-full"></div>
              </div>
              <span className="text-lg font-medium">The Blue Office</span>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p>RDC IMMEUBLE LLOYD, </p>
              <p>Centre Urbain Nord,</p>
              <p>Tunis 1082</p>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p>contact@innovatun.com</p>
              <p>+216 28 10 10 32</p>
            </div>

            {/* <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>10:00 - 14:00</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday - Sunday</span>
                <span>Closed</span>
              </div>
            </div> */}
          </div>

          {/* Navigation columns - Center */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="font-medium text-white">Solutions</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Virtual Office
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Flex Office
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fixed Office
                  </a>
                </li>
              </ul>
            </div>

            {/* Locations */}
            <div className="space-y-4">
              <h3 className="font-medium text-white">Locations</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Aarhus
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Copenhagen
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Odense
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    All Locations
                  </a>
                </li>
              </ul>
            </div>

            {/* Partnerships */}
            <div className="space-y-4">
              <h3 className="font-medium text-white">Partnerships</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Franchise
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Investor
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Affiliate
                  </a>
                </li>
              </ul>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="font-medium text-white">About</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our People
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - Tagline and Language */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end space-y-6">
            <p className="text-sm text-gray-300 text-left lg:text-right">
              Built for innovation and success
            </p>

            <Button
              variant="outline"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:text-white"
            >
              English
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              © {currentYear} - The Innovatun
            </p>

            {/* Social icons */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.linkedin.com/company/innovatun/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/people/Innovatun/61575297971299/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/innova.tun/#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              {/* <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a> */}
            </div>
          </div>

          {/* Legal links */}
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
