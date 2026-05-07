import { Download, Upload } from 'lucide-react';
import { Review } from '../data/mockReviews';
import { useRef, useState } from 'react';
import { microcopy } from '../utils/microcopy';

interface ImportExportProps {
  reviews: Review[];
}

export function ImportExport({ reviews }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Customer Name', 'Rating', 'Date', 'Review', 'Sentiment', 'Source', 'Keywords'];
      const csvData = reviews.map(review => [
        review.customerName,
        review.rating,
        review.date,
        `"${review.text.replace(/"/g, '""')}"`,
        review.sentiment,
        review.source,
        `"${review.keywords.join(', ')}"`,
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reviews_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('success', microcopy.success.dataExported);
    } catch (error) {
      showNotification('error', microcopy.errors.exportFailed);
    }
  };

  const handleExportJSON = () => {
    try {
      const jsonContent = JSON.stringify(reviews, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reviews_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('success', microcopy.success.dataExported);
    } catch (error) {
      showNotification('error', microcopy.errors.exportFailed);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      showNotification('error', microcopy.errors.noFileSelected);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const imported = JSON.parse(content);
          console.log('Imported JSON data:', imported);
          showNotification('success', `${microcopy.success.dataImported} (${imported.length} reviews)`);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim().replace(/^"|"$/g, '');
              return obj;
            }, {} as any);
          });
          console.log('Imported CSV data:', data);
          showNotification('success', `${microcopy.success.dataImported} (${data.length} reviews)`);
        } else {
          showNotification('error', microcopy.errors.invalidFileFormat);
        }
        
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error importing file:', error);
        showNotification('error', microcopy.errors.importFailed);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative">
      {notification && (
        <div className={`absolute top-full right-0 mt-2 px-4 py-2 rounded-lg shadow-lg z-20 whitespace-nowrap ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm font-medium ${
            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {notification.message}
          </p>
        </div>
      )}
      
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          onChange={handleImport}
          className="hidden"
          id="import-file"
        />
        
        <label
          htmlFor="import-file"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          title={microcopy.helpers.importHelp}
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">Import</span>
        </label>

        <div className="relative group">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title={microcopy.helpers.exportHelp}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <button
              onClick={handleExportCSV}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
            >
              Export as CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
            >
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}