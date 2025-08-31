import React, { useState, useMemo, useEffect } from 'react';
import type { TeamMemberDetails, EmployeeProfile, Branch, PerformanceReview, HRRequest, RequestType, RequestStatus, EmployeeInfraction, AttendancePolicy, LeavePolicy, JobTitle, Course, EmployeeCourse, MonthlyCheckIn, OvertimePolicy, NewUserPayload, AppModule, ExternalTask, TeamMemberStats, SalaryComponent, CompensationPackage, DocumentType, EmployeeDocument, AttendanceEvent } from '../types';
import { UserCircleIcon, CalendarIcon, BriefcaseIcon, AcademicCapIcon, CheckCircleIcon, PresentationChartLineIcon, PencilSquareIcon, ClipboardDocumentListIcon, PlusCircleIcon, DocumentCheckIcon, ExclamationTriangleIcon, BookOpenIcon, CheckBadgeIcon, XCircleIcon, DocumentTextIcon, ClockIcon, BanknotesIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, PencilIcon, TrashIcon, MapPinIcon } from './icons/Icons';
import { LEAVE_TYPE_TRANSLATION } from '../constants';

type DetailTab = 'general' | 'history' | 'attendance_type' | 'grace_minutes' | 'work_calendar' | 'leave_profile' | 'salary' | 'documents' | 'petty_cash' | 'assets';

const NavItem: React.FC<{ label: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, isActive: boolean, onClick: () => void }> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-colors ${
            isActive ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
        <Icon className="w-5 h-5"/>
        <span>{label}</span>
    </button>
);

const StatInfoCard: React.FC<{ title: string, value: string | number, subtext: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, color: string }> = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm border flex items-center gap-3">
        <Icon className={`w-6 h-6 ${color}`}/>
        <div>
            <p className="text-xs text-slate-500">{title}</p>
            <p className="font-bold text-slate-800">{value} <span className="text-xs font-normal">{subtext}</span></p>
        </div>
    </div>
);

const REQUEST_TYPE_INFO: Record<RequestType, { translation: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }> = {
    Leave: { translation: 'طلب إجازة', icon: BriefcaseIcon, color: 'text-sky-500' },
    Certificate: { translation: 'طلب شهادة', icon: DocumentTextIcon, color: 'text-emerald-500' },
    DataUpdate: { translation: 'تحديث بيانات', icon: UserCircleIcon, color: 'text-amber-500' },
    AttendanceAdjustment: { translation: 'تعديل حضور', icon: ClockIcon, color: 'text-purple-500' },
    LeavePermit: { translation: 'إذن انصراف', icon: ClockIcon, color: 'text-indigo-500' },
};

const STATUS_BADGE: Record<RequestStatus, string> = { Approved: 'bg-emerald-100 text-emerald-800', Pending: 'bg-amber-100 text-amber-800', Rejected: 'bg-red-100 text-red-800' };
const STATUS_TRANSLATION: Record<RequestStatus, string> = { Approved: 'موافق عليه', Pending: 'قيد الانتظار', Rejected: 'مرفوض' };


interface TeamMemberDetailViewProps {
    memberDetails: TeamMemberDetails;
    currentUser: EmployeeProfile;
    salaryComponents: SalaryComponent[];
    compensationPackages: CompensationPackage[];
    onSaveDocument: (document: EmployeeDocument) => void;
}

