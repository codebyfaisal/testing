import React, { useEffect, useState, useMemo } from "react";

import { FaSave } from "react-icons/fa";
import {
  Button,
  ConfirmationModal,
  UnsavedChangesNotifier,
  PageHeader,
  UserMedia,
  UserPersonalDetails,
  UserStats,
  UserSocials,
  UserSkills,
  UserExperience,
  UserEducation,
  UserSecurity,
} from "@/components";
import toast from "react-hot-toast";
import { useBlocker } from "react-router-dom";
import useDashboardStore from "@/store/useDashboardStore";

const User = () => {
  const { user, getUser, updateUser, isLoadingAuth, resetAuthLoading } =
    useDashboardStore();

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
    yearOfExperience: 0,
    happyClients: 0,
    resume: "",
    introVideo: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    getUser();
    return () => resetAuthLoading();
  }, [getUser, resetAuthLoading]);

  useEffect(() => {
    if (user) {
      let experienceArray = [];
      let yearOfExperienceVal = user.stats?.yearOfExperience || 0;

      if (Array.isArray(user.experience)) experienceArray = user.experience;
      else if (typeof user.stats?.yearOfExperience === "number")
        if (!yearOfExperienceVal)
          yearOfExperienceVal = user.stats.yearOfExperience;

      const mappedData = {
        avatar: user.avatar || "",
        username: user.username || "",
        name: user.name || { first: "", last: "" },
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || "",
        address: user.address || "",
        socialLinks: user.socialLinks || {},
        skills: user.skills || [],
        yearOfExperience: yearOfExperienceVal,
        projectsCompleted: user.stats?.projectsCompleted || 0,
        happyClients: user.stats?.happyClients || 0,
        experience: experienceArray,
        education: Array.isArray(user.education) ? user.education : [],
        resume: user.resume || "",
        introVideo: user.introVideo || "",
        password: "",
      };

      setFormData(mappedData);
      setInitialData(mappedData);
    }
  }, [user]);

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

  // Helper for deep comparison
  const isDeepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    )
      return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key]))
        return false;
    }

    return true;
  };

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (!initialData) return false;
    // Use deep equal instead of JSON.stringify to avoid key order issues
    return !isDeepEqual(formData, initialData);
  }, [formData, initialData]);

  // Block navigation if dirty
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") setIsConfirmOpen(true);
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

      setIsConfirmOpen(false);

      if (blocker.state === "blocked") blocker.proceed();
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
    if (blocker.state === "blocked") blocker.reset();
  };

  const handleDiscardChanges = () => {
    setIsConfirmOpen(false);
    if (blocker.state === "blocked") blocker.proceed();
  };

  const noOfSocials = Object.values(formData?.socialLinks || {}).filter(
    (link) => link !== ""
  ).length;

  // return <UserSkeleton />;

  return (
    <div className="h-screen flex flex-col space-y-4">
      <PageHeader
        title="Profile"
        description="Manage your personal information, stats, and portfolio settings."
      />
      {user ? (
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-6 content4 relative pb-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Card & Media - Standard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <UserPersonalDetails
                formData={formData}
                handleChange={handleChange}
                className="lg:col-span-3"
                isLoading={isLoadingAuth}
              />
              <UserMedia
                formData={formData}
                setFormData={setFormData}
                className="lg:col-span-2"
                isLoading={isLoadingAuth}
              />
            </div>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserExperience formData={formData} setFormData={setFormData} />
              <UserEducation formData={formData} setFormData={setFormData} />
            </div>

            {/* Skills & Socials */}
            <div className="grid md:grid-cols-3 gap-6">
              <UserSkills
                formData={formData}
                setFormData={setFormData}
                className="md:col-span-2"
              />
              <UserStats formData={formData} handleChange={handleChange} />
            </div>

            <UserSocials
              formData={formData}
              setFormData={setFormData}
              noOfSocials={noOfSocials}
            />

            <div className="sticky -bottom-10 right-0 z-50 w-full flex justify-end">
              <Button
                uiType="primary"
                onClick={handleSubmit}
                disabled={!isDirty}
                label="Save Changes"
                icon={<FaSave size={14} />}
                className={`font-semibold px-8 py-3 shadow-xl backdrop-blur-md transition-all ${
                  !isDirty
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              />
            </div>
          </form>

          {/* Security / Password */}
          <UserSecurity />
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          Failed to load profile.
        </div>
      )}

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
