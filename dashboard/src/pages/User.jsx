import React, { useEffect, useState, useMemo } from "react";
import useDashboardStore from "../store/useDashboardStore";
import { FaSave } from "react-icons/fa";
import {
  Button,
  ConfirmationModal,
  UnsavedChangesNotifier,
} from "../components";
import toast from "react-hot-toast";
import { useBlocker } from "react-router-dom";

import {
  UserMedia,
  UserPersonalDetails,
  UserStats,
  UserSocials,
  UserSkills,
  UserExperience,
  UserEducation,
  UserSecurity,
} from "../components/user";

const User = () => {
  const { data, getUser, updateUser, isLoading } = useDashboardStore();

  const [formData, setFormData] = useState({
    username: "",
    name: { first: "", last: "" },
    email: "",
    password: "",
    bio: "",
    phone: "",
    address: "",
    socialLinks: {},
    skills: [],
    experience: [],
    education: [],
    projectsCompleted: 0,
    happyClients: 0,
    resume: "",
    introVideo: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (data?.user) {
      let experienceArray = [];
      let yearOfExperienceVal = data.user.stats?.yearOfExperience || 0;

      if (Array.isArray(data.user.experience))
        experienceArray = data.user.experience;
      else if (typeof data.user.stats?.yearOfExperience === "number")
        if (!yearOfExperienceVal)
          yearOfExperienceVal = data.user.stats.yearOfExperience;

      const mappedData = {
        avatar: data.user.avatar || "",
        username: data.user.username || "",
        name: data.user.name || { first: "", last: "" },
        email: data.user.email || "",
        bio: data.user.bio || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
        socialLinks: data.user.socialLinks || {},
        skills: data.user.skills || [],
        yearOfExperience: yearOfExperienceVal,
        projectsCompleted: data.user.stats?.projectsCompleted || 0,
        happyClients: data.user.stats?.happyClients || 0,
        experience: experienceArray,
        education: Array.isArray(data.user.education)
          ? data.user.education
          : [],
        resume: data.user.resume || "",
        introVideo: data.user.introVideo || "",
        password: "", // Password is always reset/empty initially
      };

      setFormData(mappedData);
      setInitialData(mappedData);
    }
  }, [data?.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("name.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        name: { ...prev.name, [field]: value },
      }));
    } else if (name.startsWith("stats.")) return;
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  // Track initial data to determine dirty state
  const [initialData, setInitialData] = useState(null);
  const [saveError, setSaveError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (!initialData) return false;
    // Simple deep comparison suitable for this data structure
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  // Block navigation if dirty
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setIsConfirmOpen(true);
    }
  }, [blocker.state]);

  const handleConfirmUpdate = async () => {
    setIsSaving(true);
    setSaveError(false);
    try {
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) delete dataToUpdate.password;

      dataToUpdate.stats = {
        yearOfExperience: formData.yearOfExperience,
        projectsCompleted: formData.projectsCompleted,
        happyClients: formData.happyClients,
      };

      await updateUser(dataToUpdate);
      toast.success("User profile updated successfully!");

      // Update initial data to current on success
      setInitialData(formData);
      setIsConfirmOpen(false);

      // If blocked, proceed
      if (blocker.state === "blocked") {
        blocker.proceed();
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error(error.message || "Failed to update profile.");
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelNavigation = () => {
    setIsConfirmOpen(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  const handleDiscardChanges = () => {
    setIsConfirmOpen(false);
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  };

  if (isLoading && !data?.user)
    return <div className="text-white">Loading...</div>;

  return (
    <div className="pt-6 pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-zinc-400">
          Manage your personal information, stats, and portfolio settings.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card & Media - Standard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <UserPersonalDetails
            formData={formData}
            handleChange={handleChange}
            className="lg:col-span-3"
          />
          <UserMedia
            formData={formData}
            setFormData={setFormData}
            className="lg:col-span-2"
          />
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserExperience formData={formData} setFormData={setFormData} />
          <UserEducation formData={formData} setFormData={setFormData} />
        </div>

        {/* Skills & Socials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserSkills formData={formData} setFormData={setFormData} />
          <UserSocials formData={formData} setFormData={setFormData} />
        </div>

        {/* Details & Stats */}
        <UserStats formData={formData} handleChange={handleChange} />

        <div className="flex justify-end pt-4 sticky bottom-4">
          <Button
            uiType="primary"
            onClick={handleSubmit}
            disabled={!isDirty}
            label="Save Changes"
            icon={<FaSave size={14} />}
            className={`font-semibold px-8 py-3 shadow-xl backdrop-blur-md ${
              !isDirty
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-indigo-600/90 hover:bg-indigo-600"
            }`}
          />
        </div>

        {/* Security / Password */}
        <UserSecurity />
      </form>

      <UnsavedChangesNotifier
        isDirty={isDirty}
        isSaving={isSaving}
        error={saveError}
        onSave={handleSubmit}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmUpdate}
        onCancel={
          blocker.state === "blocked"
            ? handleDiscardChanges
            : handleCancelNavigation
        }
        title={
          blocker.state === "blocked" ? "Unsaved Changes" : "Save Changes?"
        }
        message={
          blocker.state === "blocked"
            ? "You have unsaved changes. Do you want to save them before leaving?"
            : "Are you sure you want to update your profile information?"
        }
        confirmText="Save & Continue"
        cancelText={blocker.state === "blocked" ? "Discard & Leave" : "Cancel"}
        isDangerous={false}
      />
    </div>
  );
};

export default User;
