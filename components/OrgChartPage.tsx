import React, { useMemo, useState } from 'react';
import { useUserContext } from './contexts/UserContext';
import { OrgTreeNode } from '../types';
import { useTranslation } from './contexts/LanguageContext';
import OrgChartNode from './OrgChartNode';

const OrgChartPage: React.FC = () => {
    const { employees, updateEmployeeManager } = useUserContext();
    const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
    const { t } = useTranslation();
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);

    const tree = useMemo((): OrgTreeNode[] => {
        const orgEmployees = employees.filter(e => e.isEmployee);
        const nodes: { [id: string]: OrgTreeNode } = {};
        const orgEmployeeIds = new Set(orgEmployees.map(e => e.id));

        orgEmployees.forEach(emp => {
            nodes[emp.id] = { ...emp, children: [] };
        });

        const roots: OrgTreeNode[] = [];
        orgEmployees.forEach(emp => {
            if (emp.managerId && orgEmployeeIds.has(emp.managerId) && nodes[emp.managerId]) {
                nodes[emp.managerId].children.push(nodes[emp.id]);
            } else {
                roots.push(nodes[emp.id]);
            }
        });
        
        return roots;
    }, [employees]);

    const handleToggleCollapse = (id: string) => {
        setCollapsedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleDrop = (draggedId: string, targetId: string) => {
        const draggedNode = employees.find(e => e.id === draggedId);
        if (draggedId !== targetId && draggedNode && draggedNode.managerId !== targetId) {
            updateEmployeeManager(draggedId, targetId);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 h-full rounded-xl shadow-md flex flex-col overflow-hidden">
            <div className="p-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <p className="text-sm text-center text-slate-600 dark:text-slate-300">{t('orgChart.dragDropHint')}</p>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-6">
                <ul className="space-y-2">
                    {tree.map(rootNode => (
                        <OrgChartNode 
                            key={rootNode.id} 
                            node={rootNode} 
                            level={0}
                            onToggle={handleToggleCollapse} 
                            collapsedNodes={collapsedNodes}
                            t={t}
                            onDrop={handleDrop}
                            setDraggedNodeId={setDraggedNodeId}
                            setDropTargetId={setDropTargetId}
                            draggedNodeId={draggedNodeId}
                            dropTargetId={dropTargetId}
                        />
                    ))}
                </ul>
                {tree.length === 0 && (
                    <p className="text-slate-500 dark:text-slate-400 p-8 text-center">{t('orgChart.noData')}</p>
                )}
            </div>
        </div>
    );
};

export default OrgChartPage;