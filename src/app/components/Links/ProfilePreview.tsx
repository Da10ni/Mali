import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelector } from 'react-redux';
import { RootState } from "@/src/store/store";
import BookingCard from "../Bookings/BookingPreview";
import { useRouter } from "next/navigation";
import { BsCalendarCheck } from "react-icons/bs"; // Import calendar icon
import { AuthContext } from "@/src/context/AuthContext";



interface ProfileCardProps {
  productData: any;
  productList: any;
  linkData: any;
  bgColor: string;
  textColor: string;
}

// Interface for display items with ordering
interface OrderedItem {
  id: string;
  type: 'product' | 'booking' | 'link';
  data: any;
  order: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  productData,
  productList,
  linkData,
  bgColor,
  textColor,
}) => {
  const [userDetails, setUserDetails] = useState<{
    username: string;
    email: string;
  }>({
    username: "Guest",
    email: "guest@example.com",
  });
  
  const [orderedItems, setOrderedItems] = useState<OrderedItem[]>([]);
  const { data: session } = useSession();
  const userData = useSelector((state: RootState) => state.user);
  const router = useRouter();

  // Setup user details from session or token
  useEffect(() => {
    if (session?.user?.email) {
      setUserDetails({
        email: session.user.email,
        username: session.user.name || "No username",
      });
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (!payload.exp || Date.now() < payload.exp * 1000) {
            setUserDetails({
              email: payload.email || "No email",
              username: payload.username || "No username",
            });
          }
        } catch (err) {
          console.error("Error decoding token", err);
        }
      }
    }
  }, [session]);

  const getUserIdentifier = () => {
    if (session?.user?.name) return session.user.name;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.username) return payload.username;
      } catch (err) {
        console.error("Error decoding token", err);
      }
    }

    return "guest";
  };

  // Load the ordering from localStorage whenever the component mounts or when productList/linkData changes
  useEffect(() => {
    // First, create a default ordering (products, then booking, then links)
    let items: OrderedItem[] = [];
    
    // Add products
    if (productList && productList.length > 0) {
      productList.forEach((product, index) => {
        items.push({
          id: `product-${index}`,
          type: 'product',
          data: product,
          order: items.length
        });
      });
    }
    
    // Try to find saved ordering
    try {
      const bookingItemOrder = localStorage.getItem('bookingItemOrder');
      const savedItems = localStorage.getItem('sortableItems');
      
      if (savedItems) {
        // If we have a complete saved order, use it
        const parsedItems = JSON.parse(savedItems);
        
        // Map the saved items to our current data
        // This ensures we're displaying current data even if the order was saved earlier
        const mappedItems: OrderedItem[] = [];
        
        parsedItems.forEach((savedItem: any) => {
          if (savedItem.type === 'product') {
            // Find matching product by title or URL (since IDs might not be stable)
            const productIndex = productList?.findIndex((p: any) => 
              p.title === savedItem.data.title || p.url === savedItem.data.url
            );
            
            if (productIndex !== -1 && productList) {
              mappedItems.push({
                id: `product-${productIndex}`,
                type: 'product',
                data: productList[productIndex],
                order: savedItem.order
              });
            }
          } else if (savedItem.type === 'booking') {
            // Add booking item
            mappedItems.push({
              id: 'booking-0',
              type: 'booking',
              data: { title: "Book a 1:1 Call with Me" },
              order: savedItem.order
            });
          } else if (savedItem.type === 'link' && linkData) {
            // Find matching link
            const linkIndex = linkData.findIndex((l: any) => 
              l.name === savedItem.data.name || l.url === savedItem.data.url
            );
            
            if (linkIndex !== -1) {
              mappedItems.push({
                id: `link-${linkIndex}`,
                type: 'link',
                data: linkData[linkIndex],
                order: savedItem.order
              });
            }
          }
        });
        
        if (mappedItems.length > 0) {
          // Sort by order
          mappedItems.sort((a, b) => a.order - b.order);
          items = mappedItems;
        }
      } else if (bookingItemOrder) {
        // If we just have the booking order, insert booking at that position
        const insertPosition = parseInt(bookingItemOrder);
        
        // Add booking item at the specified position
        if (insertPosition >= 0 && insertPosition <= items.length) {
          const bookingItem: OrderedItem = {
            id: 'booking-0',
            type: 'booking',
            data: { title: "Book a 1:1 Call with Me" },
            order: insertPosition
          };
          
          items.splice(insertPosition, 0, bookingItem);
          
          // Recalculate orders
          items = items.map((item, index) => ({
            ...item,
            order: index
          }));
        } else {
          // Add booking at the end if position is invalid
          items.push({
            id: 'booking-0',
            type: 'booking',
            data: { title: "Book a 1:1 Call with Me" },
            order: items.length
          });
        }
      } else {
        // No saved order for booking, add it at the end
        items.push({
          id: 'booking-0',
          type: 'booking',
          data: { title: "Book a 1:1 Call with Me" },
          order: items.length
        });
      }
      
      // Add links at the end if they weren't in the saved items
      if (linkData && linkData.length > 0) {
        const linkIds = items.filter(item => item.type === 'link').map(item => item.id);
        
        linkData.forEach((link: any, index: number) => {
          const linkId = `link-${index}`;
          if (!linkIds.includes(linkId)) {
            items.push({
              id: linkId,
              type: 'link',
              data: link,
              order: items.length
            });
          }
        });
      }
    } catch (error) {
      console.error("Error parsing saved order:", error);
      
      // Add booking if not already added
      if (!items.some(item => item.type === 'booking')) {
        items.push({
          id: 'booking-0',
          type: 'booking',
          data: { title: "Book a 1:1 Call with Me" },
          order: items.length
        });
      }
      
      // Add links if not already added
      if (linkData && linkData.length > 0 && !items.some(item => item.type === 'link')) {
        linkData.forEach((link: any, index: number) => {
          items.push({
            id: `link-${index}`,
            type: 'link',
            data: link,
            order: items.length
          });
        });
      }
    }
    
    // Sort by order
    items.sort((a, b) => a.order - b.order);
    setOrderedItems(items);
  }, [productList, linkData]);

  const [showBookingPage, setShowBookingPage] = useState<boolean>(false);

  const handleShowBookingPage = () => {
    setShowBookingPage(true);
    router.push("/mybookings");
  };

  const handleHideBookingPage = () => {
    setShowBookingPage(false);
  };

  // Render a product item
  const renderProductItem = (product: any, index: number) => (
    <div 
      key={`product-${index}`}
      className="flex border border-gray-300 p-3 rounded items-center space-x-4 overflow-hidden"
    >
      <img
        src={product.imageUrl || product.image || "/default.jpg"}
        alt={product.title}
        className="w-10 h-10 object-cover rounded-md bg-gray-200"
      />
      <div className="min-w-0 flex-grow">
        <h4
          className={`text-sm font-semibold ${textColor} truncate max-w-[480px]`}
          title={product.title}
        >
          {product.title}
        </h4>
        <div className="flex justify-between items-center mt-1">
          <Link
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View Product
          </Link>
         
        </div>
      </div>
    </div>
  );

