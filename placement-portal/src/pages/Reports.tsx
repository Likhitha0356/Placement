import React, { useState } from 'react';
import { FileDown, Filter, Calendar, CheckCircle } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  status: 'Completed' | 'Processing' | 'Failed';
  downloadUrl?: string;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('department');
  const [department, setDepartment] = useState('all');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Department Placement Report',
      type: 'Department-wise',
      generatedDate: '2024-03-10',
      status: 'Completed',
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'Section A Performance',
      type: 'Section-wise',
      generatedDate: '2024-03-09',
      status: 'Completed',
      downloadUrl: '#'
    }
  ]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        name: `${reportType}_${department}_${new Date().toISOString().split('T')[0]}.${format}`,
        type: reportType,
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'Completed',
        downloadUrl: '#'
      };
      
      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      
      // Trigger download
      downloadReport(newReport);
    }, 2000);
  };

  const getReportRows = (typeKey?: string): { headers: string[]; rows: string[][] } => {
    const key = typeKey || reportType;
    const norm = (t: string) => (t || '').toLowerCase().replace(/-wise|summary|student/g, '').trim() || t;
    const k = norm(key);
    if (k.includes('department')) {
      return {
        headers: ['Department', 'Total Students', 'Placed Students', 'Placement Rate'],
        rows: [
          ['CSE', '45', '38', '84.4%'],
          ['ECE', '40', '28', '70.0%'],
          ['EEE', '35', '20', '57.1%'],
          ['MECH', '30', '18', '60.0%'],
          ['CIVIL', '25', '12', '48.0%']
        ]
      };
    }
    if (k.includes('section')) {
      return {
        headers: ['Section', 'Total Students', 'Average Score', 'Placement Rate'],
        rows: [
          ['CSE-A', '25', '78.5', '88.0%'],
          ['CSE-B', '20', '72.3', '80.0%'],
          ['ECE-A', '20', '68.7', '75.0%'],
          ['ECE-B', '20', '65.2', '65.0%']
        ]
      };
    }
    if (k.includes('individual')) {
      return {
        headers: ['Roll Number', 'Name', 'Department', 'Section', 'Placement Readiness', 'Probability'],
        rows: [
          ['21CS001', 'Alice Johnson', 'CSE', 'A', 'High', '85%'],
          ['21CS002', 'Bob Smith', 'CSE', 'B', 'Medium', '65%']
        ]
      };
    }
    return {
      headers: ['Metric', 'Value'],
      rows: [
        ['Total Students', '175'],
        ['Placed Students', '126'],
        ['Placement Rate', '72%'],
        ['Average Package', '6.5 LPA']
      ]
    };
  };

  const downloadReport = (report: Report) => {
    const { headers, rows } = getReportRows(report.type);
    const format = report.name.split('.').pop() || 'csv';

    if (format === 'pdf') {
      const title = `Placement Report - ${report.type} (${report.generatedDate})`;
      const tableRows = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><title>${title}</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; color: #1f2937; }
  h1 { font-size: 1.5rem; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
  th { background: #f3f4f6; font-weight: 600; }
  .meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 16px; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Generated on ${report.generatedDate} • Placement Portal</p>
  <table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(html);
        win.document.close();
      }
      return;
    }

    const csvLine = (arr: string[]) => arr.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',');
    const csvContent = [csvLine(headers), ...rows.map(r => csvLine(r))].join('\n');
    const filename = report.name.replace(/\.(pdf|excel)$/i, '.csv');

    if (format === 'excel' || format === 'csv') {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Processing': return 'text-yellow-600 bg-yellow-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>;
      case 'Failed': return <div className="w-4 h-4 bg-red-600 rounded-full"></div>;
      default: return <div className="w-4 h-4 bg-gray-600 rounded-full"></div>;
    }
  };

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Reports</h1>
      
      {/* Generate Report Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Filter className="w-6 h-6 mr-2 text-primary-600" />
          Generate Reports
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="department">Department-wise</option>
              <option value="section">Section-wise</option>
              <option value="individual">Individual Student</option>
              <option value="placement">Placement Summary</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="EEE">Electrical</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-6 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5 mr-2" />
              Generate & Download Report
            </>
          )}
        </button>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-primary-600" />
          Recent Reports
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {report.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {report.generatedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {report.status === 'Completed' && (
                      <button
                        onClick={() => downloadReport(report)}
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <FileDown className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
