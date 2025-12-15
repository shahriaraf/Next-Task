"use client";

import React, { useState } from "react";
import { TreeNode } from "@/types/tree";
import { ChevronRight, ChevronDown, MoreHorizontal, Plus, Trash2 } from "lucide-react";

interface TreeItemProps {
  node: TreeNode;
  onAdd: (parentId: string) => void;
  onDelete: (nodeId: string) => void;
}

export const TreeItem: React.FC<TreeItemProps> = ({ node, onAdd, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const hasChildren = node.children.length > 0;

  return (
    <div className="pl-4 border-l border-gray-200">
      <div className="flex items-center group py-2">
        {/* Expand/Collapse Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`mr-2 p-1 rounded hover:bg-gray-100 ${
            !hasChildren ? "invisible" : ""
          }`}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Node Label */}
        <span className="font-medium text-gray-700">{node.label}</span>

        {/* 3-Dot Menu */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Context Menu Dropdown */}
          {showMenu && (
            <>
              {/* Backdrop to close menu when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border rounded shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => {
                    onAdd(node.id);
                    setShowMenu(false);
                    setIsOpen(true); // Auto expand when adding
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-blue-600 flex items-center gap-2"
                >
                  <Plus size={14} /> Add Child
                </button>
                <button
                  onClick={() => {
                    onDelete(node.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recursive Rendering */}
      {isOpen && hasChildren && (
        <div className="ml-2">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};