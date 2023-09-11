// app.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  data: any = {};
  chart: Chart;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  submitData() {
    // Validate the data.
    if (!this.data) {
      return;
    }

    // Send the data to the server.
    this.http.post('/api/timeseries', this.data).subscribe(() => {
      console.log('Data submitted successfully');
      this.fetchData();
    });
  }

  fetchData() {
    this.http.get('/api/timeseries').subscribe(data => {
      this.data = data;
      this.renderChart();
    });
  }

  renderChart() {
    const labels = this.data.map(dataPoint => dataPoint.timestamp);
    const datasets = this.data.map(dataPoint => ({
      label: dataPoint.variable,
      data: dataPoint.values,
    }));

    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        title: {
          text: 'Time Series Data',
        },
      },
    });
  }
}
