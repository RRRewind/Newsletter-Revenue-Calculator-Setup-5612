import React, {useState} from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {motion} from 'framer-motion';

const {FiChevronDown, FiChevronUp} = FiIcons;

const ProjectionTable = ({data}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayData = isExpanded ? data : data.slice(0, 6);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const getProfitColor = (profit) => {
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Projections</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Unsubscribes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Replenishment Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Pageviews</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Earnings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Available</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Investment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reinvested Earnings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ad Spend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((row, index) => (
              <motion.tr
                key={row.month}
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: index * 0.05}}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.month === 0 ? 'Current' : row.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(row.subscribers)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                  {formatNumber(row.monthlyUnsubscribes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                  {formatCurrency(row.replenishmentCost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(row.dailyPageviews)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {formatCurrency(row.monthlyDisplayEarnings)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                  {formatCurrency(row.netAvailableEarnings)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  {formatCurrency(row.personalAdSpend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-medium">
                  {formatCurrency(row.reinvestedEarnings)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-bold">
                  {formatCurrency(row.totalAdSpend)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 6 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <SafeIcon icon={FiChevronUp} />
                Show Less
              </>
            ) : (
              <>
                <SafeIcon icon={FiChevronDown} />
                Show All {data.length} Months
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectionTable;