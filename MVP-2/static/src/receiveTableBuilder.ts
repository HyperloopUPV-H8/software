import { Measurement, Packet } from "./modals";

var globalPackets = new Map<string, Packet>();

export function updateReceiveTable(packets: Map<string, Packet>) {
  updatePackets(packets);
  let tableBody = document.getElementById(
    "tableBody"
  ) as HTMLTableSectionElement;
  tableBody.textContent = "";
  for (let [_, packet] of globalPackets) {
    addPacketToTable(tableBody, packet);
  }
}

function updatePackets(packets: Map<string, Packet>) {
  for (let [id, packet] of packets) {
    packets.set(id, packet);
  }
}

function addPacketToTable(tableBody: HTMLTableSectionElement, packet: Packet) {
  let packetRow = createPacketRow(packet);
  tableBody.append(packetRow);
  let measurementsRows = createMeasurementRows(packet.measurements);
  for (let row of measurementsRows) {
    tableBody.append(row);
  }
}

function createPacketRow(packet: Packet): HTMLTableRowElement {
  let row = document.createElement("tr");
  let id_td = document.createElement("td");
  id_td.innerHTML = packet.id.toString();
  let name_td = document.createElement("td");
  name_td.innerHTML = packet.name.toString();
  let hexValue_td = document.createElement("td");
  hexValue_td.innerHTML = packet.hexValue.toString(16);
  let count_td = document.createElement("td");
  count_td.innerHTML = packet.count.toString();
  let cycleTime_td = document.createElement("td");
  cycleTime_td.innerHTML = packet.cycleTime.toString();

  row.append(id_td);
  row.append(name_td);
  row.append(hexValue_td);
  row.append(count_td);
  row.append(cycleTime_td);
  return row;
}

function createMeasurementRows(
  measurements: Measurement[]
): HTMLTableRowElement[] {
  let rows = [];
  for (let measurement of measurements) {
    let row = document.createElement("tr");
    let data = document.createElement("td");
    let dataString = `${measurement.name}: ${measurement.value} ${measurement.units}`;
    data.innerHTML += dataString;
    data.setAttribute("colspan", "5");
    row.append(data);
    rows.push(row);
  }

  return rows;
}
