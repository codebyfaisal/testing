import React, { useEffect, useState, useMemo } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaSave, FaImage, FaPalette, FaStar } from "react-icons/fa";
import { useBlocker } from "react-router-dom";
import {
  Button,
  Input,
  Textarea,
  ConfirmationModal,
  UnsavedChangesNotifier,
  Select,
  PageHeader,
  FilePickerModal,
  Card,
  ConfigMessageTypes,
  Switch,
} from "@/components";
import toast from "react-hot-toast";

// Helper component for Image Selection
const ImageSelectionField = ({ value, label, onSelect, onRemove }) => {
  return (
    <div className="flex flex-col mb-6 w-full space-y-2">
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-full h-48 bg-muted/30 border border-border overflow-hidden rounded-lg group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              onClick={onSelect}
              icon={<FaImage />}
              label="Change"
              uiType="secondary"
              size="sm"
            />
            <Button
              onClick={onRemove}
              label="Remove"
              uiType="danger"
              size="sm"
            />
          </div>
        </div>
      ) : (
        <div
          className="relative w-full h-32 bg-muted/20 border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/30 transition-all rounded-lg"
          onClick={onSelect}
        >
          <FaImage className="text-3xl text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Select Image</p>
        </div>
      )}
    </div>
  );
};

const Configuration = () => {
  const {
    config: storeConfig,
    services,
    getConfig,
    updateConfig,
    fetchServices,
    isLoading,
    resetConfigState,
  } = useDashboardStore();
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

  // File Picker State
  const [pickerState, setPickerState] = useState({
    isOpen: false,
    section: null,
    field: null,
  });

  const handleOpenPicker = (section, field) => {
    setPickerState({ isOpen: true, section, field });
  };

  const handleFileSelect = (url) => {
    if (pickerState.section && pickerState.field) {
      handleChange(pickerState.section, pickerState.field, url);
    }
    setPickerState({ ...pickerState, isOpen: false });
  };

  useEffect(() => {
    getConfig();
    fetchServices();
    return () => resetConfigState();
  }, [getConfig, fetchServices, resetConfigState]);

  useEffect(() => {
    if (storeConfig) {
      const rounded = storeConfig.appearance?.theme?.borderRadius ?? true;
      const isCustom = storeConfig.appearance?.theme?.isCustom ?? false;
      const colors = storeConfig.appearance?.theme?.colors || {
        secondary: "#ffffff",
      };

      const loadedConfig = {
        appearance: { rounded, theme: { isCustom, colors } },
        hero: storeConfig.hero || {
          greeting: "",
          title: "",
          subTitle: "",
          image: "",
        },
        about: storeConfig.about || { title: "", description: "", image: "" },
        messageTypes: storeConfig.messageTypes || [],
        featuredService: storeConfig.featuredService || {
          serviceId: "",
          title: "",
          image: "",
          description: "",
        },
      };
      setConfig(loadedConfig);
      setInitialData(loadedConfig);
    }
  }, [storeConfig]);

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
      toast.success("Configuration updated successfully!");
      setInitialData(config);
      setIsConfirmOpen(false);

      if (blocker.state === "blocked") blocker.proceed();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update configuration");
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
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Configuration"
        description="Customize the appearance and content of your portfolio."
      />

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-8">
        {/* Appearance */}
        <Card className="space-y-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <FaPalette className="text-primary" /> Appearance
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="flex justify-between">
              <div>
                <h4 className="font-medium text-foreground">Rounded UI</h4>
                <p className="text-sm text-muted-foreground">
                  Use rounded corners for elements
                </p>
              </div>
              <Switch
                checked={config.appearance.rounded}
                onChange={() => handleToggle("rounded")}
              />
            </Card>

            <Card className="col-span-1 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Custom Theme</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable custom colors for your portfolio
                  </p>
                </div>
                <Switch
                  checked={config.appearance.theme.isCustom}
                  onChange={handleThemeToggle}
                />
              </div>

              <div
                className={`transition-all duration-300 ${
                  config.appearance.theme.isCustom
                    ? "opacity-100 max-h-[500px]"
                    : "opacity-50 max-h-screen grayscale pointer-events-none"
                }`}
              >
                <label className="text-xs text-muted-foreground">
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
            </Card>
          </div>
        </Card>

        {/* Hero & About Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hero Section */}
          <Card>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FaImage className="text-primary" /> Hero Section
            </h3>
            <div className="space-y-3">
              <ImageSelectionField
                label="Hero Image"
                value={config.hero.image}
                onSelect={() => handleOpenPicker("hero", "image")}
                onRemove={() => handleChange("hero", "image", "")}
              />

              <Input
                label="Greeting"
                value={config.hero.greeting}
                onChange={(e) =>
                  handleChange("hero", "greeting", e.target.value)
                }
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
                onChange={(e) =>
                  handleChange("hero", "subTitle", e.target.value)
                }
                placeholder="e.g. Full Stack Developer"
              />
            </div>
          </Card>

          {/* About Section */}
          <Card>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FaImage className="text-primary" /> About Section
            </h3>
            <div className="space-y-3">
              <ImageSelectionField
                label="About Image"
                value={config.about.image}
                onSelect={() => handleOpenPicker("about", "image")}
                onRemove={() => handleChange("about", "image", "")}
              />
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
          </Card>
        </div>

        {/* Service & Messages Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Service */}
          <Card>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
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
                  ...(services || []).map((s) => ({
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
              <ImageSelectionField
                label="Custom Cover Image (Optional)"
                value={config.featuredService.image}
                onSelect={() => handleOpenPicker("featuredService", "image")}
                onRemove={() => handleChange("featuredService", "image", "")}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Overrides the service's default icon/image
              </p>
            </div>
          </Card>

          {/* Message Types */}
          <ConfigMessageTypes
            messageTypes={config.messageTypes}
            onChange={handleMessageTypesChange}
          />
        </div>

        <div className="flex justify-end sticky bottom-0 right-0 z-50">
          <Button
            onClick={handleSave}
            uiType="primary"
            icon={<FaSave />}
            label={isSaving ? "Saving..." : "Save Changes"}
            disabled={!isDirty || isSaving}
            className={`px-8 py-3 font-semibold ${
              !isDirty
                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                : ""
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
          cancelText={
            blocker.state === "blocked" ? "Discard & Leave" : "Cancel"
          }
          isDangerous={false}
        />

        <FilePickerModal
          isOpen={pickerState.isOpen}
          onClose={() => setPickerState({ ...pickerState, isOpen: false })}
          onSelect={handleFileSelect}
          resourceType="images"
        />
      </div>
    </div>
  );
};

export default Configuration;
