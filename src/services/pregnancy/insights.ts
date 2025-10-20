export type WeeklyInsight = {
  week: number;
  title: string;
  description: string;
};

const STATIC_INSIGHTS: WeeklyInsight[] = [
  { week: 12, title: 'Week 12', description: 'Your baby is about the size of a plum. Many critical systems are formed.' },
  { week: 20, title: 'Week 20', description: 'Halfway there! You may feel regular movement. Anatomy scan is common.' },
  { week: 28, title: 'Week 28', description: 'Third trimester begins. Keep track of fetal movements and appointments.' },
  { week: 36, title: 'Week 36', description: 'Baby is almost full term. Prepare your hospital bag and birth plan.' },
  { week: 40, title: 'Week 40', description: 'Due date week. Stay in touch with your provider for next steps.' },
];

export const getInsightForWeek = (week: number): WeeklyInsight => {
  const found = STATIC_INSIGHTS.find(i => i.week === week);
  if (found) return found;
  return {
    week,
    title: `Week ${week}`,
    description: 'Baby is growing and developing every day. Continue healthy habits and regular checkups.',
  };
};
