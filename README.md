# Software - Control Station

[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-backend.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-backend.yaml)
[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-ethernet-view.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-ethernet-view.yaml)
[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-control-station.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-control-station.yaml)

Hyperloop UPV's Control Station is a unified software solution for real-time monitoring and commanding of the pod. It combines a back-end (Go) that ingests and interprets sensor data–defined via the JSON-based "ADJ" specifications–and a front-end (Typescript/React) that displays metrics, logs, and diagnostics to operators. With features like packet parsing, logging, and live dashboards, it acts as the central hub to safely interface the pod, making it easier for team members to oversee performance, detect faults, and send precise orders to the vehicle.

### Installation - user

Download the last release, unzip it and leave the executable compatible with your OS in the folder.

### Installation - dev

Clone the repository, execute `npm i` at `ethernet-view`, `control-station` and `common-front`. Then run `npm run build` in `common-front`.

### Usage

When using the Control Station make sure that you have configured your IP as the one specified in the ADJ—usually `192.168.0.9`. Then make sure to configure the boards you'll be making use of in the `config.toml` (at the top of the file you'll be able to see the `vehicle/boards` option, just add or remove the boards as needed following the format specified in the ADJ.

To change the ADJ branch from `main`, change the option `adj/branch` at the end of the `config.toml` with the name of the branch you want to use or leave it blank if you'll be making use of a custom ADJ.

### Developing

The main project file is inside `backend/cmd`. Ensure you have the proper `config.toml` configuration and are in the `develop` branch. To build the project, just run `go build` inside the folder. With everything set up, execute the `cmd` executable, then move to `ethernet-view` and run `npm run dev`, then to the `control-station` and do the same.

If you want to test the app in your local enviorement make use of the locahost—make sure to configure the full range of `127.0.0.X`. The `software` ADJ branch is recommended but you can create your own or use a local branch, in such case make sure to leave blank the `adj/branch` option in the `config.toml`.

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to contribute to the Control Station.

### About

HyperloopUPV is a student team based at Universitat Politècnica de València (Spain), which works every year to develop the transport of the future, the hyperloop. Check out [our website](https://hyperloopupv.com/#/)
