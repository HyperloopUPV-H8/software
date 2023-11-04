package document

type Document struct {
	Sheets map[string]Sheet
}

type Sheet = [][]string
