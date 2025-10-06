import { useEffect, useState } from "react";
import { plans } from "../../../components/Home/PicingSection";
import { api } from "../../../api";
import { CurrentPlanUrl, GetHomePlansURL } from "../../../api/Urls";
import { useAuth } from "../../../contexts/use-auth";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Check } from "lucide-react";
import { Button } from "../../../components/ui/button";


export default function CurrentPlan() {
  const plansData = plans;
  const [currentPlanData, setCurrentPlanData] : any= useState(null);
  const [nextPlanData, setNexPlanData] : any= useState(null);
  const [loading, setLoading] = useState(false)
  const { user} = useAuth();

  const getNextPlan = (planData: any, findPlan: any) => {
    const priceNumber = Number(findPlan?.price?.unit_amount);

        // Sort the array based on numeric price
      const sortedArray = planData.slice().sort((a: any, b: any) => Number(a.price?.unit_amount) - Number(b.price?.unit_amount));

      console.log('sorted data', sortedArray)
      // Find the next higher price object
      for (let obj of sortedArray) {
        if (Number(obj.price?.unit_amount) > priceNumber) {
          console.log('entering ===>', obj)
          return obj;
        }
      }
  }

  const getCurrentPlan = async () => {
    setLoading(true)
    const response = await fetch(`${api.baseUrl}${CurrentPlanUrl}?email=${user?.email}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
    const formatedRes = await response.json();

     const plan_response = await fetch(`${api.baseUrl}${GetHomePlansURL}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                },
              });
    const formatedPlanRes = await plan_response.json();
    
    if(formatedRes?.data){
      const findPlan = formatedPlanRes?.products?.find((item : any) => item?.name == formatedRes?.data?.planName)
      setCurrentPlanData(findPlan);
      const nextPlan = getNextPlan(formatedPlanRes?.products, findPlan);
      setNexPlanData(nextPlan)
      setLoading(false)
    }else{
      setLoading(false)
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
        {
          loading ? <h1>Loading...</h1> : <div className="w-full lg:max-w-7xl">
          <div className="flex flex-cols lg:flex-row justify-between">
              {
                currentPlanData && <div>
                  <Card
                  
                  className={`p-8 bg-white border-1 border-black shadow-sm hover:bg-gray-900 group hover:text-white hover:shadow-lg h-[680px]`}
                >
                <h4 className="text-xl lg:text-2xl text-green-700 font-bold">Current Plan</h4>
                

                  <div className="text-center mb-2">
                    <h3 className="text-xl font-semibold mb-2">{currentPlanData?.name}</h3>
       
                    <div className="text-4xl font-bold mb-1">
                    {currentPlanData.price?.unit_amount}
                    <span className="text-lg font-normal text-gray-500">
                      /month
                    </span>
                  </div>
                  </div>
                                 
                  <div className="mb-2">
                    <h4 className="font-semibold mb-4">What's included:</h4>
                    <ul className="space-y-3 text-left">
                      {currentPlanData?.features.map((feature : any, idx: any) => (
                        feature && <li
                          key={idx}
                          className={`flex items-center text-sm "text-gray-600 group-hover:text-white"`}
                        >
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
              }
              {
                nextPlanData ? 
                <div>
                  <Card
                  
                  className={`p-8  bg-gray-900  text-white shadow-lg relative h-[680px]`}
                >
                <h4 className="text-xl lg:text-2xl  text-yellow-400 font-bold">Upgrade Plan</h4>
    
                 <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">{nextPlanData?.name}</h3>
                  <div className="text-4xl font-bold mb-1">
                    {nextPlanData.price?.unit_amount}
                    <span className="text-lg font-normal text-gray-500">
                      /month
                    </span>
                  </div>
                </div>

                  <div className="mb-2">
                    <h4 className="font-semibold mb-4">What's included:</h4>
                    <ul className="space-y-3 text-left">
                      {nextPlanData?.features.map((feature : any, idx: any) => (
                        feature && <li
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
              </div> :  <div>
                  <Card
                  
                  className={`w-full lg:w-[500px] p-8  bg-gray-900  text-white shadow-lg relative h-[680px]`}
                >
                <h4 className="text-xl lg:text-2xl  text-yellow-400 font-bold">You are already on the highest plan, so an upgrade is not necessary.</h4>
                </Card>
              </div> 
              }
              
          </div>
          {
            !currentPlanData && <Card className="p-8 text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">No Plan Subscribe Yet</h3>
              <p className="text-sm">You haven't subscribed to any plans yet.</p>
            </div>
          </Card>
          }
        </div>
        }
    </div>
  );
}
