import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Plus, Edit, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { plans } from "../../components/Home/PicingSection";
import { useNavigate } from "react-router-dom";
import { GetPlansURL } from "../../api/Urls";
import { api } from "../../api";

export default function AdminSettings() {
  const [showSecrets, setShowSecrets] = useState(false);
  const navigate = useNavigate();
  // Mock data - replace with actual API calls
  const [plansData, setPlansData] = useState([]);
  const [loading, setLoading] = useState(false)

  const [billingSettings, setBillingSettings] = useState({
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    webhookSecret: "whsec_...",
    paymentProvider: "stripe"
  });

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: "Welcome Email",
      subject: "Welcome to Innovatun!",
      isActive: true
    },
    {
      id: 2,
      name: "Payment Confirmation",
      subject: "Payment Received - Thank You!",
      isActive: true
    },
    {
      id: 3,
      name: "Subscription Cancelled",
      subject: "Your subscription has been cancelled",
      isActive: false
    }
  ]);

  const [systemLogs, setSystemLogs] = useState([
    {
      id: 1,
      timestamp: "2024-01-20 10:30:00",
      level: "INFO",
      message: "User john.doe@example.com logged in",
      source: "Authentication"
    },
    {
      id: 2,
      timestamp: "2024-01-20 10:25:00",
      level: "SUCCESS",
      message: "Payment processed successfully for jane.smith@example.com",
      source: "Payment"
    },
    {
      id: 3,
      timestamp: "2024-01-20 10:20:00",
      level: "ERROR",
      message: "Webhook validation failed for transaction txn_123456",
      source: "Webhook"
    }
  ]);

  const handleAddPlan = () => {

    navigate('/admin/createplan');
  };

  const handleDeletePlan = (id: number) => {
    
  };

  const handleTogglePlan = (id: number) => {
    
  };

  const handleSaveBillingSettings = () => {
    // Implement save functionality
    console.log("Saving billing settings:", billingSettings);
  };

  const handleToggleEmailTemplate = (id: number) => {
    setEmailTemplates(emailTemplates.map(template => 
      template.id === id ? { ...template, isActive: !template.isActive } : template
    ));
  };

  const featchPlans = async () => {
    try {
      setLoading(true)
        const response = await fetch(`${api.baseUrl}${GetPlansURL}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });
        const formatedRes = await response.json();
        if(formatedRes.data){
          setPlansData(formatedRes?.data)
          setLoading(false)
        }else{
          setLoading(false)
        }
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    featchPlans()
  },[]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-2">Manage system configuration and settings</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Plans Management</TabsTrigger>
          <TabsTrigger value="billing">Billing Settings</TabsTrigger>
          {/* <TabsTrigger value="email">Email Templates</TabsTrigger> */}
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        {/* Plans Management */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-start font-bold text-lg md:text-3xl">Subscription Plans</CardTitle>
                  <CardDescription className="text-start font-medium text-base text-gray-400">
                    Manage subscription plans, pricing, and features
                  </CardDescription>
                </div>
                <Button onClick={handleAddPlan} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Plan</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
               {
                loading ?<p className="text-center font-bold text-xl md:text-3xl">Loading....</p>  : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plansData?.map((plan: any) => (
                <Card
                  className={`p-8 bg-white border-1 border-black shadow-sm hover:bg-gray-900 group hover:text-white hover:shadow-lg `}
                >
                  <div className="text-center mb-2">
                    <h3 className="text-xl lg:text-2xl font-bold">{plan?.planName}</h3>
                    <div className="text-4xl font-bold mb-1">
                    {plan.planPrice} TND
                    <span className="text-lg font-normal text-gray-500">
                      /{plan?.trialDays} Days
                    </span>
                  </div>
                    {/* <p className="text-sm text-gray-300">{plan?.description}</p> */}
                  </div>
                                 
                  <div className="mb-2 h-[380px]">
                    <h4 className="font-semibold mb-4">What's included:</h4>
                    <ul className="space-y-3 text-left">
                      {plan?.features.map((feature : any, idx: any) => (
                        
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

                  <div className="flex flex-row justify-between items-center">
                     {/* <Switch
                          checked={plan.isActive}
                          onCheckedChange={() => handleTogglePlan(plan.id)}
                        /> */}
                    {/* <Button 
                      variant="outline" 
                      size="sm"
                      
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                     <Button onClick={() => {
                        navigate('/admin/createplan', {
                          state: {
                            id: plan?._id,
                          },
                        });
                     }} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
                ))}
              </div>
               }
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Provider Configuration</CardTitle>
              <CardDescription>
                Configure payment provider credentials and webhook settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                  <Input
                    id="stripePublicKey"
                    value={billingSettings.stripePublicKey}
                    onChange={(e) => setBillingSettings({
                      ...billingSettings,
                      stripePublicKey: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                  <div className="relative">
                    <Input
                      id="stripeSecretKey"
                      type={showSecrets ? "text" : "password"}
                      value={billingSettings.stripeSecretKey}
                      onChange={(e) => setBillingSettings({
                        ...billingSettings,
                        stripeSecretKey: e.target.value
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="webhookSecret">Webhook Secret</Label>
                <div className="relative">
                  <Input
                    id="webhookSecret"
                    type={showSecrets ? "text" : "password"}
                    value={billingSettings.webhookSecret}
                    onChange={(e) => setBillingSettings({
                      ...billingSettings,
                      webhookSecret: e.target.value
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSecrets(!showSecrets)}
                  >
                    {showSecrets ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveBillingSettings} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Settings</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Manage email templates for customer communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold">{template.name}</h3>
                          <Badge variant={template.isActive ? "default" : "secondary"}>
                            {template.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Subject: {template.subject}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={template.isActive}
                          onCheckedChange={() => handleToggleEmailTemplate(template.id)}
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Logs */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Logs & Webhook Events</CardTitle>
              <CardDescription>
                View system logs and webhook event history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <Badge 
                      variant={log.level === "ERROR" ? "destructive" : 
                              log.level === "SUCCESS" ? "default" : "secondary"}
                    >
                      {log.level}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-gray-500">
                        {log.timestamp} • {log.source}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
