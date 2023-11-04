# Ethernet View - Backend

This is the official backend for the HyperloopUPV verification software *Ethernet View*.

## Building

The main project file is inside `cmd`, each of the folders contains one version of the backend, the latest is the one with the highest number (so `cmd/MVP-2` is more recent than `cmd/MVP-1`).
To build the project just run `go build` inside one of these folders. In order to run there are three more files that need to be present in the same folder as the executable:
* The frontend build located in a folder named `static` (as the backend also serves the webpage)
* A `.env` with all the configuration options (the one in the repo lists all the possible options)
* The `secret.json` to access the Google API to download the excel (this is only available to us)

alternatively you can download a version that is ready for production from the releases.

## Authors

* [Juan Martinez Alonso](https://github.com/jmaralo)
* [Sergio Moreno Suay](https://github.com/smorsua)
* [Felipe Zaballa Martinez](https://github.com/lipezaballa)
* [Alejandro Losa](https://github.com/Losina24)

## About

HyperloopUPV is a student team based at Universitat Politècnica de València (Spain) working every year to develop the transport of the future, the hyperloop.
[Our website](https://hyperloopupv.com/#/)