const renderBookingItem = (data: any, index: number) => {
  const username = userData?.user?.username || getUserIdentifier();
  
  return (
    <div className="flex items-center space-x-4 p-3 max-w-full overflow-hidden">
      <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-md">
        <BsCalendarCheck size={24} className="text-purple-600" />
      </div>
      <div className="flex flex-col min-w-80">
        <h4 className="text-lg font-semibold text-gray-800">
          {data.title || "Book a 1:1 Call with Me"}
        </h4>
        <Link
          href={`/mybookings/${username}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          View Booking Calendar
        </Link>
      </div>
    </div>
  );
};

  const renderLinkItem = (link: any, index: number) => (
    <Link 
      key={`link-${index}`}
      href={"https://" + link.url} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <div className="flex border border-gray-300 p-3 rounded items-center space-x-4 overflow-hidden">
        <img
          src={link.image}
          alt={link.name}
          className="w-8 h-8 object-cover rounded-md"
        />
        <div className="flex flex-col">
          <h4 className={`text-lg font-semibold ${textColor} truncate`}>
            {link.name}
          </h4>
          <p className={`${textColor} text-sm truncate`}>{link.url}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div
      className={`w-[92%] min-h-[650px] hide-scrollbar max-w-[92%] mx-auto ${
        bgColor || "bg-gray-200"
      } border border-gray-500 p-6 rounded-4xl shadow-2xl flex flex-col pt-2 absolute top-1/2 right-4 z-30 transform -translate-y-1/2 max-h-96 overflow-y-auto`}
    >
      <div className="flex justify-center mb-3 mt-1">
        <img
          className="w-24 h-24 rounded-full object-cover"
          src={`${userData.profilePicture}`}
          alt="User Profile"
        />
      </div>

      <h2
        className={`text-center text-2xl font-semibold ${
          textColor || "text-gray-700"
        }`}
      >
        {userDetails.username}
      </h2>
      <p className={`text-center mb-2 text-sm ${textColor || "text-gray-700"}`}>
        {userDetails.email}
      </p>

      <div
        className="flex-grow overflow-y-auto max-h-[400px] pr-2"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Render ordered items */}
        <div className="space-y-3 mt-2">
          {orderedItems.map((item, index) => {
            if (item.type === 'product') {
              return renderProductItem(item.data, index);
            } else if (item.type === 'booking') {
              return renderBookingItem(item.data, index);
            } else if (item.type === 'link') {
              return renderLinkItem(item.data, index);
            }
            return null;
          })}
        </div>

        {orderedItems.length === 0 && (
          <div className="text-center text-gray-600 mt-4">
            <p>No items to display</p>
          </div>
        )}

        {showBookingPage && (
          <div className="mt-6">
            <BookingCard
              title="Book a 1:1 Call with Me"
              price="$99"
              description="Consultation for your needs"
              timezone="Asia/Dubai"
              bgColor="bg-gray-100"
              textColor="text-gray-700"
              availability={{}} // Provide actual availability data
              bookedSlots={{}} // Provide booked slots data
              currentMonth="May 2025"
              onDayClick={() => {}}
              selectedDays={["14", "21", "28"]}
            />
            <button
              onClick={handleHideBookingPage}
              className="mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
            >
              Hide Booking Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;