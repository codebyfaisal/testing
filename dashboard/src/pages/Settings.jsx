import React, { useEffect, useState, useMemo } from "react";
import useDashboardStore from "../store/useDashboardStore";
import {
  FaSave,
  FaImage,
  FaPalette,
  FaStar,
  FaProjectDiagram,
} from "react-icons/fa";
import { useBlocker } from "react-router-dom";
import {
  Button,
  Input,
  Textarea,
  ConfirmationModal,
  UnsavedChangesNotifier,
  Select,
} from "../components";
import ImagePicker from "../components/ImagePicker";
import SettingsMessageTypes from "../components/settings/SettingsMessageTypes";
import toast from "react-hot-toast";

const Settings = () => {
  const { data, getConfig, updateConfig, fetchServices } = useDashboardStore();
  const [config, setConfig] = useState({
    appearance: {
      rounded: true,
      theme: {
        isCustom: false,
        colors: {
          secondary: "#ffffff",
        },
      },
    },
    hero: { greeting: "", title: "", subTitle: "", image: "" },
    about: { title: "", description: "", image: "" },
    messageTypes: [],
    featuredService: {
      serviceId: "",
      title: "",
      image: "",
      description: "",
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  // States for unsaved changes protection
  const [initialData, setInitialData] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    getConfig();
    fetchServices();
  }, [getConfig, fetchServices]);

  useEffect(() => {
    if (data?.config) {
      const isRounded = data.config.appearance?.theme?.borderRadius ?? true;
      const isCustom = data.config.appearance?.theme?.isCustom ?? false;
      const colors = data.config.appearance?.theme?.colors || {
        secondary: "#ffffff",
      };

      const loadedConfig = {
        appearance: { rounded: isRounded, theme: { isCustom, colors } },
        hero: data.config.hero || {
          greeting: "",
          title: "",
          subTitle: "",
          image: "",
        },
        about: data.config.about || { title: "", description: "", image: "" },
        messageTypes: data.config.messageTypes || [],
        featuredService: data.config.featuredService || {
          serviceId: "",
          title: "",
          image: "",
          description: "",
        },
      };
      setConfig(loadedConfig);
      setInitialData(loadedConfig);
    }
  }, [data?.config]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(config) !== JSON.stringify(initialData);
  }, [config, initialData]);

  // Block navigation if dirty
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") setIsConfirmOpen(true);
  }, [blocker.state]);

  const handleChange = (section, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleColorChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: {
          ...prev.appearance.theme,
          colors: {
            ...prev.appearance.theme.colors,
            [key]: value,
          },
        },
      },
    }));
  };

  const handleToggle = (field) => {
    setConfig((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: !prev.appearance[field],
      },
    }));
  };

  const handleThemeToggle = () => {
    setConfig((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: {
          ...prev.appearance.theme,
          isCustom: !prev.appearance.theme.isCustom,
        },
      },
    }));
  };

  const handleMessageTypesChange = (newTypes) =>
    setConfig((prev) => ({ ...prev, messageTypes: newTypes }));

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(false);
    try {
      const payload = {
        ...config,
        appearance: {
          theme: {
            colors: config.appearance.theme.colors,
            isCustom: config.appearance.theme.isCustom,
            borderRadius: config.appearance.rounded,
          },
        },
      };

      await updateConfig(payload);
      toast.success("Settings updated successfully!");
      setInitialData(config);
      setIsConfirmOpen(false);

      if (blocker.state === "blocked") blocker.proceed();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
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

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-400">
          Customize the appearance and content of your portfolio.
        </p>
      </header>

      {/* Appearance */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FaPalette className="text-indigo-500" /> Appearance
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
            <div>
              <h4 className="font-medium text-white">Rounded UI</h4>
              <p className="text-sm text-zinc-400">
                Use rounded corners for elements
              </p>
            </div>
            <div
              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                config.appearance.rounded ? "bg-indigo-600" : "bg-zinc-700"
              }`}
              onClick={() => handleToggle("rounded")}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  config.appearance.rounded ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
          <div>
            <h4 className="font-medium text-white">Custom Theme</h4>
            <p className="text-sm text-zinc-400">
              Enable custom colors for your portfolio
            </p>
          </div>
          <div
            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
              config.appearance.theme.isCustom ? "bg-indigo-600" : "bg-zinc-700"
            }`}
            onClick={handleThemeToggle}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                config.appearance.theme.isCustom
                  ? "translate-x-6"
                  : "translate-x-0"
              }`}
            />
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${
            config.appearance.theme.isCustom
              ? "opacity-100 max-h-[500px]"
              : "opacity-50 max-h-screen grayscale pointer-events-none"
          }`}
        >
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
            <h4 className="font-medium text-white mb-4">Theme Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-zinc-400">
                  Secondary (Accent)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={
                      config.appearance.theme.colors.secondary || "#ffffff"
                    }
                    onChange={(e) =>
                      handleColorChange("secondary", e.target.value)
                    }
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                  />
                  <Input
                    value={
                      config.appearance.theme.colors.secondary || "#ffffff"
                    }
                    onChange={(e) =>
                      handleColorChange("secondary", e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero & About Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaImage className="text-indigo-500" /> Hero Section
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col items-center mb-6 w-full">
              <ImagePicker
                label="Hero Image"
                value={config.hero.image}
                onChange={(url) => handleChange("hero", "image", url)}
              />
            </div>
            <Input
              label="Greeting"
              value={config.hero.greeting}
              onChange={(e) => handleChange("hero", "greeting", e.target.value)}
              placeholder="e.g. Hello, I'm"
            />
            <Input
              label="Title / Name"
              value={config.hero.title}
              onChange={(e) => handleChange("hero", "title", e.target.value)}
              placeholder="e.g. Hello, I'm..."
            />
            <Input
              label="Role / Subtitle"
              value={config.hero.subTitle}
              onChange={(e) => handleChange("hero", "subTitle", e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaImage className="text-indigo-500" /> About Section
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col items-center mb-6 w-full">
              <ImagePicker
                label="About Image"
                value={config.about.image}
                onChange={(url) => handleChange("about", "image", url)}
              />
            </div>
            <Input
              label="Heading"
              value={config.about.title}
              onChange={(e) => handleChange("about", "title", e.target.value)}
            />
            <div className="space-y-2">
              <Textarea
                value={config.about.description}
                onChange={(e) =>
                  handleChange("about", "description", e.target.value)
                }
                rows={4}
                placeholder="e.g. I'm a passionate developer with a strong background in full stack development."
                label="Description"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service & Messages Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Service */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaStar className="text-yellow-500" /> Featured Service
          </h3>

          <div className="space-y-3">
            <Select
              label="Select Service"
              value={config.featuredService.serviceId}
              onChange={(value) =>
                handleChange("featuredService", "serviceId", value)
              }
              options={[
                { value: "", label: "Select a service..." },
                ...(data?.services || []).map((s) => ({
                  label: s.title,
                  value: s._id,
                })),
              ]}
            />
            <Input
              label="Custom Title (Optional)"
              value={config.featuredService.title}
              onChange={(e) =>
                handleChange("featuredService", "title", e.target.value)
              }
              placeholder="Override service title for display"
            />
            <Textarea
              label="Custom Description (Optional)"
              value={config.featuredService.description}
              onChange={(e) =>
                handleChange("featuredService", "description", e.target.value)
              }
              rows={3}
              placeholder="Override service description for display"
            />
            <div className="flex flex-col items-center mb-6 w-full">
              <ImagePicker
                label="Custom Cover Image (Optional)"
                value={config.featuredService.image}
                onChange={(url) =>
                  handleChange("featuredService", "image", url)
                }
              />
              <p className="text-xs text-zinc-500 mt-2">
                Overrides the service's default icon/image
              </p>
            </div>
          </div>
        </div>

        {/* Message Types */}
        <SettingsMessageTypes
          messageTypes={config.messageTypes}
          onChange={handleMessageTypesChange}
        />
      </div>
      <div className="flex justify-end pt-4 sticky bottom-0">
        <Button
          onClick={handleSave}
          uiType="primary"
          icon={<FaSave />}
          label={isSaving ? "Saving..." : "Save Changes"}
          disabled={!isDirty || isSaving}
          className={`px-8 py-3 font-semibold ${
            !isDirty ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <UnsavedChangesNotifier
        isDirty={isDirty}
        isSaving={isSaving}
        error={saveError}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCancelNavigation}
        onConfirm={handleSave}
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
            : "Are you sure you want to update your settings?"
        }
        confirmText="Save & Continue"
        cancelText={blocker.state === "blocked" ? "Discard & Leave" : "Cancel"}
        isDangerous={false}
      />
    </div>
  );
};

export default Settings;
