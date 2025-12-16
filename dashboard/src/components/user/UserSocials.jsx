import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaBehance,
  FaDribbble,
  FaMedium,
  FaYoutube,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Input, Button, Select } from "../../components";

const socialPlatforms = [
  {
    name: "Website",
    value: "website",
    icon: <FaGlobe />,
    link: "https://www.username.com",
  },
  {
    name: "GitHub",
    value: "github",
    icon: <FaGithub />,
    link: "https://github.com/",
  },
  {
    name: "LinkedIn",
    value: "linkedin",
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/in/",
  },
  {
    name: "Twitter",
    value: "twitter",
    icon: <FaTwitter />,
    link: "https://x.com/",
  },
  {
    name: "Instagram",
    value: "instagram",
    icon: <FaInstagram />,
    link: "https://www.instagram.com/",
  },
  {
    name: "Facebook",
    value: "facebook",
    icon: <FaFacebook />,
    link: "https://www.facebook.com/",
  },
  {
    name: "Behance",
    value: "behance",
    icon: <FaBehance />,
    link: "https://www.behance.net/",
  },
  {
    name: "Dribbble",
    value: "dribbble",
    icon: <FaDribbble />,
    link: "https://www.dribbble.com/",
  },
  {
    name: "Medium",
    value: "medium",
    icon: <FaMedium />,
    link: "https://www.medium.com/",
  },
  {
    name: "YouTube",
    value: "youtube",
    icon: <FaYoutube />,
    link: "https://www.youtube.com/",
  },
];

const UserSocials = ({ formData, setFormData }) => {
  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "" });

  const handleAddSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [newSocialLink.platform]: newSocialLink.url,
        },
      }));
      setNewSocialLink({ platform: "", url: "" });
    }
  };

  const handleRemoveSocialLink = (platform) => {
    const updatedLinks = { ...formData.socialLinks };
    delete updatedLinks[platform];
    setFormData((prev) => ({ ...prev, socialLinks: updatedLinks }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold text-white mb-6">Social Profiles</h3>

      {/* Add New Social Link */}
      <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
        <Select
          value={newSocialLink.platform}
          onChange={(value) =>
            setNewSocialLink({
              ...newSocialLink,
              platform: value,
            })
          }
          placeholder="Select Platform"
          options={socialPlatforms.map((p) => ({
            label: p.name,
            value: p.value,
            disabled: !!formData.socialLinks[p.value],
          }))}
          className="col-span-3"
        />
        <Button
          onClick={handleAddSocialLink}
          disabled={!newSocialLink.platform || !newSocialLink.url}
          uiType="primary"
          icon={<FaPlus size={12} />}
          label="Add"
          className="col-span-1 justify-center"
          style={{ padding: "0.6rem" }}
        />
        <Input
          value={newSocialLink.url}
          onChange={(e) =>
            setNewSocialLink({
              ...newSocialLink,
              url: e.target.value,
            })
          }
          placeholder={
            socialPlatforms.find((p) => p.value === newSocialLink.platform)
              ?.link
          }
          className="col-span-full"
        />
      </div>

      {/* List of Added Links */}
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(formData.socialLinks).map(([platform, url]) => {
          const platformInfo = socialPlatforms.find(
            (p) => p.value === platform
          );
          if (!platformInfo) return null;

          return (
            <div
              key={platform}
              className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl group"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-indigo-500 text-xl border border-zinc-800">
                {platformInfo.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white capitalize">
                  {platformInfo.name}
                </h4>
                <p className="text-xs text-zinc-500 truncate">{url}</p>
              </div>
              <Button
                onClick={() => handleRemoveSocialLink(platform)}
                uiType="text"
                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 w-auto"
                icon={<FaTrash />}
              />
            </div>
          );
        })}
        {Object.keys(formData.socialLinks).length === 0 && (
          <div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
            No social profiles added yet
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserSocials;
