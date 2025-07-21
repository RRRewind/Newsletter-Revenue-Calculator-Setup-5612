import React, {useState, useMemo} from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import {motion} from 'framer-motion';
import ProfitChart from './components/ProfitChart';
import MetricsGrid from './components/MetricsGrid';
import ProjectionTable from './components/ProjectionTable';
import './App.css';

const {FiTrendingUp, FiDollarSign, FiUsers, FiEye, FiCalendar, FiBarChart3} = FiIcons;

function App() {
  const [inputs, setInputs] = useState({
    adConversionCost: 5,
    currentSubscribers: 500,
    dailyPageviews: 1000,
    displayAdRPM: 2.50,
    dailyUnsubscribeRate: 0.1,
    personalAdSpend: 1000,
    projectionMonths: 12
  });

  const calculations = useMemo(() => {
    const results = [];
    let subscribers = inputs.currentSubscribers;
    let dailyPageviews = inputs.dailyPageviews;
    let personalAdSpend = inputs.personalAdSpend;

    // Initial personal ad spend
    let reinvestedEarnings = 0; // Start with zero reinvested earnings

    // Calculate initial pageviews per subscriber ratio
    const initialPageviewsPerSubscriber = dailyPageviews / subscribers;

    // Initial calculations for current state (month 0)
    const dailyChurnRate = inputs.dailyUnsubscribeRate / 100;
    const monthlyRetentionRate = Math.pow(1 - dailyChurnRate, 30);
    const monthlyUnsubscribes = Math.round(subscribers * (1 - monthlyRetentionRate));
    const replenishmentCost = monthlyUnsubscribes * inputs.adConversionCost;

    // Calculate display ad earnings based on RPM
    const dailyDisplayEarnings = (dailyPageviews / 1000) * inputs.displayAdRPM;
    const monthlyDisplayEarnings = dailyDisplayEarnings * 30;

    // Store current month's data (month 0)
    results.push({
      month: 0,
      subscribers: Math.round(subscribers),
      monthlyUnsubscribes,
      replenishmentCost,
      dailyPageviews: Math.round(dailyPageviews),
      monthlyDisplayEarnings,
      personalAdSpend,
      reinvestedEarnings: 0, // No reinvested earnings in month 0
      netAvailableEarnings: Math.max(0, monthlyDisplayEarnings - replenishmentCost), // New field
      totalAdSpend: personalAdSpend, // Only personal ad spend in month 0
      monthlyProfit: 0,
      cumulativeProfit: 0
    });

    // Calculate projections for future months
    for (let month = 1; month <= inputs.projectionMonths; month++) {
      // Get previous month's data
      const prevMonth = results[month - 1];

      // Calculate churn
      const dailyChurnRate = inputs.dailyUnsubscribeRate / 100;
      const monthlyRetentionRate = Math.pow(1 - dailyChurnRate, 30);

      // Calculate remaining subscribers after churn
      const remainingSubscribers = prevMonth.subscribers * monthlyRetentionRate;

      // Calculate monthly unsubscribes for this month
      const monthlyUnsubscribes = Math.round(prevMonth.subscribers * (1 - monthlyRetentionRate));

      // Calculate cost to replenish churned subscribers
      const replenishmentCost = monthlyUnsubscribes * inputs.adConversionCost;

      // Calculate display ad earnings based on RPM
      const dailyPageviews = prevMonth.subscribers * initialPageviewsPerSubscriber;
      const dailyDisplayEarnings = (dailyPageviews / 1000) * inputs.displayAdRPM;
      const monthlyDisplayEarnings = dailyDisplayEarnings * 30;

      // NEW: Calculate net available earnings after replenishment cost
      const netAvailableEarnings = Math.max(0, monthlyDisplayEarnings - replenishmentCost);

      // NEW: For month 1 and beyond, reinvest only what's left after replenishment cost
      reinvestedEarnings = netAvailableEarnings;

      // Total ad spend is personal ad spend plus reinvested earnings (after replenishment cost)
      const totalAdSpend = personalAdSpend + reinvestedEarnings;

      // Calculate new subscribers from total ad spend
      const newSubscribers = totalAdSpend / inputs.adConversionCost;

      // Update total subscribers (remaining + new)
      subscribers = remainingSubscribers + newSubscribers;

      // Monthly profit is initially zero as all earnings are reinvested
      const monthlyProfit = 0;

      // Store current month's data
      results.push({
        month,
        subscribers: Math.round(subscribers),
        monthlyUnsubscribes,
        replenishmentCost,
        dailyPageviews: Math.round(dailyPageviews),
        monthlyDisplayEarnings,
        personalAdSpend,
        reinvestedEarnings,
        netAvailableEarnings,
        totalAdSpend,
        monthlyProfit,
        cumulativeProfit: results[month - 1].cumulativeProfit
      });
    }

    return results;
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const currentMetrics = calculations[0];
  const finalMetrics = calculations[calculations.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <SafeIcon icon={FiTrendingUp} className="text-blue-600" />
            Newsletter Profit Calculator
          </h1>
          <p className="text-gray-600">Project your newsletter's growth with profit reinvestment</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <SafeIcon icon={FiBarChart3} className="text-blue-600" />
                Input Variables
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Monthly Ad Spend ($)
                    <span className="text-xs text-gray-500 block">Your starting monthly investment</span>
                  </label>
                  <input
                    type="number"
                    value={inputs.personalAdSpend}
                    onChange={(e) => handleInputChange('personalAdSpend', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost per Subscriber ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputs.adConversionCost}
                    onChange={(e) => handleInputChange('adConversionCost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Subscribers
                  </label>
                  <input
                    type="number"
                    value={inputs.currentSubscribers}
                    onChange={(e) => handleInputChange('currentSubscribers', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Daily Pageviews
                  </label>
                  <input
                    type="number"
                    value={inputs.dailyPageviews}
                    onChange={(e) => handleInputChange('dailyPageviews', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Ad RPM ($)
                    <span className="text-xs text-gray-500 block">Revenue per 1000 pageviews</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputs.displayAdRPM}
                    onChange={(e) => handleInputChange('displayAdRPM', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Unsubscribe Rate (%)
                    <span className="text-xs text-gray-500 block">Percentage of subscribers who unsubscribe daily</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputs.dailyUnsubscribeRate}
                    onChange={(e) => handleInputChange('dailyUnsubscribeRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projection Period (months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={inputs.projectionMonths}
                    onChange={(e) => handleInputChange('projectionMonths', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiDollarSign} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Updated Profit Reinvestment Strategy</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Replenishment costs are deducted from monthly earnings first, then remaining earnings are reinvested
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            className="lg:col-span-2 space-y-6"
          >
            <MetricsGrid currentMetrics={currentMetrics} finalMetrics={finalMetrics} />
            <ProfitChart data={calculations} />
            <ProjectionTable data={calculations} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;