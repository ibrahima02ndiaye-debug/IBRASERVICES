import { Appointment } from '../types';

/**
 * A simple scheduling algorithm placeholder.
 * In a real-world application, this could be a complex function that considers:
 * - Mechanic availability and skills
 * - Service duration estimates
 * - Bay availability
 * - Part availability
 * - Client preferences
 */

interface ScheduleSuggestion {
  mechanic: string;
  startTime: string;
  endTime: string;
}

const MOCK_MECHANICS = ['Bob', 'Alice', 'Charlie'];
const WORKING_HOURS = { start: 9, end: 17 }; // 9 AM to 5 PM

/**
 * Finds the next available slot for a given service type.
 * This is a very basic implementation that just finds the next hour slot.
 * @param existingAppointments - A list of already scheduled appointments.
 * @param serviceDurationHours - Estimated duration of the service in hours.
 * @returns A schedule suggestion or null if no slot is found.
 */
export const findNextAvailableSlot = (
  existingAppointments: Appointment[],
  serviceDurationHours: number = 2
): ScheduleSuggestion | null => {
  const now = new Date();
  let searchTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), WORKING_HOURS.start);

  // Start searching from today
  for (let i = 0; i < 7; i++) { // Search up to 7 days in the future
    while (searchTime.getHours() < WORKING_HOURS.end) {
      const potentialEndTime = new Date(searchTime.getTime() + serviceDurationHours * 60 * 60 * 1000);

      // Check for conflicts with existing appointments for each mechanic
      for (const mechanic of MOCK_MECHANICS) {
        const isConflict = existingAppointments.some(app => {
          if (app.mechanic !== mechanic) return false;
          const appStart = new Date(app.date);
          // Assuming a fixed 2-hour duration for existing appointments for simplicity
          const appEnd = new Date(appStart.getTime() + 2 * 60 * 60 * 1000);
          
          // Basic overlap check
          return (searchTime < appEnd && potentialEndTime > appStart);
        });

        if (!isConflict && potentialEndTime.getHours() <= WORKING_HOURS.end) {
          // Found a free slot
          return {
            mechanic,
            startTime: searchTime.toISOString(),
            endTime: potentialEndTime.toISOString(),
          };
        }
      }

      // Move to the next hour
      searchTime.setHours(searchTime.getHours() + 1);
    }

    // Move to the next day
    searchTime.setDate(searchTime.getDate() + 1);
    searchTime.setHours(WORKING_HOURS.start);
    searchTime.setMinutes(0);
  }

  return null; // No available slot found
};
