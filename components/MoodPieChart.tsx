import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, moodColors } from '@/constants/colors';
import { Mood } from '@/types';
import { Svg, G, Path, Circle } from 'react-native-svg';

interface MoodDistribution {
  mood: Mood;
  count: number;
  percentage: number;
}

interface MoodPieChartProps {
  moodDistribution: MoodDistribution[];
}

const MoodPieChart: React.FC<MoodPieChartProps> = ({ moodDistribution }) => {
  // Sort by percentage descending to make the chart look better
  const sortedData = [...moodDistribution].sort((a, b) => b.percentage - a.percentage);
  
  // Calculate SVG pie chart segments
  const createPieSegment = (percentage: number, startAngle: number, color: string) => {
    if (percentage === 0) return null;
    if (percentage === 100) {
      // Full circle
      return (
        <Circle
          cx="50"
          cy="50"
          r="50"
          fill={color}
        />
      );
    }
    
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;
    
    // Calculate the path
    const x1 = 50 + 50 * Math.cos(startAngle);
    const y1 = 50 + 50 * Math.sin(startAngle);
    const x2 = 50 + 50 * Math.cos(endAngle);
    const y2 = 50 + 50 * Math.sin(endAngle);
    
    // Determine if the arc should be drawn as a large arc
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    // Create the path data
    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    return <Path d={pathData} fill={color} />;
  };
  
  // Calculate segments
  const segments = [];
  let currentAngle = -Math.PI / 2; // Start from the top
  
  for (const item of sortedData) {
    if (item.percentage > 0) {
      const segment = createPieSegment(
        item.percentage,
        currentAngle,
        moodColors[item.mood]
      );
      
      if (segment) {
        segments.push(
          <G key={item.mood}>
            {segment}
          </G>
        );
      }
      
      currentAngle += (item.percentage / 100) * 2 * Math.PI;
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width="100" height="100" viewBox="0 0 100 100">
          {segments}
        </Svg>
      </View>
      
      <View style={styles.legendContainer}>
        {sortedData.map((item) => (
          <View key={item.mood} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: moodColors[item.mood] }
              ]} 
            />
            <Text style={styles.legendText}>
              {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)} ({item.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.gray[700],
  },
});

export default MoodPieChart;