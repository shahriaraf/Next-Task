"use client";

import { useState, useEffect } from "react";
import { TreeItem } from "./TreeItem";
import { TreeNode } from "@/types/tree";
import { addChildNode, deleteNode } from "@/lib/tree-utils";

const INITIAL_DATA: TreeNode[] = [
  {
    id: "root-1",
    label: "Root Folder",
    children: [],
  },
];

const STORAGE_KEY = "tree-structure-data"; // Key for LocalStorage

export default function TreeView() {
  const [treeData, setTreeData] = useState<TreeNode[]>(INITIAL_DATA);
  
  // New state to track if we are running on the client
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal State
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");

  // --- 1. Load Data from LocalStorage on mount ---
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setTreeData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse tree data:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // --- 2. Save Data to LocalStorage whenever it changes ---
  useEffect(() => {
    // Only save if we have finished loading (prevents overwriting with empty data on start)
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(treeData));
    }
  }, [treeData, isLoaded]);

  // Handlers
  const handleAddStart = (parentId: string) => {
    setActiveNodeId(parentId);
    setIsAddModalOpen(true);
  };

  const handleDeleteStart = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setIsDeleteModalOpen(true);
  };

  const confirmAdd = () => {
    if (!activeNodeId || !newNodeName.trim()) return;
    setTreeData((prev) => addChildNode(prev, activeNodeId, newNodeName));
    setNewNodeName("");
    setIsAddModalOpen(false);
  };

  const confirmDelete = () => {
    if (!activeNodeId) return;
    setTreeData((prev) => deleteNode(prev, activeNodeId));
    setIsDeleteModalOpen(false);
  };


  if (!isLoaded) {
    return <div className="p-8 text-center text-gray-500">Loading tree...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Multi-Level Tree View</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {treeData.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            onAdd={handleAddStart}
            onDelete={handleDeleteStart}
          />
        ))}
        {treeData.length === 0 && (
            <div className="text-center text-gray-400 py-10">
                Tree is empty.
                <button 
                  onClick={() => {
                    setTreeData(INITIAL_DATA);
                    localStorage.removeItem(STORAGE_KEY);
                  }}
                  className="ml-2 text-blue-600 underline hover:text-blue-800"
                >
                  Reset to Default
                </button>
            </div>
        )}
      </div>

      
      {/* Add Child Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add New Child</h3>
            <input
              type="text"
              placeholder="Enter node label..."
              className="w-full border p-2 rounded mb-4"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmAdd();
                if (e.key === "Escape") setIsAddModalOpen(false);
              }}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >Cancel</button>
              <button 
                onClick={confirmAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >Add Node</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete Node?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure? This will delete the node and all of its children.
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >Cancel</button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}