import React, { useMemo, useState } from 'react';
import { useUserContext } from './contexts/UserContext';
import { OrgTreeNode } from '../types';
import { useTranslation } from './contexts/LanguageContext';

// Recursive component to render a node and its children
const OrgChartNode: React.FC<{ node: OrgTreeNode; onToggle: (id: string) => void; collapsedNodes: Set<string>; }> = ({ node, onToggle, collapsedNodes }) => {
    const isCollapsed = collapsedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <li>
            <div className="oc-node-content bg-white dark:bg-slate-700 p-3 rounded-lg shadow-md border-2 border-sky-500 w-48 relative text-center">
                <img src={node.avatarUrl} alt={node.name} className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-slate-200 dark:border-slate-600" />
                <p className="font-bold text-slate-800 dark:text-slate-100">{node.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{node.title}</p>
                {hasChildren && (
                    <button
                        onClick={() => onToggle(node.id)}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-400 dark:bg-slate-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-slate-500 dark:hover:bg-slate-400 transition-colors"
                        aria-label={`Toggle children for ${node.name}`}
                    >
                        {isCollapsed ? '+' : '-'}
                    </button>
                )}
            </div>
            {hasChildren && !isCollapsed && (
                <ul>
                    {node.children.map(child => (
                        <OrgChartNode key={child.id} node={child} onToggle={onToggle} collapsedNodes={collapsedNodes} />
                    ))}
                </ul>
            )}
        </li>
    );
};

const OrgChartPage: React.FC = () => {
    const { employees } = useUserContext();
    const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
    const [zoom, setZoom] = useState(1);
    const { t } = useTranslation();

    const tree = useMemo((): OrgTreeNode[] => {
        const orgEmployees = employees.filter(e => e.isEmployee);
        const nodes: { [id: string]: OrgTreeNode } = {};
        const orgEmployeeIds = new Set(orgEmployees.map(e => e.id));

        orgEmployees.forEach(emp => {
            nodes[emp.id] = { ...emp, children: [] };
        });

        const roots: OrgTreeNode[] = [];
        orgEmployees.forEach(emp => {
            if (emp.managerId && orgEmployeeIds.has(emp.managerId)) {
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

    const css = `
        .org-chart {
            display: inline-block;
            min-width: 100%;
        }
        .org-chart ul {
            padding-top: 20px;
            position: relative;
            transition: all 0.5s;
        }
        .org-chart li {
            float: right; /* RTL support */
            text-align: center;
            list-style-type: none;
            position: relative;
            padding: 20px 5px 0 5px;
            transition: all 0.5s;
        }
        /* Connector lines */
        .org-chart li::before, .org-chart li::after {
            content: '';
            position: absolute;
            top: 0;
            left: 50%; /* RTL support */
            border-top: 2px solid #e2e8f0; /* slate-200 */
            width: 50%;
            height: 20px;
        }
        .dark .org-chart li::before, .dark .org-chart li::after {
             border-top: 2px solid #475569; /* slate-600 */
        }
        .org-chart li::after {
            left: auto;
            right: 50%; /* RTL support */
            border-right: 2px solid #e2e8f0; /* slate-200 */
        }
        .dark .org-chart li::after {
             border-right: 2px solid #475569; /* slate-600 */
        }
        .org-chart li:only-child::after, .org-chart li:only-child::before {
            display: none;
        }
        .org-chart li:only-child {
            padding-top: 0;
        }
        .org-chart li:first-child::before, .org-chart li:last-child::after {
            border: 0 none;
        }
        .org-chart li:last-child::before {
            border-left: 2px solid #e2e8f0; /* slate-200 */
            border-radius: 5px 0 0 0;
        }
        .dark .org-chart li:last-child::before {
             border-left: 2px solid #475569; /* slate-600 */
        }
        .org-chart li:first-child::after {
            border-radius: 0 5px 0 0;
        }
        .org-chart ul ul::before {
            content: '';
            position: absolute;
            top: 0;
            right: 50%; /* RTL support */
            border-right: 2px solid #e2e8f0; /* slate-200 */
            width: 0;
            height: 20px;
        }
        .dark .org-chart ul ul::before {
            border-right: 2px solid #475569; /* slate-600 */
        }
        .oc-node-content {
            margin: 0 auto;
        }
    `;

    return (
        <div className="bg-slate-100 dark:bg-slate-900 h-full rounded-xl shadow-md flex flex-col overflow-hidden relative">
            <style>{css}</style>
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="w-8 h-8 bg-white dark:bg-slate-700 rounded-md shadow flex items-center justify-center font-bold text-lg">-</button>
                <span className="bg-white dark:bg-slate-700 px-3 py-1 rounded-md shadow text-sm font-semibold">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-8 h-8 bg-white dark:bg-slate-700 rounded-md shadow flex items-center justify-center font-bold text-lg">+</button>
            </div>
            <div className="flex-1 overflow-auto p-8 text-center">
                 <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-300">
                    <div className="org-chart">
                         <ul>
                            {tree.map(rootNode => (
                                <OrgChartNode 
                                    key={rootNode.id} 
                                    node={rootNode} 
                                    onToggle={handleToggleCollapse} 
                                    collapsedNodes={collapsedNodes}
                                />
                            ))}
                        </ul>
                    </div>
                     {tree.length === 0 && (
                        <p className="text-slate-500 dark:text-slate-400 p-8">{t('orgChart.noData')}</p>
                     )}
                 </div>
            </div>
        </div>
    );
};

export default OrgChartPage;