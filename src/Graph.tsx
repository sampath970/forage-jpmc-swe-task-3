import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    // Updated schema to track ratio, bounds, and alert
    const schema = {
      ratio: 'float',             // New field for the ratio between stocks
      upper_bound: 'float',       // New field for the upper bound
      lower_bound: 'float',       // New field for the lower bound
      trigger_alert: 'float',     // New field to indicate if an alert is triggered
      timestamp: 'date',          // Field for the timestamp
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line'); // Set view type to y_line
      elem.setAttribute('column-pivots', '[]'); // No column pivots needed, as we are focusing on ratios
      elem.setAttribute('row-pivots', '["timestamp"]'); // Use timestamp for x-axis
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound", "trigger_alert"]'); // Focus on new fields
      elem.setAttribute('aggregates', JSON.stringify({
        ratio: 'avg',               // Average ratio
        upper_bound: 'last',       // Last value for upper bound
        lower_bound: 'last',       // Last value for lower bound
        trigger_alert: 'last',     // Last value for alert trigger
        timestamp: 'distinct count', // Count distinct timestamps
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(
        DataManipulator.generateRow(this.props.data), // Update table with new data
      );
    }
  }
}

export default Graph;
