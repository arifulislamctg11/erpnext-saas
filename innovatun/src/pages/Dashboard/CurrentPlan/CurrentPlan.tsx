import { useEffect, useState } from "react";
import { plans } from "../../../components/Home/PicingSection";
import { api } from "../../../api";
import { CurrentPlanUrl } from "../../../api/Urls";
import { useAuth } from "../../../contexts/use-auth";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Check } from "lucide-react";
import { Button } from "../../../components/ui/button";


export default function CurrentPlan() {
  const plansData = plans;
  const [currentPlanData, setCurrentPlanData] : any= useState(null);
  const [nextPlanData, setNexPlanData] : any= useState(null);

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
      setCurrentPlanData(findPlan);

      if(findPlan?.title == "Enterprise ERP"){
        setNexPlanData(plansData[1])
      }
      else if(findPlan?.title == "Starter ERP"){
        setNexPlanData(plansData[2])
      }
       else if(findPlan?.title == "Pro ERP (Most Popular)"){
        setNexPlanData(plansData[3])
      }
       else if(findPlan?.title == "Pro ERP (Most Popular)"){
        setNexPlanData(null)
      }
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
    <div className="min-h-screen bg-white p-6">
        <div className="w-full lg:max-w-7xl">
          <div className="flex flex-cols lg:flex-row justify-between">
              {
                currentPlanData && <div>
                  <Card
                  
                  className={`p-8 bg-white border-1 border-black shadow-sm hover:bg-gray-900 group hover:text-white hover:shadow-lg h-[680px]`}
                >
                <h4 className="text-xl lg:text-2xl text-green-700 font-bold">Current Plan</h4>
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
                          className={`flex items-center text-sm "text-gray-600 group-hover:text-white"`}
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
              }
              {
                nextPlanData && <div>
                  <Card
                  
                  className={`p-8  bg-gray-900  text-white shadow-lg relative h-[680px]`}
                >
                <h4 className="text-xl lg:text-2xl  text-yellow-400 font-bold">Upgrade Plan</h4>
                  {nextPlanData?.badge && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                      {nextPlanData?.badge}
                    </Badge>
                  )}

                 <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">{nextPlanData.title}</h3>
                  <div className="text-4xl font-bold mb-1">
                    {nextPlanData.price}
                    <span className="text-lg font-normal text-gray-500">
                      /mo
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{nextPlanData.description}</p>
                </div>

                  <div className="mb-2">
                    <h4 className="font-semibold mb-4">What's included:</h4>
                    <ul className="space-y-3 text-left">
                      {nextPlanData?.features.map((feature : any, idx: any) => (
                        <li
                          key={idx}
                          className={`flex items-center text-sm "text-gray-300"`}
                        >
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                <Button
                  className='bg-white text-gray-900 hover:bg-gray-100'
                
                >
                 Upgrade Plan
                </Button>

                  <p className="text-sm mt-4 text-gray-500">{nextPlanData?.note}</p>
                </Card>
              </div>
              }
          </div>
        </div>
    </div>
  );
}
