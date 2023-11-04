
# Packet Sender

Small utility to generate mock traffic to test the backend.
## Features

- Automatically fetch the ADE.
- Generate random values for numerics
- Supports all types of data
- It's over 9000 packets per second!!!

## Run Locally

Clone the project

```bash
git clone https://github.com/HyperloopUPV-H8/packet-sender.git
```

Go to the project directory

```bash
cd packet-sender
```

Edit go.mod and add the replacement directive at the end of the file

```bash
echo "replace github.com/HyperloopUPV-H8/Backend-H8 => <PATH_TO_BACKEND>" >> go.mod  
```

Build and Run

```bash
go build && ./packet-sender
```

## Authors

- [Juan Martinez Alonso](https://www.github.com/jmaralo)
- [Sergio Moreno Suay](https://www.github.com/smorsua)
- [Felipe Zaballa Martienz](https://www.github.com/lipezaballa)

