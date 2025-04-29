import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Phone, CreditCard, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMpesaDialog, setShowMpesaDialog] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "mpesa") {
      if (!phoneNumber || phoneNumber.trim() === "") {
        toast({
          title: "Phone number required",
          description: "Please enter your phone number for M-Pesa payment.",
          variant: "destructive",
        });
        return;
      }
      
      // Show processing toast
      toast({
        title: "Processing payment",
        description: `Initiating M-Pesa payment request to ${phoneNumber}`,
      });
      
      setIsProcessing(true);
      
      // Simulate M-Pesa request being sent
      console.log("Processing payment with method:", paymentMethod, `Phone: ${phoneNumber}`);
      
      // Show M-Pesa dialog after a short delay to simulate network request
      setTimeout(() => {
        setIsProcessing(false);
        setShowMpesaDialog(true);
      }, 2000);
      
      return;
    }

    // Handle other payment methods
    toast({
      title: "Processing payment",
      description: `Processing ${paymentMethod.toUpperCase()} payment of KSh ${(total).toLocaleString()}`,
    });
    
    // In a real implementation, this would integrate with payment processors
    console.log("Processing payment with method:", paymentMethod);
  };

  const handleCompleteMpesaPayment = () => {
    // This simulates a successful payment
    setShowMpesaDialog(false);
    toast({
      title: "Payment successful",
      description: "Your order has been placed successfully!",
    });
    clearCart();
    // Navigate to orders page after successful payment
    setTimeout(() => {
      navigate('/orders');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {items.map((item) => (
                <Card key={item.id} className="mb-4">
                  <CardContent className="flex items-center gap-4 p-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600">KSh {(item.price).toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          className="border rounded px-2 py-1"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>KSh {(total).toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-6 mb-4">
                    <h4 className="text-sm font-medium mb-3">Payment Method</h4>
                    <RadioGroup 
                      defaultValue="mpesa" 
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="flex items-center cursor-pointer">
                          <Phone className="mr-2 h-4 w-4" />
                          <span className="font-medium">M-Pesa</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex items-center cursor-pointer">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span className="font-medium">Credit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                          <Wallet className="mr-2 h-4 w-4" />
                          <span className="font-medium">PayPal</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentMethod === "mpesa" && (
                    <div className="mb-4">
                      <Label htmlFor="phone-number" className="block text-sm font-medium mb-2">
                        Phone Number (for M-Pesa)
                      </Label>
                      <div className="flex gap-2 items-center">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <Input 
                          id="phone-number"
                          type="tel"
                          placeholder="+254 7XX XXX XXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* M-Pesa PIN Dialog */}
      <Dialog open={showMpesaDialog} onOpenChange={setShowMpesaDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>M-Pesa Payment</DialogTitle>
            <DialogDescription>
              A request has been sent to your phone number {phoneNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-green-50 rounded-md mb-4">
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <p className="font-medium text-green-800">
                Please check your phone
              </p>
              <p className="text-sm text-green-700 mt-1">
                Enter your M-Pesa PIN to complete the transaction of KSh {total.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">
              Once you enter your PIN on your phone, your payment will be processed automatically.
            </p>
            <Button onClick={handleCompleteMpesaPayment}>
              I've entered the PIN
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CartPage;
