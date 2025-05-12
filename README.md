# Software - Control Station

[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-backend.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-backend.yaml)
[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-ethernet-view.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-ethernet-view.yaml)
[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-control-station.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-control-station.yaml)

Hyperloop UPV's Control Station is a unified software solution for real-time monitoring and commanding of the pod. It combines a back-end (Go) that ingests and interprets sensor data–defined via the JSON-based "ADJ" specifications–and a front-end (Typescript/React) that displays metrics, logs, and diagnostics to operators. With features like packet parsing, logging, and live dashboards, it acts as the central hub to safely interface the pod, making it easier for team members to oversee performance, detect faults, and send precise orders to the vehicle.

### Installation

Download the last release, unzip it and leave the executable compatible with your OS in the folder.

### Developing

The main project file is inside `backend/cmd`. Ensure you have the proper `config.toml` configuration and are in the `develop` branch. To build the project, just run `go build` inside the folder. With everything set up, execute the `cmd` executable, then move to `ethernet-view` and run `npm run dev`, then to the `control-station` and do the same.

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to contribute to the Control Station.

### About

HyperloopUPV is a student team based at Universitat Politècnica de València (Spain), which works every year to develop the transport of the future, the hyperloop. Check out [our website](https://hyperloopupv.com/#/)
