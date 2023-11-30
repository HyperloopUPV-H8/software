if [ $# -ne 1 ]; then
    echo "expected at least one argument";
    exit 1;
fi

echo "$1" > "./internal/excel/secret.json"
echo "$1" > "./internal/excel_adapter/internals/secret.json"
echo "$1" > "./pkg/excel/secret.json"
echo "$1" > "./pkg/excel_adapter/internals/secret.json"
