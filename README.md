# Software - Control Station

[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-backend.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-backend.yaml)
[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-ethernet-view.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-ethernet-view.yaml)
[![CI](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-control-station.yaml/badge.svg)](https://github.com/HyperloopUPV-H8/software/actions/workflows/build-control-station.yaml)

This is Hyperloop UPV's Control Station, a program capable of displaying all the Hyperloop prototype and booster data and sending orders to them in real time.

### Installation

Download the last release, unzip it and leave the executable compatible with your OS in the folder.

### Developing

The main project file is inside `backend/cmd`. Make sure to have the proper `config.toml` configuration and that you are in the `develop` branch. To build the project just run `go build` inside the folder. With everything set up execute the `cmd` executable, then move to `ethernet-view` and run `npm run dev`, then to the `control-station` and do the same.  

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to contribute to the Control Station.

### Authors

- [Juan Martinez Alonso](https://github.com/jmaralo)
- [Marc Sanchis Llinares](https://github.com/msanlli)
- [Sergio Moreno Suay](https://github.com/smorsua)
- [Felipe Zaballa Martinez](https://github.com/lipezaballa)
- [Alejandro Losa](https://github.com/Losina24)

### About

HyperloopUPV is a student team based at Universitat Politècnica de València (Spain), which works every year to develop the transport of the future, the hyperloop. Check out [our website](https://hyperloopupv.com/#/)
