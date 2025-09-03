import React from 'react';
import { OrgTreeNode } from '../types';
import { ChevronDownIcon } from './icons/Icons';

interface OrgChartNodeProps {
    node: OrgTreeNode;
    level: number;
    onToggle: (id: string) => void;
    collapsedNodes: Set<string>;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    onDrop: (draggedId: string, targetId: string) => void;
    setDraggedNodeId: (id: string | null) => void;
    setDropTargetId: (id: string | null) => void;
    draggedNodeId: string | null;
    dropTargetId: string | null;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ 
    node, level, onToggle, collapsedNodes, t, onDrop, 
    setDraggedNodeId, setDropTargetId, draggedNodeId, dropTargetId 
}) => {
    const isCollapsed = collapsedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isDragged = draggedNodeId === node.id;
    const isDropTarget = dropTargetId === node.id;

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
        e.dataTransfer.setData("employeeId", node.id);
        setDraggedNodeId(node.id);
    };

    const handleDragEnd = () => {
        setDraggedNodeId(null);
        setDropTargetId(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        setDropTargetId(node.id);
    };
    
    const handleDragLeave = () => {
        setDropTargetId(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("employeeId");
        if (draggedId) {
            onDrop(draggedId, node.id);
        }
        setDropTargetId(null);
    };

    const nodeClasses = [
        "flex items-center justify-between p-3 rounded-lg border",
        "transition-all duration-200 cursor-grab",
        isDragged ? "dragging" : "bg-white dark:bg-slate-700",
        isDropTarget ? "drop-target" : "border-slate-200 dark:border-slate-600",
    ].join(" ");

    return (
        <li>
            <div
                className={nodeClasses}
                style={{ paddingRight: `${level * 2.5 + 0.75}rem` }}
                draggable
                onDragStart={handleDragStart as any}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver as any}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop as any}
            >
                <div className="flex items-center gap-3">
                    {hasChildren && (
                        <button
                            onClick={() => onToggle(node.id)}
                            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                        </button>
                    )}
                    {!hasChildren && <div className="w-6 h-6"></div>} {/* Spacer */}
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{node.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{node.title}</p>
                    </div>
                </div>
            </div>
            {hasChildren && !isCollapsed && (
                <ul className="mt-2 space-y-2">
                    {node.children.map(child => (
                        <OrgChartNode 
                            key={child.id} 
                            node={child} 
                            level={level + 1}
                            onToggle={onToggle} 
                            collapsedNodes={collapsedNodes} 
                            t={t}
                            onDrop={onDrop}
                            setDraggedNodeId={setDraggedNodeId}
                            setDropTargetId={setDropTargetId}
                            draggedNodeId={draggedNodeId}
                            dropTargetId={dropTargetId}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default OrgChartNode;