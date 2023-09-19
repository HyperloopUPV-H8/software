package update_factory

import (
	"fmt"
	"math"
	"math/rand"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"

	"github.com/HyperloopUPV-H8/h9-backend/internal/update_factory/models"
	vehicle_models "github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

const DEFAULT_ORDER = 100
const ORDER_SCALE = 0.1
const ORDER_OFFSET = -20
const ORDER_INTERPOLATION = 1
const ORDER_UP_LIMIT = 200
const ORDER_LO_LIMIT = 1

type UpdateFactory struct {
	count           map[uint16]uint64
	averageMx       *sync.Mutex
	cycleTimeAvg    map[uint16]*common.MovingAverage[float64]
	timestamp       map[uint16]uint64
	fieldAvg        map[uint16]map[string]*common.MovingAverage[float64]
	countMx         *sync.Mutex
	packetCount     map[uint16]uint
	lastPacketCount map[uint16]float64
	trace           zerolog.Logger
}

func NewFactory() *UpdateFactory {
	trace.Info().Msg("new update factory")
	factory := &UpdateFactory{
		count:           make(map[uint16]uint64),
		averageMx:       &sync.Mutex{},
		cycleTimeAvg:    make(map[uint16]*common.MovingAverage[float64]),
		timestamp:       make(map[uint16]uint64),
		fieldAvg:        make(map[uint16]map[string]*common.MovingAverage[float64]),
		countMx:         &sync.Mutex{},
		packetCount:     make(map[uint16]uint),
		lastPacketCount: make(map[uint16]float64),
		trace:           trace.With().Str("component", "updateFactory").Logger(),
	}

	go factory.adjustOrder()

	return factory
}

func (factory *UpdateFactory) NewUpdate(packetUpdate vehicle_models.PacketUpdate) models.Update {
	factory.updateCount(packetUpdate.Metadata.ID)

	factory.averageMx.Lock()
	defer factory.averageMx.Unlock()

	return models.Update{
		Id:        packetUpdate.Metadata.ID,
		HexValue:  fmt.Sprintf("%x", packetUpdate.HexValue),
		Values:    factory.getFields(packetUpdate.Metadata.ID, packetUpdate.Values),
		Count:     factory.getCount(packetUpdate.Metadata.ID),
		CycleTime: factory.getCycleTime(packetUpdate.Metadata.ID, uint64(packetUpdate.Metadata.Timestamp.UnixNano())),
	}
}

func (factory *UpdateFactory) updateCount(id uint16) {
	factory.countMx.Lock()
	defer factory.countMx.Unlock()
	factory.packetCount[id]++
}

func (factory *UpdateFactory) adjustOrder() {
	for range time.NewTicker(time.Second).C {
		factory.updateOrders()
	}
}

func (factory *UpdateFactory) updateOrders() {
	factory.averageMx.Lock()
	defer factory.averageMx.Unlock()
	factory.countMx.Lock()
	defer factory.countMx.Unlock()

	for id := range factory.packetCount {
		factory.updateOrder(id, factory.packetCount[id], factory.lastPacketCount[id])
	}
	factory.resetCount()
}

func (factory *UpdateFactory) resetCount() {
	for id := range factory.packetCount {
		factory.packetCount[id] = 0
	}
}

func (factory *UpdateFactory) updateOrder(id uint16, count uint, prev float64) {
	newSize := getNewSize(count, prev)
	factory.lastPacketCount[id] = (float64)(newSize)
	for _, fieldAvg := range factory.fieldAvg[id] {
		fieldAvg.Resize(newSize)
	}
	factory.cycleTimeAvg[id].Resize(newSize)
}

func getNewSize(count uint, prev float64) uint {
	next_size := ((float64)(count) * ORDER_SCALE) + ORDER_OFFSET
	if newSize := (uint)(prev + ((next_size - prev) * ORDER_INTERPOLATION)); newSize <= ORDER_LO_LIMIT {
		return ORDER_LO_LIMIT
	} else if newSize > ORDER_UP_LIMIT {
		return ORDER_UP_LIMIT
	} else {
		return newSize
	}
}

func (factory *UpdateFactory) getCount(id uint16) uint64 {
	if _, ok := factory.count[id]; !ok {
		factory.count[id] = 0
	}

	factory.count[id] += 1

	return factory.count[id]
}

func (factory *UpdateFactory) getFields(id uint16, fields map[string]packet.Value) map[string]models.UpdateValue {
	updateFields := make(map[string]models.UpdateValue, len(fields))

	for name, value := range fields {
		switch value := value.(type) {
		case packet.Numeric:
			switch name {
			case "low_battery_temperature_1":
				randOffset := (rand.Float64()*2 - 1) * 0.1
				randResult := float64(value) + 67 + randOffset
				updateFields[name] = factory.getNumericField(id, name, packet.Numeric(randResult))
			// case "battery_temperature_1":
			// 	randOffset := (rand.Float64()*2 - 1) * 0.1
			// 	randResult := float64(value) + 5 + randOffset
			// 	updateFields[name] = factory.getNumericField(id, name, packet.Numeric(randResult))

			// case "battery_temperature_2":
			// 	randOffset := (rand.Float64()*2 - 1) * 0.1
			// 	randResult := float64(value) + 5 + randOffset
			// 	updateFields[name] = factory.getNumericField(id, name, packet.Numeric(randResult))

			// case "battery_temperature_3":
			// 	randOffset := (rand.Float64()*2 - 1) * 0.1
			// 	randResult := float64(value) + 5 + randOffset
			// 	updateFields[name] = factory.getNumericField(id, name, packet.Numeric(randResult))
			default:
				updateFields[name] = factory.getNumericField(id, name, packet.Numeric(value))
			}

		case packet.Boolean:
			updateFields[name] = models.BooleanValue(value)
		case packet.Enum:
			updateFields[name] = models.EnumValue(value)
		}
	}

	return updateFields
}

func replaceInvalidNumber(num float64) float64 {
	if math.IsInf(num, 1) {
		return replaceInf(1)
	} else if math.IsInf(num, -1) {
		return replaceInf(-1)
	} else if math.IsNaN(num) {
		return replaceNaN()
	}

	return num
}

func replaceInf(sign int) float64 {
	if sign >= 1 {
		// return math.MaxFloat64
		return 0
	} else {
		// return -math.MaxFloat64
		return 0
	}
}

func replaceNaN() float64 {
	return 0
}

func (factory *UpdateFactory) getNumericField(id uint16, name string, value packet.Numeric) models.NumericValue {
	lastVal := replaceInvalidNumber(float64(value))
	avg := factory.getAverage(id, name)
	lastAvg := avg.Add(lastVal)

	if math.IsInf(lastAvg, 0) {
		factory.resetAverage(id, name)
		return models.NumericValue{Value: lastVal, Average: 0}

	}

	return models.NumericValue{Value: lastVal, Average: lastAvg}
}

func (factory *UpdateFactory) getAverage(id uint16, name string) *common.MovingAverage[float64] {
	averages, ok := factory.fieldAvg[id]
	if !ok {
		averages = make(map[string]*common.MovingAverage[float64])
		factory.fieldAvg[id] = averages
	}

	average, ok := averages[name]
	if !ok {
		average = common.NewMovingAverage[float64](DEFAULT_ORDER)
		averages[name] = average
	}

	return average
}

func (factory *UpdateFactory) resetAverage(id uint16, name string) {
	averages, ok := factory.fieldAvg[id]
	if !ok {
		factory.trace.Warn().Uint16("id", id).Msg("packet average not found")
		return
	}

	_, ok = averages[name]
	if !ok {
		factory.trace.Warn().Str("id", name).Msg("measurement average not found")
		return
	}

	factory.fieldAvg[id][name] = common.NewMovingAverage[float64](DEFAULT_ORDER)

}

func (factory *UpdateFactory) getCycleTime(id uint16, timestamp uint64) uint64 {
	average, ok := factory.cycleTimeAvg[id]
	if !ok {
		average = common.NewMovingAverage[float64](DEFAULT_ORDER)
		factory.cycleTimeAvg[id] = average
	}

	last, ok := factory.timestamp[id]
	if !ok {
		last = timestamp
		factory.timestamp[id] = last
	}

	cycleTime := timestamp - last
	factory.timestamp[id] = timestamp

	cycleTimeAvg := average.Add((float64)(cycleTime))
	return uint64(cycleTimeAvg)
}
