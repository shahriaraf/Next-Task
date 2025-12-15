import { TreeNode } from "@/types/tree";

// Helper to generate unique IDs
export const generateId = () => Math.random().toString(30).substr(2, 9);

// Recursive function to add a child node
export const addChildNode = (tree: TreeNode[], parentId: string, label: string): TreeNode[] => {
  return tree.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...node.children, { id: generateId(), label, children: [] }],
      };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: addChildNode(node.children, parentId, label),
      };
    }
    return node;
  });
};

// Recursive function to delete a node
export const deleteNode = (tree: TreeNode[], nodeId: string): TreeNode[] => {
  return tree
    .filter((node) => node.id !== nodeId) // Filter out the node if it's at the current level
    .map((node) => ({
      ...node,
      children: deleteNode(node.children, nodeId), // Recursively filter children
    }));
};