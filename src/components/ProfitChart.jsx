import React from 'react';
import ReactECharts from 'echarts-for-react';
import {motion} from 'framer-motion';

const ProfitChart = ({data}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const option = {
    title: {
      text: 'Projected Growth & Reinvestment',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937'
      },
      left: 'center',
      top: 20
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      formatter: function(params) {
        const month = params[0].axisValue;
        let tooltip = `<strong>Month ${month}</strong><br/>`;
        params.forEach(param => {
          const value = param.seriesName.includes('Spend') || 
                       param.seriesName.includes('Earnings') || 
                       param.seriesName.includes('Investment') || 
                       param.seriesName.includes('Reinvested') || 
                       param.seriesName.includes('Replenishment') || 
                       param.seriesName.includes('Net Available') 
            ? formatCurrency(param.value) 
            : new Intl.NumberFormat('en-US').format(param.value);
          tooltip += `${param.marker} ${param.seriesName}: ${value}<br/>`;
        });
        return tooltip;
      }
    },
    legend: {
      data: [
        'Subscribers',
        'Total Ad Spend',
        'Initial Investment',
        'Reinvested Earnings',
        'Replenishment Cost',
        'Monthly Display Earnings',
        'Net Available Earnings'
      ],
      top: 50,
      textStyle: {
        color: '#6b7280'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 100,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(d => d.month),
      axisLabel: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Subscribers',
        position: 'left',
        axisLabel: {
          color: '#6b7280',
          formatter: function(value) {
            return new Intl.NumberFormat('en-US', {
              notation: 'compact'
            }).format(value);
          }
        },
        axisLine: {
          lineStyle: {
            color: '#3b82f6'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      {
        type: 'value',
        name: 'Amount ($)',
        position: 'right',
        axisLabel: {
          color: '#6b7280',
          formatter: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact'
            }).format(value);
          }
        },
        axisLine: {
          lineStyle: {
            color: '#10b981'
          }
        }
      }
    ],
    series: [
      {
        name: 'Subscribers',
        type: 'line',
        yAxisIndex: 0,
        data: data.map(d => d.subscribers),
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: 'rgba(59,130,246,0.3)'},
              {offset: 1, color: 'rgba(59,130,246,0.05)'}
            ]
          }
        },
        smooth: true
      },
      {
        name: 'Initial Investment',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.personalAdSpend),
        lineStyle: {
          color: '#6366f1',
          width: 2
        },
        itemStyle: {
          color: '#6366f1'
        },
        smooth: true
      },
      {
        name: 'Reinvested Earnings',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.reinvestedEarnings),
        lineStyle: {
          color: '#f59e0b',
          width: 2
        },
        itemStyle: {
          color: '#f59e0b'
        },
        smooth: true
      },
      {
        name: 'Replenishment Cost',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.replenishmentCost),
        lineStyle: {
          color: '#ef4444',
          width: 2
        },
        itemStyle: {
          color: '#ef4444'
        },
        smooth: true
      },
      {
        name: 'Net Available Earnings',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.netAvailableEarnings),
        lineStyle: {
          color: '#059669',
          width: 2,
          type: 'dashed'
        },
        itemStyle: {
          color: '#059669'
        },
        smooth: true
      },
      {
        name: 'Total Ad Spend',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.totalAdSpend),
        lineStyle: {
          color: '#8b5cf6',
          width: 3
        },
        itemStyle: {
          color: '#8b5cf6'
        },
        smooth: true
      },
      {
        name: 'Monthly Display Earnings',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => d.monthlyDisplayEarnings),
        lineStyle: {
          color: '#10b981',
          width: 3
        },
        itemStyle: {
          color: '#10b981'
        },
        smooth: true
      }
    ]
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <ReactECharts
        option={option}
        style={{height: '500px', width: '100%'}}
        opts={{renderer: 'canvas'}}
      />
    </motion.div>
  );
};

export default ProfitChart;