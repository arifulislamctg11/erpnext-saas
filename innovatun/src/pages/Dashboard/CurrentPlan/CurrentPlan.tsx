import { useEffect, useState } from "react";
import { plans } from "../../../components/Home/PicingSection";
import { api } from "../../../api";
import { CurrentPlanUrl } from "../../../api/Urls";
import { useAuth } from "../../../contexts/use-auth";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Check } from "lucide-react";


export default function CurrentPlan() {
  const plansData = plans;
  const [currentPlanData, setCurrentPlanData] : any= useState(null);
  const { user} = useAuth();

  const getCurrentPlan = async () => {
    const response = await fetch(`${api.baseUrl}${CurrentPlanUrl}?email=${user?.email}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
    const formatedRes = await response.json();
    if(formatedRes?.data){
      const findPlan = plansData.find((item) => item?.title == formatedRes?.data?.planName)
      setCurrentPlanData(findPlan)
    }else{
      setCurrentPlanData(null)
    }
  }
  
  useEffect(() => {
    if(user?.email){
      getCurrentPlan()
    }
  },[user?.email])

  return(
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="w-full lg:max-w-7xl">
          <div className="grid md:grid-cols-2 gap-4">
              <div>
                  <Card
                  
                  className={`p-8 ${
                    currentPlanData?.badge
                      ? "bg-gray-900  text-white shadow-lg relative"
                      : "bg-white border-0 shadow-sm hover:bg-gray-900 group hover:text-white hover:shadow-lg relative"
                  }`}
                >
                <h4 className="text-xl lg:text-2xl my-4 text-green-700 font-medium">Current Plan</h4>
                  {currentPlanData?.badge && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                      {currentPlanData?.badge}
                    </Badge>
                  )}

                  <div className="text-center mb-2">
                    <h3 className="text-xl font-semibold mb-2">{currentPlanData?.title}</h3>
       
                    <p className="text-sm text-gray-300">{currentPlanData?.description}</p>
                  </div>

                  <div className="mb-2">
                    <h4 className="font-semibold mb-4">What's included:</h4>
                    <ul className="space-y-3 text-left">
                      {currentPlanData?.features.map((feature : any, idx: any) => (
                        <li
                          key={idx}
                          className={`flex items-center text-sm ${
                            currentPlanData?.badge
                              ? "text-gray-300"
                              : "text-gray-600 group-hover:text-white"
                          }`}
                        >
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm mt-4 text-gray-500">{currentPlanData?.note}</p>
                </Card>
              </div>
          </div>
        </div>
    </div>
  );
}
