"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import AddLinkComponent from "./linkAddModal";
import ProfileThemePicker from "../UI/ThemePicker";
import Header from "../UI/Header";
import { FiShare2, FiSettings } from "react-icons/fi";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveProfile, fetchProfile } from "../../../utils/api";
import { useSession } from "next-auth/react";

interface LinksProps {
  addedLinks: any[];
  setAddedLinks: React.Dispatch<React.SetStateAction<any[]>>;
  addedProducts?: any[];
  setAddedProducts?: React.Dispatch<React.SetStateAction<any[]>>;
  cardBgColor: string;
  cardTextColor: string;
  setCardBgColor: React.Dispatch<React.SetStateAction<string>>;
  setCardTextColor: React.Dispatch<React.SetStateAction<string>>;
}

const Links: React.FC<LinksProps> = ({
  addedLinks,
  setAddedLinks,
  addedProducts = [],
  setAddedProducts = () => {},
  cardBgColor,
  cardTextColor,
  setCardBgColor,
  setCardTextColor,
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<{
    index: number;
    link: any;
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getUserIdentifier = () => {
    if (session?.user?.name) {
      return session.user.name;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.username) {
          return payload.username;
        }
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

        if (profileData.links && Array.isArray(profileData.links)) {
          setAddedLinks(profileData.links);
        }

        if (
          profileData.products &&
          Array.isArray(profileData.products) &&
          setAddedProducts
        ) {
          setAddedProducts(profileData.products);
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

    const savedLinks = localStorage.getItem("addedLinks");
    if (savedLinks) {
      try {
        const parsed = JSON.parse(savedLinks);
        setAddedLinks(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Invalid JSON in localStorage for links", error);
        setAddedLinks([]);
      }
    }

    if (setAddedProducts) {
      const savedProducts = localStorage.getItem("addedProducts");
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          setAddedProducts(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error("Invalid JSON in localStorage for products", error);
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
    localStorage.setItem("addedLinks", JSON.stringify(addedLinks));
    sessionStorage.setItem("addedLinks", JSON.stringify(addedLinks));
  }, [addedLinks]);

  useEffect(() => {
    localStorage.setItem(
      "profileTheme",
      JSON.stringify({
        bgColor: cardBgColor,
        textColor: cardTextColor,
      })
    );
  }, [cardBgColor, cardTextColor]);

  const saveProfileToAPI = async () => {
    const username = getUserIdentifier();

    if (username && username !== "guest") {
      try {
        setSaveStatus("Saving...");

        let productsData = addedProducts;

        if (!productsData || productsData.length === 0) {
          const savedProducts = localStorage.getItem("addedProducts");
          if (savedProducts) {
            try {
              productsData = JSON.parse(savedProducts);
            } catch (error) {
              console.error("Invalid JSON in localStorage for products", error);
              productsData = [];
            }
          } else {
            productsData = [];
          }
        }

        const profileData = {
          links: addedLinks,
          products: productsData,
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

  const handleAddLink = (link: any) => {
    const logoUrl = getLogoFromUrl(link.url);
    setAddedLinks((prev) => [...prev, { ...link, image: logoUrl }]);
    setIsModalOpen(false);
  };

  const handleEditLink = (link: any) => {
    if (editingLink !== null) {
      const logoUrl = getLogoFromUrl(link.url);
      const updatedLinks = [...addedLinks];
      updatedLinks[editingLink.index] = { ...link, image: logoUrl };
      setAddedLinks(updatedLinks);
      setEditingLink(null);
      setIsModalOpen(false);
    }
  };

  const openModal = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Opening edit modal for link at index:", index);
    setEditingLink({
      index,
      link: { ...addedLinks[index] },
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteLink = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const newLinks = addedLinks.filter((_, i) => i !== index);
    setAddedLinks(newLinks);
  };

  const handleBgColorChange = (color: string) => {
    setCardBgColor(color);
  };

  const handleTextColorChange = (color: string) => {
    setCardTextColor(color);
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
        className="flex items-center space-x-4 px-4 py-2 border bg-gray-50 rounded-lg shadow-md"
      >
        <span className="cursor-grab text-xl">⠿</span>

        {children}
      </div>
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = parseInt(active.id);
      const newIndex = parseInt(over.id);
      const updatedLinks = arrayMove(addedLinks, oldIndex, newIndex);
      setAddedLinks(updatedLinks);
    }
  };

  const getLogoFromUrl = (url: string) => {
    if (url.includes("youtube.com")) return "/assets/youtube.png";
    if (url.includes("instagram.com")) return "/assets/instagram.png";
    if (url.includes("tiktok.com")) return "/assets/tiktok.png";
    if (url.includes("facebook.com")) return "/assets/facebook.png";
    if (url.includes("google.com")) return "/assets/google.webp";
    return "/assets/default.png";
  };

  const LinksList = () => (
    <div className="space-y-6">
      {addedLinks.length === 0 ? (
        <div className="text-center text-gray-600 col-span-full">
          <p>No links added yet. Please add links!</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={addedLinks.map((_, index) => index.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {addedLinks.map((link, index) => (
                <SortableItem key={index} id={index.toString()}>
                  <div className="flex items-center space-x-4 p-3 max-w-full overflow-hidden">
                    <img
                      src={link.image || "/assets/default.png"}
                      alt={link.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex flex-col min-w-80">
                      <h4
                        className="text-lg font-semibold text-gray-800 truncate max-w-[220px]"
                        title={link.title}
                      >
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate max-w-[220px]">
                        {link.url}
                      </p>
                    </div>
                    <div className="ml-auto flex flex-col">
                      <button
                        onClick={(e) => openEditModal(index, e)}
                        className="text-blue-600 px-90 py-2 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <FiEdit size={19} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteLink(index, e)}
                        className="text-red-600 px-90 py-2 hover:bg-red-50 rounded-full transition-colors mt-1"
                      >
                        <MdDeleteOutline size={22} />
                      </button>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );

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

  return (
    <div className="w-full lg:w-2/3 pb-[6%] border rounded-2xl border-gray-100 shadow-xl p-6 min-h-[600px]">
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
          Start by adding some links
        </h2>
        <button
          onClick={openModal}
          className="w-[90%] text-center justify-center mx-auto bg-purple-600 text-white px-4 py-3 rounded-full space-x-2 mb-6 flex items-center"
        >
          <span className="text-lg">+</span>
          <span>Add Link</span>
        </button>
      </div>

      <p className="text-gray-600 mb-6 text-center">
        Copy and paste links from anywhere.
      </p>
      <LinksList />

      {isModalOpen && (
        <AddLinkComponent
          onClose={closeModal}
          onAddLink={editingLink ? handleEditLink : handleAddLink}
          editingLink={editingLink?.link}
          isEditing={editingLink !== null}
        />
      )}
    </div>
  );
};

export default Links;
