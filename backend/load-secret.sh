#!/bin/bash

# Check if exactly one argument is passed
if [ $# -ne 1 ]; then
    echo "Error: expected exactly one argument (path to 'secret.json')."
    exit 1
fi

# Check if the 'secret.json' file exists
if [ ! -f "$1" ]; then
    echo "Error: 'secret.json' file not found at '$1'."
    exit 1
fi

# Copy the 'secret.json' file to the specified directories
cp "$1" "./internal/excel/secret.json" || { echo "Failed to copy to ./internal/excel/"; exit 1; }
cp "$1" "./internal/excel_adapter/internals/secret.json" || { echo "Failed to copy to ./internal/excel_adapter/internals/"; exit 1; }
cp "$1" "./pkg/excel/secret.json" || { echo "Failed to copy to ./pkg/excel/"; exit 1; }
cp "$1" "./pkg/excel_adapter/internals/secret.json" || { echo "Failed to copy to ./pkg/excel_adapter/internals/"; exit 1; }

echo "'secret.json' successfully copied to all specified directories."
