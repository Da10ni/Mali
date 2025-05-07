"use client";

import React, { useState, useEffect, useContext } from "react";
import { FiEdit, FiShare2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { BsCalendarCheck } from "react-icons/bs";
import ProductAddModal from "./ProductAddModal";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveProfile, fetchProfile } from "../../../utils/api";
import { useSession } from "next-auth/react";
import { AuthContext } from "@/src/context/AuthContext";
import Link from "next/link";
import { fetchBookingByUsername } from "@/src/services/Booking";

interface ProductsProps {
  addedProducts: any[];
  setAddedProducts: React.Dispatch<React.SetStateAction<any[]>>;
  addedLinks?: any[];
  setAddedLinks?: React.Dispatch<React.SetStateAction<any[]>>;
  cardBgColor: string;
  cardTextColor: string;
  setCardBgColor: React.Dispatch<React.SetStateAction<string>>;
  setCardTextColor: React.Dispatch<React.SetStateAction<string>>;
}

// Enhanced list item interface to store both products and bookings in a single array
interface ListItem {
  id: string;
  type: "product" | "booking";
  data: any;
  order: number; // Order position in the list
}

const Products: React.FC<ProductsProps> = ({
  addedProducts,
  setAddedProducts,
  addedLinks = [],
  setAddedLinks = () => {},
  cardBgColor,
  cardTextColor,
  setCardBgColor,
  setCardTextColor,
}) => {
  const { data: session } = useSession();
  const userdata = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [orderChanged, setOrderChanged] = useState(false);

  const [editingProduct, setEditingProduct] = useState<{
    index: number;
    product: any;
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const initializeListItems = () => {
    let items: ListItem[] = [];

    items = addedProducts.map((product, index) => ({
      id: `product-${index}`,
      type: "product",
      data: product,
      order: index,
    }));
    if (bookingData) {
      const bookingOrder = localStorage.getItem("bookingItemOrder")
        ? parseInt(localStorage.getItem("bookingItemOrder") || "999")
        : 999;

      let insertPosition = bookingOrder;

      if (insertPosition >= items.length) {
        insertPosition = items.length;
      }

      const bookingItem: ListItem = {
        id: "booking-0",
        type: "booking",
        data: bookingData,
        order: insertPosition,
      };

      items.splice(insertPosition, 0, bookingItem);

      items = items.map((item, index) => ({
        ...item,
        order: index,
      }));
    }

    setListItems(items);
  };

  useEffect(() => {
    if (!orderChanged) {
      initializeListItems();
    }
  }, [addedProducts, bookingData]);

  useEffect(() => {
    if (orderChanged) {
      const bookingItem = listItems.find((item) => item.type === "booking");
      if (bookingItem) {
        localStorage.setItem("bookingItemOrder", bookingItem.order.toString());
      }

      setOrderChanged(false);
    }
  }, [orderChanged, listItems]);

  const getBookingData = async () => {
    try {
      const data = await fetchBookingByUsername(userdata.user.username);
      console.log("data >>>>>>>>>>>>>>>>>>", data);
      setBookingData(
        data || {
          title: "Book a 1:1 Call with Me",
        }
      );
    } catch (error) {
      console.error("Error fetching booking data:", error);
      setBookingData({
        title: "Book a 1:1 Call with Me",
      });
    }
  };

  useEffect(() => {
    getBookingData();
  }, []);

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

  const loadProfileData = async () => {
    const username = getUserIdentifier();

    if (username && username !== "guest") {
      try {
        const profileData = await fetchProfile(username);

        if (profileData.products && Array.isArray(profileData.products)) {
          setAddedProducts(profileData.products);
        }

        if (
          profileData.links &&
          Array.isArray(profileData.links) &&
          setAddedLinks
        ) {
          setAddedLinks(profileData.links);
        }

        if (profileData.theme) {
          if (profileData.theme.bgColor)
            setCardBgColor(profileData.theme.bgColor);
          if (profileData.theme.textColor)
            setCardTextColor(profileData.theme.textColor);
        }

        return;
      } catch (error) {
        console.error("Error loading profile from API:", error);
      }
    }

    const savedProducts = localStorage.getItem("addedProducts");
  
  if (savedProducts) {
    try {
      const parsed = JSON.parse(savedProducts);
      setAddedProducts(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Invalid JSON in localStorage for products", error);
      setAddedProducts([]);
    }
  }

    if (setAddedLinks) {
      const savedLinks = localStorage.getItem("addedLinks");
      if (savedLinks) {
        try {
          const parsed = JSON.parse(savedLinks);
          setAddedLinks(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error("Invalid JSON in localStorage for links", error);
        }
      }
    }

    const savedTheme = localStorage.getItem("profileTheme");
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        if (theme.bgColor) setCardBgColor(theme.bgColor);
        if (theme.textColor) setCardTextColor(theme.textColor);
      } catch (error) {
        console.error("Invalid theme in localStorage", error);
      }
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    localStorage.setItem("addedProducts", JSON.stringify(addedProducts));
    sessionStorage.setItem("addedProducts", JSON.stringify(addedProducts)); 
  }, [addedProducts]);

  useEffect(() => {
    localStorage.setItem(
      "profileTheme",
      JSON.stringify({
        bgColor: cardBgColor,
        textColor: cardTextColor,
      })
    );
  }, [cardBgColor, cardTextColor]);

  const openEditModal = (productIndex: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Opening edit modal for product at index:", productIndex);
    setEditingProduct({
      index: productIndex,
      product: { ...addedProducts[productIndex] },
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = listItems.findIndex((item) => item.id === active.id);
      const newIndex = listItems.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(listItems, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      setListItems(newItems);

      const productItems = newItems
        .filter((item) => item.type === "product")
        .map((item) => item.data);

      setAddedProducts(productItems);

      setOrderChanged(true);
    }
  };

  const handleDeleteProduct = (productIndex: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const newProducts = addedProducts.filter((_, i) => i !== productIndex);
    setAddedProducts(newProducts);
  };

  const handleUpdateProduct = (productIndex: number, updated: any) => {
    const newProducts = [...addedProducts];
    newProducts[productIndex] = updated;
    setAddedProducts(newProducts);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddProduct = (product: any) => {
    setAddedProducts((prev) => [...prev, product]);
    setIsModalOpen(false);
  };

  const SortableItem = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: transform ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center space-x-4 px-4 py-2 border bg-white rounded-lg shadow-md"
      >
        <span className="cursor-grab text-xl">⠿</span>
        {children}
      </div>
    );
  };

  const saveProfileToAPI = async () => {
    const username = getUserIdentifier();
    if (username && username !== "guest") {
      try {
        setSaveStatus("Saving...");

        let linksData = addedLinks;

        if (!linksData || linksData.length === 0) {
          const savedLinks = localStorage.getItem("addedLinks");
          if (savedLinks) {
            try {
              linksData = JSON.parse(savedLinks);
            } catch (error) {
              console.error("Invalid JSON in localStorage for links", error);
              linksData = [];
            }
          } else {
            linksData = [];
          }
        }

        const profileData = {
          products: addedProducts,
          links: linksData,
          theme: { bgColor: cardBgColor, textColor: cardTextColor },
        };

        await saveProfile(username, profileData);
        setSaveStatus("Saved successfully!");

        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
      } catch (error) {
        console.error("Error saving profile to API:", error);
        setSaveStatus("Failed to save. Try again later.");

        setTimeout(() => {
          setSaveStatus(null);
        }, 5000);
      }
    } else {
      setSaveStatus("Please login to save your profile.");
      setTimeout(() => {
        setSaveStatus(null);
      }, 5000);
    }
  };

  const getShareUrl = () => {
    const username = getUserIdentifier();
    if (username && username !== "guest") {
      return `${window.location.origin}/profile/${username}`;
    }
    return null;
  };

  const handleShare = () => {
    const shareUrl = getShareUrl();
    if (shareUrl) {
      saveProfileToAPI().then(() => {
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
              alert("Profile URL copied to clipboard!");
            })
            .catch((err) => {
              console.error("Failed to copy URL: ", err);
              alert("Share URL: " + shareUrl);
            });
        } else {
          alert("Share URL: " + shareUrl);
        }
      });
    } else {
      alert("Please login to share your profile.");
    }
  };

  const findProductIndex = (product: any) => {
    return addedProducts.findIndex((p) => p === product);
  };

  const renderProductItem = (product: any) => {
    const productIndex = findProductIndex(product);

    return (

      <div className="flex items-center space-x-4 p-3 max-w-full overflow-hidden">
        
        <img
          src={product.imageUrl || "/default.jpg"}
          alt={product.title}
          className="w-12 h-12 object-cover rounded-md"
        />
        <div className="flex flex-col min-w-80">
          <h4
            className="text-lg font-semibold text-gray-800 truncate max-w-[220px]"
            title={product.title}
          >
            {product.title}
          </h4>
          <p className="text-sm text-gray-500 truncate max-w-[220px]">
            {product.url}
          </p>
          <div className="flex items-center mt-1"></div>
        </div>
        <div className="ml-auto flex flex-col">
          <button
            onClick={(e) => openEditModal(productIndex, e)}
            className="text-blue-600 p-2 hover:bg-blue-50 rounded-full"
          >
            <FiEdit size={19} />
          </button>
          <button
            onClick={(e) => handleDeleteProduct(productIndex, e)}
            className="text-red-600 mt-1 p-2 hover:bg-red-50 rounded-full"
          >
            <MdDeleteOutline size={22} />
          </button>
        </div>
      </div>
    );
  };
  const renderBookingItem = (data: any) => {
    const username = userdata?.user?.username || getUserIdentifier();

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

  return (
    <div className="w-full lg:w-2/3 pb-[6%] border rounded-2xl border-gray-500 shadow-xl p-6">
      <div className="justify-center gap-10 items-center mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-center">
            Hello {session?.user?.name || "User"}
          </h2>

          <div className="flex space-x-2">
            {/* Save to API button */}
            <button
              onClick={saveProfileToAPI}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Publish Changes
            </button>
          </div>
        </div>

        {/* Save status message */}
        {saveStatus && (
          <div
            className={`mb-4 p-2 rounded-md text-center ${
              saveStatus.includes("Failed") || saveStatus.includes("login")
                ? "bg-red-100 text-red-700"
                : saveStatus === "Saving..."
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {saveStatus}
          </div>
        )}

        <h2 className="text-xl mb-4 font-semibold text-center">
          Start by adding some products
        </h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-purple-600 text-white px-4 py-3 ml-5 rounded-full space-x-2 mb-6 flex items-center"
        >
          <span className="text-lg mr-1">+</span>
          <span>Add Product</span>
        </button>
      </div>

      <p className="text-gray-600 mb-6 text-center">
        Copy and paste links from anywhere.
      </p>

      <div className="space-y-6">
        {listItems.length === 0 ? (
          <div className="text-center text-gray-600 col-span-full">
            <p>No products added yet. Please add products!</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={listItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {listItems.map((item) => (
                  <SortableItem key={item.id} id={item.id}>
                    {item.type === "product"
                      ? renderProductItem(item.data)
                      : renderBookingItem(item.data)}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {isModalOpen && (
        <ProductAddModal
          onClose={closeModal}
          onAddProduct={handleAddProduct}
          editProduct={editingProduct?.product}
          editIndex={editingProduct?.index}
          onUpdateProduct={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default Products;
