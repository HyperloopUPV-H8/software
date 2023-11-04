package excel_adapter

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/fatih/color"

	ade_linter "github.com/HyperloopUPV-H8/ade-linter"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/excel_adapter/internals"
	internalModels "github.com/HyperloopUPV-H8/h9-backend/pkg/excel_adapter/internals/models"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/excel_adapter/models"
	trace "github.com/rs/zerolog/log"
	"github.com/xuri/excelize/v2"
)

type ExcelAdapterConfig struct {
	Download internals.DownloadConfig
	Parse    internals.ParseConfig
}

type ExcelAdapter struct {
	document internalModels.Document
	config   ExcelAdapterConfig
}

func New(config ExcelAdapterConfig) ExcelAdapter {
	document := fetchDocument(config.Download, config.Parse)

	return ExcelAdapter{
		document: document,
		config:   config,
	}
}

func (adapter ExcelAdapter) GetBoards() map[string]models.Board {
	return getBoards(adapter.document, adapter.config.Parse.Global.AddressTable)
}

func (adapter ExcelAdapter) GetGlobalInfo() models.GlobalInfo {
	trace.Trace().Msg("get global info")

	boardIpTable, found := adapter.document.Info.Tables[adapter.config.Parse.Global.AddressTable]

	if !found {
		trace.Fatal().Str("table", adapter.config.Parse.Global.AddressTable).Msg("table not found")
	}

	boardToIp := getBoardIps(boardIpTable)

	return models.GlobalInfo{
		BackendIP:        getBackendIP(adapter.config.Parse.Global.AddressTable, adapter.config.Parse.Global.BackendKey, adapter.document),
		BoardToIP:        boardToIp,
		UnitToOperations: getInfoTableToMap(adapter.config.Parse.Global.UnitsTable, adapter.document),
		ProtocolToPort:   getInfoTableToMap(adapter.config.Parse.Global.PortsTable, adapter.document),
		BoardToId:        getInfoTableToMap(adapter.config.Parse.Global.BoardIdsTable, adapter.document),
		MessageToId:      getInfoTableToMap(adapter.config.Parse.Global.MessageIdsTable, adapter.document),
	}
}

func fetchDocument(downloadConfig internals.DownloadConfig, parseConfig internals.ParseConfig) internalModels.Document {
	trace.Info().Str("id", downloadConfig.Id).Str("path", downloadConfig.Path).Str("name", downloadConfig.Name).Msg("fetch document")

	errDownloading := internals.DownloadFile(downloadConfig)
	if errDownloading != nil {
		trace.Error().Stack().Err(errDownloading).Msg("")
		trace.Warn().Str("id", downloadConfig.Id).Str("path", downloadConfig.Path).Str("name", downloadConfig.Name).Msg("using local document")
	}

	file, err := excelize.OpenFile(filepath.Join(downloadConfig.Path, downloadConfig.Name))
	if err != nil {
		trace.Fatal().Stack().Err(err).Msg("")
	}

	if !ade_linter.Lint(file) {
		if !promptContinue() {
			os.Exit(1)
		}
	}

	return internals.GetDocument(file, parseConfig)
}

func promptContinue() bool {
	fmt.Print(color.WhiteString("Continue with incorrect ADE?"), " ", color.MagentaString("[Y/n]: "))

	for {
		var selection string
		fmt.Scanln(&selection)

		if strings.ToUpper(selection) == "Y" || strings.ToUpper(selection) == "YES" {
			return true
		} else if strings.ToUpper(selection) == "N" || strings.ToUpper(selection) == "NO" {
			return false
		} else {
			fmt.Print(color.WhiteString("Incorrect input, try again: "))
		}
	}
}

func getBoards(document internalModels.Document, addressTableName string) map[string]models.Board {
	trace.Trace().Msg("get boards")
	boards := make(map[string]models.Board, len(document.BoardSheets)-1)
	for name, sheet := range document.BoardSheets {
		trace.Trace().Str("board", name).Msg("add board")
		boards[name] = models.NewBoard(name, getIP(name, document, addressTableName), sheet)
	}
	return boards
}

func getIP(board string, document internalModels.Document, addressTableName string) string {
	for _, row := range document.Info.Tables[addressTableName].Rows {
		if row[0] == board {
			trace.Trace().Str("board", board).Str("addr", row[1]).Msg("get board ip")
			return row[1]
		}
	}

	trace.Fatal().Str("board", board).Msg("missing board ip")
	return ""
}

func getBoardIps(table internalModels.Table) map[string]string {
	mapping := make(map[string]string)

	for _, row := range table.Rows {
		if row[0] != "Backend" {
			mapping[row[0]] = row[1]
		}
	}

	return mapping
}

func getInfoTableToMap(tableName string, document internalModels.Document) map[string]string {
	mapping := make(map[string]string)
	table, found := document.Info.Tables[tableName]
	if !found {
		trace.Fatal().Str("table", tableName).Msg("table not found")
		return nil
	}

	for _, row := range table.Rows {
		mapping[row[0]] = row[1]
	}

	trace.Trace().Str("table", tableName).Msg("get info table")
	return mapping
}

func getBackendIP(addressTableName string, backendKey string, document internalModels.Document) string {
	for _, entry := range document.Info.Tables[addressTableName].Rows {
		if entry[0] == backendKey {
			return entry[1]
		}
	}

	trace.Fatal().Msg("Backend IP not found")
	panic("Backend IP not found") // NEVER RUN BECAUSE trace.Fatal() calls os.exit()
}
