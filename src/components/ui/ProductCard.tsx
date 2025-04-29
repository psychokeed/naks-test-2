
import React from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string | number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  image,
  category,
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      price,
      image,
      quantity: 1,
    });
    
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart.`,
    });
  };

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">{category}</span>
          <CardTitle className="text-base">
            <Link to={`/shop/product/${id}`} className="hover:underline">
              {title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-0">
        <CardDescription className="text-xs line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        <div className="font-semibold">KSh {(price).toLocaleString()}</div>
        <Button size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
