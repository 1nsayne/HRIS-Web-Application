import { FileText, Download, Upload, Folder, File } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

interface DocumentsProps {
  role?: 'admin' | 'employee' | 'exec';
  documents?: any[];
}

const fallbackDocuments = [
  { id: 1, name: 'Employee Handbook 2026', type: 'Policy', size: '2.4 MB', uploadedBy: 'Jane Doe', date: '2026-01-15', category: 'company' },
  { id: 2, name: 'Code of Conduct', type: 'Policy', size: '856 KB', uploadedBy: 'Jane Doe', date: '2026-01-15', category: 'company' },
  { id: 3, name: 'Benefits Guide', type: 'Benefits', size: '1.8 MB', uploadedBy: 'Maria Garcia', date: '2026-02-01', category: 'hr' },
  { id: 4, name: 'Remote Work Policy', type: 'Policy', size: '645 KB', uploadedBy: 'Jane Doe', date: '2026-03-10', category: 'company' },
  { id: 5, name: 'Performance Review Template', type: 'Template', size: '324 KB', uploadedBy: 'Maria Garcia', date: '2026-04-05', category: 'hr' },
  { id: 6, name: 'Safety Guidelines', type: 'Compliance', size: '1.2 MB', uploadedBy: 'Jane Doe', date: '2026-01-20', category: 'compliance' },
  { id: 7, name: 'Data Privacy Policy', type: 'Compliance', size: '987 KB', uploadedBy: 'Jane Doe', date: '2026-01-25', category: 'compliance' },
  { id: 8, name: 'Onboarding Checklist', type: 'Template', size: '456 KB', uploadedBy: 'Maria Garcia', date: '2026-02-15', category: 'hr' },
];

export function Documents({ role = 'admin', documents = fallbackDocuments }: DocumentsProps) {
  const isEmployee = role === 'employee';
  const canManageDocuments = role === 'admin';

  const categories = [
    { name: 'Company Policies', count: 12, icon: Folder, color: 'bg-blue-100 text-blue-700' },
    { name: 'HR Documents', count: 18, icon: Folder, color: 'bg-purple-100 text-purple-700' },
    { name: 'Compliance', count: 8, icon: Folder, color: 'bg-green-100 text-green-700' },
    { name: 'Templates', count: 15, icon: Folder, color: 'bg-amber-100 text-amber-700' },
  ];

  const visibleDocuments = isEmployee
    ? documents.filter((doc) => ['company', 'compliance'].includes(doc.category) || doc.type === 'Benefits')
    : documents;

  const visibleCategories = isEmployee
    ? categories.filter((category) => ['Company Policies', 'Compliance'].includes(category.name))
    : categories;

  const recentActivity = [
    { action: 'uploaded', document: 'Employee Handbook 2026', user: 'Jane Doe', time: '2 hours ago' },
    { action: 'downloaded', document: 'Benefits Guide', user: 'Michael Chen', time: '5 hours ago' },
    { action: 'uploaded', document: 'Remote Work Policy', user: 'Jane Doe', time: '1 day ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{isEmployee ? 'Company Documents' : 'Documents & Compliance'}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {canManageDocuments
              ? 'Manage company documents, policies, and compliance files'
              : 'View policies, compliance files, and employee resources'}
          </p>
        </div>
        {canManageDocuments && (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {visibleCategories.map((category, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-5 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                <category.icon className="w-5 h-5" />
              </div>
            </div>
            <h4 className="mb-1">{category.name}</h4>
            <p className="text-sm text-muted-foreground">{category.count} files</p>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 gap-6 ${canManageDocuments ? 'lg:grid-cols-3' : ''}`}>
        <div className={`${canManageDocuments ? 'lg:col-span-2' : ''} bg-card border border-border rounded-lg overflow-hidden`}>
          <div className="p-5 border-b border-border">
            <h3>{canManageDocuments ? 'All Documents' : 'Available Documents'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Size</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Uploaded By</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-primary" />
                        <p className="text-sm">{doc.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={doc.type} variant="info" />
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{doc.size}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{doc.uploadedBy}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{doc.date}</td>
                    <td className="py-3 px-4">
                      <button className="p-1.5 hover:bg-muted rounded transition-colors">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {canManageDocuments && (
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3>Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span>{activity.document}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="mb-3">Storage Usage</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">32.4 GB used of 100 GB</span>
                  <span>32%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '32%' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
