import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt } from 'react-icons/fa';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  
  // Sample metrics data
  const metrics = [
    { id: 1, name: 'Page Views', value: '32,451', change: '+12.3%', trend: 'up' },
    { id: 2, name: 'Unique Visitors', value: '8,512', change: '+8.7%', trend: 'up' },
    { id: 3, name: 'Bounce Rate', value: '28.4%', change: '-2.1%', trend: 'down' },
    { id: 4, name: 'Avg. Session Duration', value: '3m 42s', change: '+0.8%', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Analytics Dashboard</h1>
        
        <div className="inline-flex items-center rounded-lg bg-white p-1 shadow">
          <button
            onClick={() => setTimeRange('week')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              timeRange === 'week' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              timeRange === 'month' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              timeRange === 'year' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl bg-white p-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-600">{metric.name}</h2>
              {metric.id === 1 ? <FaChartLine className="text-blue-500" /> :
               metric.id === 2 ? <FaChartBar className="text-green-500" /> :
               metric.id === 3 ? <FaChartPie className="text-red-500" /> :
               <FaCalendarAlt className="text-purple-500" />}
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              <span className={`ml-2 text-sm font-medium ${
                metric.trend === 'up' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Traffic Overview</h2>
          <div className="h-80 w-full bg-gray-100 p-4">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <FaChartLine className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Traffic chart visualization will appear here</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Source Breakdown</h2>
          <div className="h-80 w-full bg-gray-100 p-4">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <FaChartPie className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Source breakdown chart will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Top Pages</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Page
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Views
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Unique Visitors
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Bounce Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  /home
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  12,543
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  8,721
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  24.3%
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  /products
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  8,376
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  5,129
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  18.7%
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  /about
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  4,291
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  3,875
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  32.1%
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  /contact
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  3,827
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  2,943
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  15.9%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}