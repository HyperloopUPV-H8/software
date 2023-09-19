package ade

import (
	"testing"

	"github.com/xuri/excelize/v2"
)

func TestAde(t *testing.T) {
	t.Run("correct ade is parsed without errors", func(t *testing.T) {
		file, err := excelize.OpenFile("ade.xlsx")

		if err != nil {
			t.Fatalf("opening file: %e", err)
		}

		_, err = CreateADE(file)

		if err != nil {
			t.Fatalf("creating ade: %e", err)
		}
	})

}
