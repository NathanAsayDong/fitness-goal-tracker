import { Event, Goal, Team, User } from "./classes.def";

// Helper function to convert date to Utah time and get the date string
const getUtahDateString = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    // Convert to Mountain Time (Utah timezone)
    const utahDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Denver',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
    
    // Convert MM/DD/YYYY to YYYY-MM-DD format for consistency
    const [month, day, year] = utahDate.split('/');
    return `${year}-${month}-${day}`;
};

export const calculationService = {

    calculateGoalProgress: (user: User, goal: Goal, events: Event[]): number => {
        const goalEvents = events.filter((event) => event.goalId === goal.id);
        return goalEvents.length;
    },

    calculateUserScore: (user: User, goals: Goal[], events: Event[]): number => {
        //this one is a little more complex. for every day, if at least 4 events are logged then the user gets a bonus point
        //so every event is one point plus an extra for each day they have 4 events
        // Group events by date (converted to Utah time)
        
        
        const eventsByDate = events.reduce((acc, event) => {
            const date = getUtahDateString(event.dateTime);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {} as Record<string, Event[]>);

        // Calculate base score (1 point per event)
        const baseScore = events.length;

        // Calculate bonus points for days with 4+ events
        const bonusPoints = Object.values(eventsByDate)
            .filter(dayEvents => dayEvents.length >= 4)
            .length;

        return baseScore + bonusPoints;
    },

    calculateTeamScore: (team: Team, goals: Goal[], events: Event[]): number => {
        //the same logic applies for user scores but now if both team members get the bonus point for the day they also get another
        //bonus point for making sure both team members get all 4 log events
        // Group events by user and date (converted to Utah time)
        const eventsByUserAndDate = events.reduce((acc, event) => {
            const date = getUtahDateString(event.dateTime);
            const userId = event.userId;
            
            if (!acc[date]) {
                acc[date] = {};
            }
            if (!acc[date][userId]) {
                acc[date][userId] = [];
            }
            acc[date][userId].push(event);
            return acc;
        }, {} as Record<string, Record<string, Event[]>>);

        let totalScore = 0;

        // Calculate score for each date
        Object.entries(eventsByUserAndDate).forEach(([date, userEvents]) => {
            // Get events for each team member
            const userOneEvents = userEvents[team.userIdOne] || [];
            const userTwoEvents = userEvents[team.userIdTwo] || [];

            // Base points - 1 point per event
            const userOneBasePoints = userOneEvents.length;
            const userTwoBasePoints = userTwoEvents.length;
            totalScore += userOneBasePoints + userTwoBasePoints;

            // Individual bonus points - 1 point if user has 4+ events
            const userOneBonus = userOneEvents.length >= 4 ? 1 : 0;
            const userTwoBonus = userTwoEvents.length >= 4 ? 1 : 0;
            totalScore += userOneBonus + userTwoBonus;

            // Team bonus point - 1 additional point if both users got their individual bonus
            if (userOneBonus && userTwoBonus) {
                totalScore += 1;
            }
        });

        return totalScore;
    }
}