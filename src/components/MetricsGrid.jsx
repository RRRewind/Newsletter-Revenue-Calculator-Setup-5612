import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {motion} from 'framer-motion';

const {FiUsers, FiEye, FiDollarSign, FiTrendingUp, FiUserMinus, FiCreditCard, FiRefreshCw} = FiIcons;

const MetricsGrid = ({currentMetrics, finalMetrics}) => {
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

  const metrics = [
    {
      icon: FiUsers,
      title: 'Subscribers',
      current: formatNumber(currentMetrics.subscribers),
      projected: formatNumber(finalMetrics.subscribers),
      growth: ((finalMetrics.subscribers - currentMetrics.subscribers) / currentMetrics.subscribers * 100).toFixed(1),
      color: 'blue'
    },
    {
      icon: FiUserMinus,
      title: 'Monthly Churn',
      current: formatNumber(currentMetrics.monthlyUnsubscribes),
      projected: formatNumber(finalMetrics.monthlyUnsubscribes),
      replenishCost: formatCurrency(finalMetrics.replenishmentCost),
      color: 'red'
    },
    {
      icon: FiDollarSign,
      title: 'Monthly Display Earnings',
      current: formatCurrency(currentMetrics.monthlyDisplayEarnings),
      projected: formatCurrency(finalMetrics.monthlyDisplayEarnings),
      growth: currentMetrics.monthlyDisplayEarnings > 0 
        ? ((finalMetrics.monthlyDisplayEarnings - currentMetrics.monthlyDisplayEarnings) / Math.abs(currentMetrics.monthlyDisplayEarnings) * 100).toFixed(1) 
        : 'N/A',
      color: 'green'
    },
    {
      icon: FiRefreshCw,
      title: 'Net Available Earnings',
      current: formatCurrency(currentMetrics.netAvailableEarnings || 0),
      projected: formatCurrency(finalMetrics.netAvailableEarnings || 0),
      growth: currentMetrics.netAvailableEarnings > 0 
        ? ((finalMetrics.netAvailableEarnings - currentMetrics.netAvailableEarnings) / Math.abs(currentMetrics.netAvailableEarnings) * 100).toFixed(1) 
        : 'N/A',
      color: 'emerald'
    },
    {
      icon: FiCreditCard,
      title: 'Total Monthly Ad Spend',
      current: formatCurrency(currentMetrics.totalAdSpend),
      projected: formatCurrency(finalMetrics.totalAdSpend),
      personalAmount: formatCurrency(currentMetrics.personalAdSpend),
      growth: ((finalMetrics.totalAdSpend - currentMetrics.totalAdSpend) / currentMetrics.totalAdSpend * 100).toFixed(1),
      color: 'purple'
    },
    {
      icon: FiEye,
      title: 'Daily Pageviews',
      current: formatNumber(currentMetrics.dailyPageviews),
      projected: formatNumber(finalMetrics.dailyPageviews),
      growth: ((finalMetrics.dailyPageviews - currentMetrics.dailyPageviews) / currentMetrics.dailyPageviews * 100).toFixed(1),
      color: 'teal'
    }
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
    red: 'from-red-500 to-red-600 text-red-600 bg-red-50',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
    green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50',
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50',
    amber: 'from-amber-500 to-amber-600 text-amber-600 bg-amber-50',
    teal: 'from-teal-500 to-teal-600 text-teal-600 bg-teal-50'
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: index * 0.1}}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${colorClasses[metric.color].split(' ').slice(-2).join(' ')}`}>
              <SafeIcon
                icon={metric.icon}
                className={`text-xl ${colorClasses[metric.color].split(' ')[3]}`}
              />
            </div>
            {metric.growth && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Growth</div>
                <div className={`text-lg font-semibold ${colorClasses[metric.color].split(' ')[3]}`}>
                  {metric.growth !== 'N/A' ? `+${metric.growth}%` : 'N/A'}
                </div>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.title}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current:</span>
              <span className="font-medium text-gray-900">{metric.current}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Projected:</span>
              <span className={`font-bold ${colorClasses[metric.color].split(' ')[3]}`}>{metric.projected}</span>
            </div>
            {metric.replenishCost && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Replenishment Cost:</span>
                <span className="font-bold text-red-600">{metric.replenishCost}</span>
              </div>
            )}
            {metric.personalAmount && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Initial Investment:</span>
                <span className="font-bold text-blue-600">{metric.personalAmount}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MetricsGrid;