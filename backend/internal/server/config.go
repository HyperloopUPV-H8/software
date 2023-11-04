package server

type Config map[string]ServerConfig

type ServerConfig struct {
	Addr           string         `toml:"address" default:"localhost:4000"`
	MaxConnections *int32         `toml:"client_limit,omitempty"`
	Endpoints      EndpointConfig `toml:"endpoints"`
	StaticPath     string         `toml:"static" default:"./static"`
}

type EndpointConfig struct {
	PodData           string `toml:"pod_data" default:"/podDataStructure"`
	OrderData         string `toml:"order_data" default:"/orderStructures"`
	ProgramableBoards string `toml:"programable_boards" default:"/uploadableBoards"`
	Connections       string `toml:"connections" default:"/backend"`
	Files             string `toml:"files" default:"/"`
}

type EndpointData struct {
	PodData           any
	OrderData         any
	ProgramableBoards any
}
