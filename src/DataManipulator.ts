import { ServerRespond } from './DataStreamer';

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Record<string, (string | number | boolean | Date)[]> {
    return {
      ratio: serverResponds.map(el => el.top_ask.price / el.top_bid.price), // Calculate ratio
      upper_bound: serverResponds.map(() => 1.1), // Example value; replace with actual logic
      lower_bound: serverResponds.map(() => 0.99), // Example value; replace with actual logic
      trigger_alert: serverResponds.map(el => {
        const ratio = el.top_ask.price / el.top_bid.price;
        // Return the ratio or a default value (e.g., 0) if no alert is triggered
        return ratio > 1.1 || ratio < 0.99 ? ratio : 0; 
      }), // Determine if an alert should be triggered
      timestamp: serverResponds.map(el => el.timestamp),
    };
  }
}
