import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { JournalEntry } from '@/types';
import { Svg, Path, Circle } from 'react-native-svg';

interface ScorePoint {
  date: string;
  score: number;
  formattedDate: string;
}

interface ScoreLineChartProps {
  entries: JournalEntry[];
  days?: number;
}

const ScoreLineChart: React.FC<ScoreLineChartProps> = ({ entries, days = 7 }) => {
  // Filter entries with analysis and sort by date
  const entriesWithScores = entries
    .filter(entry => entry.analysis?.score !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Take the last 'days' entries
  const recentEntries = entriesWithScores.slice(-days);
  
  if (recentEntries.length < 2) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
          Not enough data to show a trend. Write more journal entries to see your progress.
        </Text>
      </View>
    );
  }
  
  // Format the data for the chart
  const dataPoints: ScorePoint[] = recentEntries.map(entry => {
    const date = new Date(entry.date);
    return {
      date: entry.date,
      score: entry.analysis?.score || 0,
      formattedDate: `${date.getMonth() + 1}/${date.getDate()}`
    };
  });
  
  // Find min and max scores for scaling
  const minScore = Math.min(...dataPoints.map(point => point.score));
  const maxScore = Math.max(...dataPoints.map(point => point.score));
  
  // Calculate the range with some padding
  const range = maxScore - minScore + 20; // Add padding
  const minDisplay = Math.max(0, minScore - 10);
  const maxDisplay = Math.min(100, maxScore + 10);
  
  // Chart dimensions
  const chartWidth = Dimensions.get('window').width - 64; // Padding on both sides
  const chartHeight = 150;
  
  // Calculate positions for each point
  const points = dataPoints.map((point, index) => {
    const x = (index / (dataPoints.length - 1)) * chartWidth;
    const normalizedScore = (point.score - minDisplay) / (maxDisplay - minDisplay);
    const y = chartHeight - (normalizedScore * chartHeight);
    return { x, y, ...point };
  });
  
  // Generate SVG path for the line
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  // Get score trend
  const firstScore = dataPoints[0].score;
  const lastScore = dataPoints[dataPoints.length - 1].score;
  const scoreDifference = lastScore - firstScore;
  
  let trendMessage = "";
  if (scoreDifference > 10) {
    trendMessage = "Your mental wellbeing has improved significantly!";
  } else if (scoreDifference > 5) {
    trendMessage = "Your mental wellbeing is improving.";
  } else if (scoreDifference < -10) {
    trendMessage = "Your mental wellbeing has declined. Consider self-care activities.";
  } else if (scoreDifference < -5) {
    trendMessage = "Your mental wellbeing is slightly lower. Take some time for yourself.";
  } else {
    trendMessage = "Your mental wellbeing is relatively stable.";
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mental Wellbeing Trend</Text>
      
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{maxDisplay}</Text>
          <Text style={styles.axisLabel}>{Math.round((maxDisplay + minDisplay) / 2)}</Text>
          <Text style={styles.axisLabel}>{minDisplay}</Text>
        </View>
        
        {/* Chart area */}
        <View style={styles.chart}>
          {/* Grid lines */}
          <View style={[styles.gridLine, { top: 0 }]} />
          <View style={[styles.gridLine, { top: chartHeight / 2 }]} />
          <View style={[styles.gridLine, { top: chartHeight }]} />
          
          {/* Line path using react-native-svg */}
          <View style={styles.linePath}>
            <Svg height={chartHeight} width={chartWidth}>
              <Path
                d={pathData}
                stroke={colors.primary}
                strokeWidth="2"
                fill="none"
              />
              
              {/* Data points */}
              {points.map((point, index) => (
                <Circle
                  key={index}
                  cx={point.x.toString()}
                  cy={point.y.toString()}
                  r="4"
                  fill={getScoreColor(point.score)}
                  stroke="white"
                  strokeWidth="1"
                />
              ))}
            </Svg>
          </View>
        </View>
      </View>
      
      {/* X-axis labels */}
      <View style={styles.xAxis}>
        {points.map((point, index) => (
          <Text key={index} style={styles.dateLabel}>
            {point.formattedDate}
          </Text>
        ))}
      </View>
      
      <Text style={styles.trendMessage}>{trendMessage}</Text>
    </View>
  );
};

const getScoreColor = (score: number) => {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.primary;
  if (score >= 40) return colors.accent;
  if (score >= 20) return colors.warning;
  return colors.error;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    marginBottom: 8,
  },
  yAxis: {
    width: 30,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  axisLabel: {
    fontSize: 10,
    color: colors.gray[500],
  },
  chart: {
    flex: 1,
    height: '100%',
    position: 'relative',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[300],
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  linePath: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30, // Align with chart
  },
  dateLabel: {
    fontSize: 10,
    color: colors.gray[500],
    textAlign: 'center',
  },
  trendMessage: {
    fontSize: 14,
    color: colors.gray[700],
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noDataContainer: {
    padding: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    marginVertical: 16,
  },
  noDataText: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
  },
});

export default ScoreLineChart;