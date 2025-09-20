import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, Users } from "lucide-react";
import { Card } from "../ui/card";

export default function HeroSection() {
  return (
    <div>
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge
            variant="secondary"
            className="mb-6 bg-slate-800 text-slate-300 border-slate-700"
          >
            ADVANCE ERP SOLUTIONS
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Innovating Digital Excellence
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto text-balance">
            Your Partner in Digital Transformation
          </p>

          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white mb-12"
          >
            Get Plans Available
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Client Logos */}
          <div className="flex items-center justify-center space-x-8 opacity-60 mb-16">
            <div className="text-sm font-medium">acurato</div>
            <div className="text-sm font-medium">centerpiece</div>
            <div className="text-sm font-medium">cedar</div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur border-white/20 p-6 rounded-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Panel - Team Projects */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-left">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Team Projects
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-white/20 rounded-lg p-3">
                      <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        AS
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">
                          Anna Smith
                        </div>
                        <div className="text-white/70 text-xs">Designer</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/20 rounded-lg p-3">
                      <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        AR
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">
                          Ahmad Ryan
                        </div>
                        <div className="text-white/70 text-xs">Developer</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/20 rounded-lg p-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        CD
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">
                          Cameron Diaz
                        </div>
                        <div className="text-white/70 text-xs">Manager</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Tasks */}
                <div className="bg-white rounded-xl p-6 text-slate-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Doing</h3>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <Card className="p-4 border-l-4 border-l-purple-500">
                      <h4 className="font-medium text-sm mb-2">
                        Call Lead 
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-full"></div>
                        <div className="w-6 h-6 bg-slate-600 rounded-full"></div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-gradient-to-r from-purple-100 to-blue-100">
                      <h4 className="font-medium text-sm mb-2">
                        Meeting with Sales  Team
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-full"></div>
                        <div className="w-6 h-6 bg-slate-600 rounded-full"></div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