const TeamMemberDetailView: React.FC<TeamMemberDetailViewProps> = ({ memberDetails, currentUser, salaryComponents, compensationPackages, onSaveDocument }) => {
    const [activeTab, setActiveTab] = useState<DetailTab>('general');
    const { profile, stats, dailyPunches } = memberDetails;

    // State for salary tab editing
    const [editedBaseSalary, setEditedBaseSalary] = useState(profile.baseSalary || 0);
    const [editedPackageId, setEditedPackageId] = useState(profile.compensationPackageId || '');
    
    // State for document tab
    const [newDocName, setNewDocName] = useState('');
    const [newDocType, setNewDocType] = useState<DocumentType>('عقد عمل');
    const [newDocExpiry, setNewDocExpiry] = useState('');
    const [newDocFile, setNewDocFile] = useState<File | null>(null);

    // Reset states when member changes
    useEffect(() => {
        setEditedBaseSalary(profile.baseSalary || 0);
        setEditedPackageId(profile.compensationPackageId || '');
        setNewDocName('');
        setNewDocType('عقد عمل');
        setNewDocExpiry('');
        setNewDocFile(null);
    }, [profile]);
    
    const allRequests = useMemo(() => {
        const combined = [...memberDetails.leave, ...memberDetails.infractions.map(i => ({...i, type: 'DataUpdate', details: i.details, id: Math.random()}))]
        const all: HRRequest[] = memberDetails.leave.map(r => r); 
        return all.sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [memberDetails]);

    const attendancePairs = useMemo(() => {
        if (!dailyPunches) return [];
        return dailyPunches.reduce((acc, event, index, array) => {
            if (event.type === 'CheckIn') {
                const checkOutEvent = array.find((e, i) => i > index && e.type === 'CheckOut' && !acc.flat().includes(e));
                acc.push([event, checkOutEvent]);
            }
            return acc;
        }, [] as [AttendanceEvent, AttendanceEvent | undefined][]);
    }, [dailyPunches]);

    const handleSaveNewDocument = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDocName || !newDocFile) {
            alert("يرجى إدخال اسم المستند وإرفاق الملف.");
            return;
        }
        const newDocument: EmployeeDocument = {
            id: `doc-${Date.now()}`,
            employeeId: profile.id,
            name: newDocName,
            type: newDocType,
            uploadDate: new Date().toISOString().split('T')[0],
            expirationDate: newDocExpiry || null,
            fileUrl: newDocFile.name, // Placeholder for actual upload
        };
        onSaveDocument(newDocument);
        // Reset form
        setNewDocName('');
        setNewDocFile(null);
        setNewDocExpiry('');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-lg text-slate-700">الطلبات</h3>
                             <div className="flex items-center gap-2">
                                 <select className="p-2 border rounded-lg text-sm bg-white"><option>Approved</option></select>
                                 <input type="date" className="p-2 border rounded-lg text-sm bg-white" />
                                 <input type="date" className="p-2 border rounded-lg text-sm bg-white" />
                             </div>
                        </div>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">النوع</th>
                                        <th className="px-6 py-3">تاريخ الطلب</th>
                                        <th className="px-6 py-3">الحالة</th>
                                        <th className="px-6 py-3">تعليقات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allRequests.map(req => {
                                        const typeInfo = REQUEST_TYPE_INFO[req.type];
                                        return (
                                            <tr key={req.id} className="bg-white border-b hover:bg-slate-50">
                                                <td className="px-6 py-4 font-semibold text-slate-800">{typeInfo.translation}</td>
                                                <td className="px-6 py-4">{new Date(req.submissionDate).toLocaleDateString('ar-EG-u-nu-latn')}</td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[req.status]}`}>{STATUS_TRANSLATION[req.status]}</span></td>
                                                <td className="px-6 py-4">{'reason' in req ? req.reason : ''}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                         </div>
                    </div>
                );
            case 'salary':
                const selectedPackage = compensationPackages.find(p => p.id === editedPackageId);
                return (
                    <div className="p-6 space-y-6">
                        <div className="p-4 bg-white rounded-lg shadow-sm border">
                            <h3 className="font-bold text-slate-700 mb-4">الراتب الأساسي والحزمة</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">الراتب الأساسي (EGP)</label>
                                    <input type="number" value={editedBaseSalary} onChange={(e) => setEditedBaseSalary(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">حزمة التعويضات</label>
                                     <select value={editedPackageId} onChange={(e) => setEditedPackageId(e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50">
                                        <option value="">-- بدون حزمة --</option>
                                        {compensationPackages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                                    </select>
                                </div>
                             </div>
                             <div className="flex justify-end mt-4">
                                <button className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-emerald-700">حفظ التعديلات</button>
                             </div>
                        </div>
                         {selectedPackage && (
                            <div className="p-4 bg-white rounded-lg shadow-sm border">
                                <h3 className="font-bold text-slate-700 mb-2">تفاصيل الحزمة: {selectedPackage.name}</h3>
                                <div className="space-y-2">
                                    {selectedPackage.components.map(comp => {
                                        const details = salaryComponents.find(sc => sc.id === comp.componentId);
                                        if (!details) return null;
                                        return (
                                            <div key={comp.componentId} className={`p-2 rounded-md flex justify-between items-center text-sm ${details.type === 'Allowance' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                                                <span>{details.name}</span>
                                                <span className="font-semibold">{details.calculationType === 'FixedAmount' ? `${comp.value} EGP` : `${comp.value}%`}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'documents':
                 const employeeDocs = memberDetails.documents;
                 return (
                    <div className="p-6 space-y-6">
                        <div className="p-4 bg-white rounded-lg shadow-sm border">
                            <h3 className="font-bold text-slate-700 mb-4">مستندات الموظف</h3>
                             <table className="w-full text-sm text-right">
                                <thead className="text-xs text-slate-500 bg-slate-100">
                                    <tr><th className="p-2">الاسم</th><th className="p-2">النوع</th><th className="p-2">تاريخ الرفع</th><th className="p-2">الإجراء</th></tr>
                                </thead>
                                <tbody>
                                    {employeeDocs.map(doc => (
                                        <tr key={doc.id} className="border-b">
                                            <td className="p-2 font-semibold">{doc.name}</td>
                                            <td className="p-2">{doc.type}</td>
                                            <td className="p-2">{doc.uploadDate}</td>
                                            <td className="p-2"><button className="text-sky-600"><ArrowDownTrayIcon className="w-5 h-5"/></button></td>
                                        </tr>
                                    ))}
                                    {employeeDocs.length === 0 && <tr><td colSpan={4} className="text-center p-4 text-slate-500">لا توجد مستندات.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border">
                             <h3 className="font-bold text-slate-700 mb-4">إضافة مستند جديد</h3>
                             <form onSubmit={handleSaveNewDocument} className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input type="text" placeholder="اسم المستند" value={newDocName} onChange={e => setNewDocName(e.target.value)} className="w-full p-2 border rounded-lg" required />
                                    <select value={newDocType} onChange={e => setNewDocType(e.target.value as DocumentType)} className="w-full p-2 border rounded-lg bg-slate-50">
                                        <option value="عقد عمل">عقد عمل</option>
                                        <option value="مسوغات تعيين">مسوغات تعيين</option>
                                    </select>
                                </div>
                                <div>
                                     <label className="cursor-pointer bg-slate-50 border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center text-slate-500 hover:border-sky-500">
                                        <ArrowUpTrayIcon className="w-6 h-6 mb-1"/>
                                        <span className="text-xs">{newDocFile ? newDocFile.name : 'اختر ملف'}</span>
                                        <input type="file" className="hidden" onChange={(e) => setNewDocFile(e.target.files ? e.target.files[0] : null)} required/>
                                    </label>
                                </div>
                                <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-emerald-700">إضافة وحفظ</button>
                             </form>
                        </div>
                    </div>
                 );
            default:
                return <div className="p-6 text-center text-slate-500">محتوى "{activeTab}" غير متاح بعد.</div>;
        }
    };

    const navItems: {id: DetailTab, label: string, icon: React.FC<React.SVGProps<SVGSVGElement>>}[] = [
        { id: 'general', label: 'General', icon: DocumentTextIcon },
        { id: 'history', label: 'History', icon: ClockIcon },
        { id: 'attendance_type', label: 'Attendance type', icon: CalendarIcon },
        { id: 'grace_minutes', label: 'Grace minutes', icon: ClockIcon },
        { id: 'work_calendar', label: 'Work calendar', icon: CalendarIcon },
        { id: 'leave_profile', label: 'Leave & break profile', icon: BriefcaseIcon },
        { id: 'salary', label: 'Salary configuration', icon: BanknotesIcon },
        { id: 'documents', label: 'Documents', icon: DocumentCheckIcon },
        { id: 'petty_cash', label: 'Petty cash', icon: BanknotesIcon },
        { id: 'assets', label: 'Assets', icon: BriefcaseIcon },
    ];

    return (
        <div className="bg-white h-full rounded-xl shadow-md flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-full" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
                            <p className="text-md text-slate-500">{profile.title} • {profile.department}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <button className="bg-slate-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-900">+ New request</button>
                        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-200"><PencilIcon className="w-5 h-5" /></button>
                        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-200"><TrashIcon className="w-5 h-5" /></button>
                        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-200"><DocumentTextIcon className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attendancePairs.slice(0, 2).map(([checkIn, checkOut], index) => {
                         const checkInTime = new Date(checkIn.timestamp);
                         const checkOutTime = checkOut ? new Date(checkOut.timestamp) : null;
                        return (
                            <div key={checkIn.id} className="p-3 bg-white border rounded-lg">
                                <p className="text-xs font-bold text-slate-600 mb-1">{index === 0 ? '1st Sign in / Sign out' : '2nd Sign in / Sign out'}</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-semibold text-slate-800">{checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second:'2-digit' })}</span>
                                    <span className="text-slate-400">→</span>
                                     <span className="font-mono font-semibold text-slate-800">{checkOutTime ? checkOutTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second:'2-digit' }) : '--:--:--'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                    <MapPinIcon className="w-3 h-3"/>
                                    <span>{checkIn.isWithinGeofence ? 'Office' : 'Remote'}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
                    <StatInfoCard title="Used Permission" value={stats.usedPermissionHours.toFixed(1)} subtext="/ 4 Hours" icon={ClockIcon} color="text-sky-500"/>
                    <StatInfoCard title="Used Annual Leaves" value={stats.usedAnnualLeavesDays} subtext="/ 21 Days" icon={CalendarIcon} color="text-emerald-500"/>
                    <StatInfoCard title="Used Remote days" value={stats.usedRemoteDays} subtext="/ 12 Days" icon={BriefcaseIcon} color="text-purple-500"/>
                    <StatInfoCard title="Emergency" value={stats.emergencyDays} subtext="/ 3 Days" icon={ExclamationTriangleIcon} color="text-orange-500"/>
                    <StatInfoCard title="Used Grace Minutes" value={stats.usedGraceMinutes} subtext="/ 60 Mins" icon={ClockIcon} color="text-yellow-500"/>
                    <StatInfoCard title="Absent" value={stats.absentDays} subtext="/ 2 Days" icon={XCircleIcon} color="text-red-500"/>
                    <StatInfoCard title="Placeholder" value={0} subtext="" icon={DocumentTextIcon} color="text-slate-500"/>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex min-h-0">
                <aside className="w-56 border-l p-2 bg-slate-50">
                    <nav className="space-y-1">
                        {navItems.map(item => (
                            <NavItem
                                key={item.id}
                                label={item.label}
                                icon={item.icon}
                                isActive={activeTab === item.id}
                                onClick={() => setActiveTab(item.id)}
                            />
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 overflow-y-auto bg-slate-100">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default TeamMemberDetailView;