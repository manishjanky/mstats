import React, { Fragment } from 'react';
import './App.scss';

export default class App extends React.Component<any, any> {
  state = {
    dataSet: '',
    separator: ',',
    mean: '',
    mode: '',
    median: '',
    variance: '',
    standardDeviation: ''

  }
  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-light bg-info">
          <h3 className="navbar-brand">mStats</h3>
        </nav>
        <div className="card p-2">
          <div className="form-group">
            <label>Dataset</label>
            <textarea onChange={(event) => { this.setState({ dataSet: event.target.value }) }} className="form-control" rows={4}></textarea>
            <span>*Comma (,) separated values</span>
          </div>
          <div className="form-group">
            <label>Separator</label>
            <input value={','} onChange={(event) => { this.setState({ separator: event.target.value }) }} className="form-control" />
            <span>*Separator if not comma (,)</span>
          </div>
          <div className="form-group ">
            <button onClick={this.analyse} className="btn btn-primary">Analyse</button>
          </div>
          <div className="row">
            <div className="col s12 m4">
              <label>Mean</label>
              <input value={this.state.mean} className="form-control" />
            </div>
            <div className="col s12 m4">
              <label>Mode</label>
              <input value={this.state.mode} className="form-control" />
            </div>

            <div className="col s12 m4">
              <label>Median</label>
              <input value={this.state.median} className="form-control" />
            </div>
          </div>

          <div className="row">
            <div className="col s12 m6">
              <label>Variance</label>
              <input value={this.state.variance} className="form-control" />
            </div>
            <div className="col s12 m6">
              <label>Standard Deviation</label>
              <input value={this.state.standardDeviation} className="form-control" />
            </div>
          </div>
        </div>
      </Fragment>

    );
  }

  analyse = () => {
    const prom = new Promise((resolve, reject) => {
      debugger
      let dataSet: any[] = this.state.dataSet.split(this.state.separator);
      dataSet = dataSet.map((val) => {
        return parseFloat(val.trim());
      });
      const length = dataSet.length;
      this.calculateMean(dataSet, length).then((mean: any) => {
        this.setState({ mean: mean });
        this.calculateVarianceAndSD(dataSet, length, mean).then((val: any) => {
          this.setState({ variance: val.variance, standardDeviation: val.standardDeviation });
        }).catch((error) => {
          this.setState({ mean: 'Calculation Error' });
        });
      }).catch((error) => {
        this.setState({ mean: 'Calculation Error' });
      });

      this.calculateMedian(dataSet, length).then((median) => {
        this.setState({ median: median });
      }).catch((error) => {
        this.setState({ mean: 'Calculation Error' });
      });

      this.calculateMode(dataSet, length).then((mode) => {
        this.setState({ mode: mode });
      }).catch((error) => {
        this.setState({ mean: 'Calculation Error' });
      });
    });
    return prom;
  }

  /** Calculate Mean */
  calculateMean = (dataSet: any[], length: number) => {
    const prom = new Promise((resolve, reject) => {
      try {
        const sum = dataSet.reduce((acc: any, cur: any) => { return acc + cur }, 0);
        const mean = sum / length;
        resolve(mean.toFixed(5));
      } catch{
        reject(0);
      }
    });
    return prom;
  }

  /** Calculate Mode */
  calculateMode = (dataSet: any[], length: number) => {
    const prom = new Promise((resolve, reject) => {
      try {
        if (dataSet.length == 0){
          return null;
        }
        const modeMap: any = {};
        var maxEl = dataSet[0], maxCount = 1;
        for (var i = 0; i < dataSet.length; i++) {
          const el = dataSet[i];
          if (modeMap[el] == null)
            modeMap[el] = 1;
          else
            modeMap[el]++;
          if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
          }
        }
        resolve(maxEl);
      } catch{
        reject(0);
      }
    });
    return prom;
  }

  /** Calculate Median */
  calculateMedian = (dataSet: any[], length: number) => {
    const prom = new Promise((resolve, reject) => {
      try {
        dataSet = dataSet.sort((a, b) => a - b);
        if (length % 2 !== 0) {
          resolve(dataSet[(length + 1) / 2]);
        } else {
          const n2th = dataSet[length / 2];
          const n12th = dataSet[length / 2 + 1];
          resolve((n2th + n12th) / 2);
        }
      } catch{
        reject(0);
      }
    });
    return prom;
  }

  /** Calculate Variance and Standard deviation */
  calculateVarianceAndSD = (dataSet: any[], length: number, mean: number) => {
    const prom = new Promise((resolve, reject) => {
      try {
        let variance = dataSet.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
        variance = variance / length;
        resolve({
          variance: variance.toFixed(5),
          standardDeviation: Math.sqrt(variance).toFixed(5)
        });
      } catch{
        reject(0);
      }
    });
    return prom;
  }



}
