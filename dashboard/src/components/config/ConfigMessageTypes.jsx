import React, { useState } from "react";
import { FaEnvelope, FaPlus, FaTrash } from "react-icons/fa";
import { Input, Button } from "../";

const ConfigMessageTypes = ({ messageTypes = [], onChange }) => {
  const [newMessageType, setNewMessageType] = useState({
    type: "",
    typeColor: "#ffffff",
  });

  const handleAddMessageType = (e) => {
    e.preventDefault();
    const typeName = newMessageType.type.trim();
    if (typeName) {
      const existingIndex = messageTypes.findIndex(
        (t) => t.type.toLowerCase() === typeName.toLowerCase()
      );

      let updatedTypes;
      if (existingIndex !== -1) {
        updatedTypes = [...messageTypes];
        updatedTypes[existingIndex] = {
          ...updatedTypes[existingIndex],
          typeColor: newMessageType.typeColor,
        };
      } else {
        updatedTypes = [
          ...messageTypes,
          {
            type: typeName,
            typeColor: newMessageType.typeColor,
          },
        ];
      }
      onChange(updatedTypes);
      setNewMessageType({ type: "", typeColor: "#ffffff" });
    }
  };

  const handleRemoveMessageType = (index) => {
    const updatedTypes = messageTypes.filter((_, i) => i !== index);
    onChange(updatedTypes);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FaEnvelope className="text-indigo-500" /> Message Types
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Type Name"
          value={newMessageType.type}
          onChange={(e) =>
            setNewMessageType({
              ...newMessageType,
              type: e.target.value,
            })
          }
          placeholder="e.g. Project Inquiry"
          className="col-span-full"
        />
        <Input
          label="Color"
          type="color"
          value={newMessageType.typeColor || "#ffffff"}
          onChange={(e) =>
            setNewMessageType({
              ...newMessageType,
              typeColor: e.target.value,
            })
          }
          className="col-span-3"
        />
        <div className="flex items-end pb-0.5 col-span-1">
          <Button
            onClick={handleAddMessageType}
            uiType="primary"
            icon={<FaPlus size={12} />}
            label="Add"
            className="w-full flex justify-center"
            style={{ padding: "0.6rem" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {messageTypes.map((t, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-white border border-zinc-700"
            style={{ backgroundColor: t.typeColor || "#27272a" }}
          >
            <span>{t.type}</span>
            <button
              type="button"
              onClick={() => handleRemoveMessageType(index)}
              className="hover:text-red-300 transition-colors"
            >
              <FaTrash size={10} />
            </button>
          </div>
        ))}
        {messageTypes.length === 0 && (
          <p className="text-zinc-500 text-sm italic">
            No message types added.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfigMessageTypes;
